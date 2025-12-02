import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // totalAmount from order

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // Update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: updatedPayment,
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


