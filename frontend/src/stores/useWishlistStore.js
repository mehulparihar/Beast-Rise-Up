/**
 * Wishlist store
 * - optimistic toggle
 * - sync with backend
 */

import { create } from "zustand";
import { getWishlist, addWishlist as apiAddWishlist, removeWishlistItem as apiRemoveWishlistItem } from "../api/wishlist.api";

const W_KEY = "wishlist_v1";

const useWishlistStore = create((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem(W_KEY) || "[]"),
  loading: false,
  error: null,

  setWishlist: (wl) => {
    localStorage.setItem(W_KEY, JSON.stringify(wl || []));
    set({ wishlist: wl });
  },

  loadWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getWishlist();
      const wl = res.wishlist || res.data?.wishlist || res;
      localStorage.setItem(W_KEY, JSON.stringify(wl));
      set({ wishlist: wl, loading: false });
      return { success: true, wishlist: wl };
    } catch (err) {
      console.error("Load wishlist error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  add: async (productId) => {
    const prev = get().wishlist;
    if (prev.includes(productId)) return { success: true };

    const next = [...prev, productId];
    set({ wishlist: next });
    localStorage.setItem(W_KEY, JSON.stringify(next));

    try {
      await apiAddWishlist({ productId });
      return { success: true };
    } catch (err) {
      set({ wishlist: prev });
      localStorage.setItem(W_KEY, JSON.stringify(prev));
      return { success: false };
    }
  },

  remove: async (productId) => {
    const prev = get().wishlist;
    try {
      const next = prev.filter((p) => (p._id || p) !== productId && !(p.product && p.product._id === productId));
      set({ wishlist: next });
      localStorage.setItem(W_KEY, JSON.stringify(next));

      await apiRemoveWishlistItem(productId);
      await get().loadWishlist();
      return { success: true };
    } catch (err) {
      console.error("Remove wishlist item error:", err);
      set({ wishlist: prev });
      localStorage.setItem(W_KEY, JSON.stringify(prev));
      return { success: false, message: err?.message };
    }
  },
}));

export default useWishlistStore;
