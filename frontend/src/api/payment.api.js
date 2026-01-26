// Payment endpoints: create razorpay order on backend, verify payment
import api from "./axios";

/**
 * POST /payment/create-order
 * body: { amount } (in paise)
 * returns { orderId, amount, currency }
 */
export const createPaymentOrder = async (payload) => {
  const res = await api.post("/payments/create-order", payload);
  return res.data;
};

/**
 * POST /payment/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (payload) => {
  const res = await api.post("/payments/verify-payment", payload);
  return res.data;
};

/**
 * (Optional) POST /payment/webhook-handler  (server only)
 */
