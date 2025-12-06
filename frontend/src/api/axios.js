import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST: attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// RESPONSE: refresh token
instance.interceptors.response.use(
  (res) => res,

  async (err) => {
    const originalReq = err.config;

    if (!originalReq || originalReq._retry) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      originalReq._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Correct URL
        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          { refreshToken },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken = refreshRes.data?.accessToken;
        const user = refreshRes.data?.user;

        if (!newAccessToken) throw new Error("No access token returned");

        // Update localStorage
        localStorage.setItem("token", newAccessToken);

        // Update Zustand state
        const store = useAuthStore.getState();
        store?.setUser?.(user);

        // Retry original request
        originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalReq);
      } catch (refreshErr) {
        // Refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        const store = useAuthStore.getState();
        store?.logout?.();

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
