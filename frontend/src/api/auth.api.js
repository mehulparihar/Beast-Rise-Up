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
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
    
  } catch (error) {
    console.error("Login error:", error);
  }
  
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

export const changePassword = async (payload) => {
  const res = await api.put("/auth/change-password", payload);
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put("/auth/profile", payload);
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

export const googleAuth = async (payload) => {
  try {
    const res = await api.post("/auth/google", payload, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Google auth error:", error);
    throw error;
  }
};

/**
 * POST /auth/send-otp
 * body: { email }
 * response: { message: "OTP sent" }
 */
export const sendOtp = async (payload) => {
  const res = await api.post("/auth/send-otp", payload);
  return res.data;
};

/**
 * POST /auth/verify-otp
 * body: { name, email, password, otp }
 * response: { accessToken, refreshToken, user }
 */
export const verifyOtp = async (payload) => {
  const res = await api.post("/auth/verify-otp", payload);
  return res.data;
};



/**
 * ADMIN – Customers
 * Base: /admin/customers
 */

/**
 * GET /admin/customers
 * response: { customers: [] }
 */
export const getAllCustomers = async () => {
  const res = await api.get("/auth/admin/customers");
  return res.data;
};

/**
 * GET /admin/customers/:id
 * response: { customer }
 */
export const getCustomerById = async (id) => {
  const res = await api.get(`/auth/admin/customers/${id}`);
  return res.data;
};

/**
 * PUT /admin/customers/:id
 * body: { name, email, phone, status, address }
 */
export const updateCustomer = async (id, payload) => {
  const res = await api.put(`/auth/admin/customers/${id}`, payload);
  return res.data;
};

/**
 * DELETE /admin/customers/:id
 */
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/auth/admin/customers/${id}`);
  return res.data;
};

/**
 * POST /admin/customers/orders-agg
 * body: { userIds?: [] }
 * response: [{ _id, totalOrders, totalSpent }]
 */
export const getCustomersOrderAgg = async (payload = {}) => {
  const res = await api.post("/auth/admin/customers/orders-agg", payload);
  return res.data;
};
