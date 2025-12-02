// User-related endpoints (profile, addresses, user management)
import api from "./axios";

/**
 * GET /user/profile  (if your backend uses /auth/profile, use auth.api.js)
 */
export const fetchProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

/**
 * PUT /user (update profile)
 * body: { name, phone, etc. }
 */
export const updateProfile = async (payload) => {
  const res = await api.put("/user", payload);
  return res.data;
};

/**
 * Addresses are stored in user model — endpoints depend on your backend
 * Example:
 * POST /user/addresses  -> add address
 * PUT /user/addresses/:id -> update
 * DELETE /user/addresses/:id -> delete
 */
export const addAddress = async (payload) => {
  const res = await api.post("/user/addresses", payload);
  return res.data;
};

export const updateAddress = async (id, payload) => {
  const res = await api.put(`/user/addresses/${id}`, payload);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/user/addresses/${id}`);
  return res.data;
};
