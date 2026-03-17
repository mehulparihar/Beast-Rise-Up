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
export const updateCartItem = async (payload) => {
  const res = await api.put(`/cart/update`, payload);
  return res.data;
};

/**
 * DELETE /cart/remove/:productId
 */
export const removeFromCart = async (payload) => {
  console.log("API Remove From Cart:", payload);
  const res = await api.delete(`/cart/remove/${payload.productId}`, { data: payload});
  return res.data;
};

/**
 * POST /cart/clear
 */
export const clearCart = async () => {
  const res = await api.post("/cart/clear");
  return res.data;
};
