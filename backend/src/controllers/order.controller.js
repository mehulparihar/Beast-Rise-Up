import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { orderConfirmationTemplate, sendEmail, orderStatusTemplate } from "../services/sendEmail.js";
import { checkStockAvailability, increaseStockOnCancel, reduceStockOnOrder } from "./inventory.controller.js";


export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, coupon } = req.body;

        const user = await User.findById(req.user._id).populate("cartItems.product");
        if (!user || user.cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }
        await checkStockAvailability(user.cartItems);
        let totalAmount = 0;
        const orderItems = user.cartItems.map((item) => {
            const p = item.product;

            // get product price safely from variants
            const price =
                p?.variants?.[0]?.discountedPrice ??
                p?.variants?.[0]?.price ??
                0;

            if (!price) {
                throw new Error(`Price not found for product: ${p.title}`);
            }

            totalAmount += price * item.quantity;

            return {
                product: p._id,
                quantity: item.quantity,
                price: price,       // REQUIRED BY ORDER MODEL
                variant: null,      // because your user.cartItems has no variant
            };
        });


        if (coupon) {
            const couponDoc = await Coupon.findOne({ code: coupon });

            if (couponDoc && couponDoc.expiry > new Date()) {
                appliedCoupon = couponDoc._id;

                discountAmount =
                    couponDoc.discountType === "percentage"
                        ? (totalAmount * couponDoc.discountValue) / 100
                        : couponDoc.discountValue;

                if (couponDoc.maxDiscount && discountAmount > couponDoc.maxDiscount) {
                    discountAmount = couponDoc.maxDiscount;
                }

                totalAmount = totalAmount - discountAmount;

                couponDoc.usedCount += 1;
                await couponDoc.save();
            }
        }

        const order = new Order({
            user: user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            coupon: coupon || null,
        });

        await order.save();

        // Reduce stock
        await reduceStockOnOrder(order._id);

        // clear user's cart
        user.cartItems = [];
        await user.save();

        // Send Email
        sendEmail({
            to: user.email,
            subject: "Your Order is Confirmed ✔",
            html: orderConfirmationTemplate(order, user),
        });


        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });

    } catch (err) {
        console.error("Create Order Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.product");
        return res.json({ success: true, orders });
    } catch (err) {
        console.error("Get Orders Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("items.product");
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        return res.json({ success: true, order });

    } catch (err) {
        console.error("Get Order By Id Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (err) {
        console.error("Admin Get Orders Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Restore stock if cancelled/refunded
        if (orderStatus === "cancelled" || orderStatus === "refunded") {
            await increaseStockOnCancel(order._id);
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        // send email
        sendEmail({
            to: order.user.email,
            subject: `Order Status Updated: ${orderStatus}`,
            html: orderStatusTemplate(order, orderStatus),
        });


        return res.json({ success: true, message: "Order updated", order });
    } catch (err) {
        console.error("Update Order Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};