// Wishlist endpoints (toggle or add/remove)
import api from "./axios";

/**
 * GET /wishlist
 */
export const getWishlist = async () => {
  const res = await api.get("/wishlist");
  return res.data;
};

/**
 * POST /wishlist/toggle
 * body: { productId }
 * returns updated wishlist
 */
export const addWishlist = async (payload) => {
  const res = await api.post("/wishlist/add", payload);
  return res.data;
};

/**
 * DELETE /wishlist/:productId
 */
export const removeWishlistItem = async (productId) => {
  const res = await api.delete(`/wishlist/${productId}`);
  return res.data;
};
