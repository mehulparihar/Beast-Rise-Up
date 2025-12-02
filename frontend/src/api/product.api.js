// Product endpoints: list, detail, categories, featured, search
import api from "./axios";

/**
 * GET /products?query...
 * options: { page, limit, category, sort, priceMin, priceMax, q }
 */
export const fetchProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

/**
 * GET /products/:id
 */
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

/**
 * GET /products/featured
 */
export const fetchFeatured = async () => {
  const res = await api.get("/products/featured");
  return res.data;
};

/**
 * GET /products/category/:category
 */
export const fetchByCategory = async (category, params = {}) => {
  const res = await api.get(`/products/category/${encodeURIComponent(category)}`, { params });
  return res.data;
};

/**
 * POST /products/search (if backend offers POST search)
 * body: { q, filters... }
 */
export const searchProducts = async (payload) => {
  const res = await api.post("/products/search", payload);
  return res.data;
};
