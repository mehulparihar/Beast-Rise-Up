// Order endpoints: create order, get orders, admin get all, update status
import api from "./axios";

/**
 * POST /orders
 * body: { shippingAddress, paymentMethod, coupon }
 */
export const createOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

/**
 * GET /orders (for current user)
 */
export const getMyOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

/**
 * GET /orders/:id
 */
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

/**
 * ADMIN: GET /orders/admin/all  (or /orders/admin)
 */
export const adminGetAllOrders = async () => {
  const res = await api.get("/orders/admin/all");
  return res.data;
};

/**
 * ADMIN: PATCH /orders/:id/status
 * body: { orderStatus, paymentStatus }
 */
export const updateOrderStatus = async (id, payload) => {
  const res = await api.patch(`/orders/${id}/status`, payload);
  return res.data;
};
