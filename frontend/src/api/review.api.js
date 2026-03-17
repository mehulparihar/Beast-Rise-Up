// Reviews: create, list, update, delete
import api from "./axios";

/**
 * POST /reviews/:productId
 * body: { rating, comment }
 */
export const createReview = async (productId, payload) => {
  const res = await api.post(`/reviews/${productId}`, payload);
  return res.data;
};

/**
 * GET /reviews/product/:productId?page=1
 */
export const fetchProductReviews = async (productId, params = {}) => {
  const res = await api.get(`/reviews/product/${productId}`, { params });
  return res.data;
};

/**
 * PUT /reviews/:reviewId
 */
export const updateReview = async (reviewId, payload) => {
  const res = await api.put(`/reviews/${reviewId}`, payload);
  return res.data;
};

/**
 * DELETE /reviews/:reviewId
 */
export const deleteReview = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};
