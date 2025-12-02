// centralized axios instance with token injection + refresh
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // in case backend uses cookies for refresh token etc.
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: add Authorization header if token exists
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // ignore
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: handle 401 -> attempt refresh once, then retry original
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (!originalReq || originalReq._retry) return Promise.reject(err);

    if (err.response && err.response.status === 401) {
      originalReq._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Call refresh endpoint (not using instance to avoid loops)
        const refreshRes = await axios.post(
          `${API_BASE.replace(/\/api$/, "")}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshRes.data?.accessToken || refreshRes.data?.token || null;
        const user = refreshRes.data?.user || null;

        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          // update zustand store user/token (if store exists)
          try {
            const store = createAuthStore.getState();
            if (store && store.setUser) store.setUser(user);
          } catch (e) {}

          // set header and retry original request
          originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalReq);
        } else {
          // fallback - force logout
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          const store = createAuthStore.getState();
          if (store && store.logout) store.logout();
          return Promise.reject(err);
        }
      } catch (refreshErr) {
        // refresh failed -> logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        try {
          const store = createAuthStore.getState();
          if (store && store.logout) store.logout();
        } catch (e) {}
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
