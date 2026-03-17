/**
 * Auth store (Zustand)
 * - persists token to localStorage
 * - exposes login/register/logout/refresh/fetchProfile actions
 */

import { create } from "zustand";
import {changePassword as changePasswordApi, updateProfile, sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp, login as apiLogin, signup as apiSignup, logout as apiLogout, getProfile, refreshToken as apiRefreshToken, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, googleAuth as apiGoogleAuth } from "../api/auth.api";

// Key names for localStorage
const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";

const useAuthStore = create((set, get) => ({
  // state
  user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_KEY) || null,
  loading: false,
  error: null,

  // setters
  setLoading: (v) => set({ loading: v }),
  setError: (err) => set({ error: err }),
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  // actions
  // login: calls backend, persists tokens & user
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await apiLogin(credentials); // { accessToken, refreshToken, user }
      if (!res) throw new Error("Email or password incorrect");
      const accessToken = res.accessToken || res.token || res.data?.accessToken;
      const refresh = res.refreshToken || res.data?.refreshToken || null;
      const user = res.user || res.data?.user || null;

      if (!accessToken) throw new Error("No access token returned");

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

      await get().fetchProfile();

      set({ token: accessToken, refreshToken: refresh, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      console.error("Auth login error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },
  googleLogin: async (credential) => {
    set({ loading: true, error: null });
    try {
      const res = await apiGoogleAuth({ credential }); // send token to backend
      const accessToken = res.accessToken || res.data?.accessToken;
      const refresh = res.refreshToken || res.data?.refreshToken || null;
      const user = res.user || res.data?.user || null;

      if (!accessToken) throw new Error("No access token returned from Google");

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

      await get().fetchProfile();

      set({ token: accessToken, refreshToken: refresh, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      console.error("Google login error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await apiSignup(payload); // same shape
      const accessToken = res.accessToken || res.token || res.data?.accessToken;
      const refresh = res.refreshToken || res.data?.refreshToken || null;
      const user = res.user || res.data?.user || null;

      if (!accessToken) throw new Error("No access token returned");

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

      await get().fetchProfile();


      set({ token: accessToken, refreshToken: refresh, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      console.error("Auth signup error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  // logout both client & backend
  logout: async () => {
    set({ loading: true });
    try {
      try { await apiLogout(); } catch (e) { /* ignore network error but continue clearing */ }
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      set({ user: null, token: null, refreshToken: null, loading: false, error: null });
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  // refresh token (manual call if needed)
  refresh: async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) return { success: false, message: "No refresh token" };
    set({ loading: true, error: null });
    try {
      const res = await apiRefreshToken({ refreshToken: refresh });
      const accessToken = res.accessToken || res.token || res.data?.accessToken;
      const user = res.user || res.data?.user || null;
      if (!accessToken) throw new Error("Refresh did not return access token");

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token: accessToken, user, loading: false });
      return { success: true };
    } catch (err) {
      console.error("Refresh token error:", err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      set({ token: null, refreshToken: null, user: null, loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getProfile();
      const user = res.user || res.data?.user || null;
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user, loading: false });
      return { success: true, user };
    } catch (err) {
      console.error("Fetch profile error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  forgotPassword: async (email) => {
    try {
      await apiForgotPassword({ email });
      return { success: true };
    } catch (err) {
      console.error("Forgot password error:", err);
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  resetPassword: async (token, password) => {
    try {
      await apiResetPassword(token, { password });
      return { success: true };
    } catch (err) {
      console.error("Reset password error:", err);
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },
  sendOtp: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await apiSendOtp({ email });

      set({ loading: false });
      return { success: true, message: res.message || "OTP sent successfully" };
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  verifyOtp: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await apiVerifyOtp(payload);
      // backend creates account & returns tokens/user

      const accessToken = res.accessToken || res.token || res.data?.accessToken;
      const refresh = res.refreshToken || res.data?.refreshToken || null;
      const user = res.user || res.data?.user || null;

      if (accessToken) localStorage.setItem("token", accessToken);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      set({
        token: accessToken,
        refreshToken: refresh,
        user,
        loading: false,
        error: null
      });

      return { success: true, user };
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  updateProfile: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await updateProfile(payload);
      const user = res.user || res.data?.user;

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user, loading: false });
      } else {
        await get().fetchProfile();
      }

      return { success: true, user };
    } catch (err) {
      console.error("Update profile error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  changePassword: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await changePasswordApi(payload);
      set({ loading: false });

      return { success: true, message: res.message };
    } catch (err) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message,
      });
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  },
}));

export default useAuthStore;
