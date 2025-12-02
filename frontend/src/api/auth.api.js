import api from "./axios";


/**
 * POST /auth/signup
 * body: { name, email, password }
 * response: { accessToken, refreshToken, user }
 */
export const signup = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

/**
 * POST /auth/login
 * body: { email, password }
 * response: { accessToken, refreshToken, user }
 */
export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

/**
 * POST /auth/logout
 * body: none
 */
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

/**
 * POST /auth/refresh-token
 * body: { refreshToken }
 * Note: in our axiosInstance we call the refresh endpoint directly with axios (not the instance)
 */
export const refreshToken = async (payload) => {
  const res = await api.post("/auth/refresh-token", payload);
  return res.data;
};

/**
 * GET /auth/profile
 * protected
 */
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

/**
 * POST /auth/forgot-password
 * body: { email }
 */
export const forgotPassword = async (payload) => {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
};

/**
 * POST /auth/reset-password/:token
 * body: { password }
 */
export const resetPassword = async (token, payload) => {
  const res = await api.post(`/auth/reset-password/${token}`, payload);
  return res.data;
};