// Cart endpoints. You said cart is stored on user model so endpoints might be /cart
import api from "./axios";

/**
 * GET /cart
 * returns { cart: [...] }
 */
export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

/**
 * POST /cart/add
 * body: { productId, quantity, variant? }
 */
export const addToCart = async (payload) => {
  const res = await api.post("/cart/add", payload);
  return res.data;
};

/**
 * PUT /cart/update/:productId
 * body: { quantity }
 */
export const updateCartItem = async (productId, payload) => {
  const res = await api.put(`/cart/update/${productId}`, payload);
  return res.data;
};

/**
 * DELETE /cart/remove/:productId
 */
export const removeFromCart = async (productId) => {
  const res = await api.delete(`/cart/remove/${productId}`);
  return res.data;
};

/**
 * POST /cart/clear
 */
export const clearCart = async () => {
  const res = await api.post("/cart/clear");
  return res.data;
};
