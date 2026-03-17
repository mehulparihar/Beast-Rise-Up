import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const createRazorpayOrder = async (req, res) => {
  console.log("Create Razorpay Order Request Body:", req.body);
  try {
    const { amount, shippingAddress } = req.body; // totalAmount from order

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save temporary payment record
    const paymentDoc = await Payment.create({
      orderId: order.id,
      user: req.user._id,
      amount,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      order,
      payment: paymentDoc,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return res.status(500).json({ success: false, message: "Payment order failed" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    payment.status = "paid";
    payment.orderId = razorpay_payment_id;
    await payment.save();

    const user = await User.findById(payment.user);

    const orderItems = user.cartItems.map(item => ({
      product: item.product._id || item.product,
      quantity: item.quantity,
      price: item.price,
      variant: {
        size: item.size,
        color: item.color,
      },
    }));

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress: payment.shippingAddress,
      payment: payment._id,
      subtotal: payment.amount,
      shipping: 0,
      discount: 0,
      totalAmount: payment.amount,
      paymentMethod: "RAZORPAY",

    });

    // 🧹 CLEAR CART
    user.cartItems = [];
    await user.save();

    return res.json({
      success: true,
      message: "Payment verified & order created",
      orderId: order._id,
    });


  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const markOrderPaid = async (req, res) => {
  try {
    const { orderId } = req.body; // your Order model ID

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as paid",
      order,
    });
  } catch (error) {
    console.error("Order Payment Update Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


