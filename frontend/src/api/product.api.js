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

/* =========================
   ADMIN ROUTES
========================= */

/**
 * ADMIN: GET /products/admin/all
 */
export const adminGetAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

/**
 * ADMIN: GET /products/admin/:id
 */
export const adminGetProductById = async (id) => {
  const res = await api.get(`/products/admin/${id}`);
  return res.data;
};

/**
 * ADMIN: POST /products/admin
 */
export const adminCreateProduct = async (product, filesMap = {}) => {
  const formData = new FormData()

  // attach primitive fields
  formData.append("title", product.title)
  formData.append("slug", product.slug)
  formData.append("category", product.category)
  formData.append("brand", product.brand)
  formData.append("description", product.description || "")
  formData.append("defaultImage", product.defaultImage || "")

  // attach complex JSON fields
  formData.append("variants", JSON.stringify(product.variants || []))
  formData.append("tags", JSON.stringify(product.tags || []))
  formData.append("features", JSON.stringify(product.features || []))

  // attach files (VERY IMPORTANT)
  Object.entries(filesMap).forEach(([field, file]) => {
    formData.append(field, file)
  })

  const res = await api.post("/products/admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return res.data
}

/**
 * ADMIN: PUT /products/admin/:id
 */
export const adminUpdateProduct = async (id, product, filesMap = {}) => {
  const formData = new FormData()

  formData.append("title", product.title || "")
  formData.append("slug", product.slug || "")
  formData.append("category", product.category || "")
  formData.append("brand", product.brand || "")
  formData.append("description", product.description || "")
  formData.append("variants", JSON.stringify(product.variants || []))
  formData.append("tags", JSON.stringify(product.tags || []))
  formData.append("features", JSON.stringify(product.features || []))
  formData.append("defaultImage", product.defaultImage || "")

  Object.entries(filesMap).forEach(([field, file]) => {
    formData.append(field, file)
  })

  const res = await api.put(`/products/admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * ADMIN: DELETE /products/admin/:id
 */
export const adminDeleteProduct = async (id) => {
  const res = await api.delete(`/products/admin/${id}`);
  return res.data;
};

/**
 * ADMIN: PATCH /products/admin/:id
 */
export const toggleFeaturedProduct = async (id) => {
  const res = await api.patch(`/products/admin/${id}`);
  return res.data;
};