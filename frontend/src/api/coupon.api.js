// Coupon endpoints: validate, list (admin)
import api from "./axios";

/**
 * POST /coupons/validate
 * body: { code, totalAmount }
 * returns { coupon, discount, finalAmount }
 */
export const validateCoupon = async (payload) => {
  const res = await api.post("/coupons/validate", payload);
  return res.data;
};

/**
 * ADMIN: GET /coupons
 */
export const adminGetCoupons = async () => {
  const res = await api.get("/coupons");
  return res.data;
};

/**
 * ADMIN: POST /coupons
 */
export const createCoupon = async (payload) => {
  const res = await api.post("/coupons", payload);
  return res.data;
};
