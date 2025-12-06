/**
 * Cart store (Zustand)
 * - Persist cart locally for quick UI
 * - Sync with backend
 * - Optimistic updates for add/update/remove
 */

import create from "zustand";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "../api/cart.api";

const CART_KEY = "cart_v1";

const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem(CART_KEY) || "[]"),
  loading: false,
  error: null,

  setCart: (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
    set({ cart });
  },

  setLoading: (v) => set({ loading: v }),
  setError: (err) => set({ error: err }),

  // load cart from backend (authorised)
  loadCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getCart();
      const cart = res.cart || res.data?.cart || [];
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      set({ cart, loading: false });
      return { success: true, cart };
    } catch (err) {
      console.error("Load cart error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  // optimistic addToCart
  addToCart: async (product, quantity = 1) => {
    // product can be id or object. normalize:
    const productId = typeof product === "string" ? product : product._id;
    const prev = get().cart;
    try {
      // optimistic update locally
      let next = [...prev];
      const idx = next.findIndex((i) => i.product._id === productId || i.product === productId);
      if (idx > -1) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      } else {
        // minimal product payload if product object not provided
        const payloadProduct = typeof product === "string" ? { _id: productId } : product;
        next.push({ product: payloadProduct, quantity });
      }
      set({ cart: next });
      localStorage.setItem(CART_KEY, JSON.stringify(next));

      // backend call
      await apiAddToCart({ productId, quantity }); // server will return synced cart sometimes
      // re-sync from backend to ensure accurate data
      await get().loadCart();
      return { success: true };
    } catch (err) {
      console.error("Add to cart failed:", err);
      // rollback optimistic update
      set({ cart: prev });
      localStorage.setItem(CART_KEY, JSON.stringify(prev));
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  // update quantity
  updateQuantity: async (productId, quantity) => {
    const prev = get().cart;
    try {
      const next = prev.map((it) =>
        (it.product._id === productId || it.product === productId) ? { ...it, quantity } : it
      );
      set({ cart: next });
      localStorage.setItem(CART_KEY, JSON.stringify(next));

      await apiUpdateCartItem(productId, { quantity });
      await get().loadCart();
      return { success: true };
    } catch (err) {
      console.error("Update cart error:", err);
      set({ cart: prev });
      localStorage.setItem(CART_KEY, JSON.stringify(prev));
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  removeFromCart: async (productId) => {
    const prev = get().cart;
    try {
      const next = prev.filter((it) => !(it.product._id === productId || it.product === productId));
      set({ cart: next });
      localStorage.setItem(CART_KEY, JSON.stringify(next));

      await apiRemoveFromCart(productId);
      await get().loadCart();
      return { success: true };
    } catch (err) {
      console.error("Remove from cart error:", err);
      set({ cart: prev });
      localStorage.setItem(CART_KEY, JSON.stringify(prev));
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },

  clearCart: async () => {
    const prev = get().cart;
    try {
      set({ cart: [] });
      localStorage.setItem(CART_KEY, JSON.stringify([]));
      await apiClearCart();
      return { success: true };
    } catch (err) {
      console.error("Clear cart error:", err);
      set({ cart: prev });
      localStorage.setItem(CART_KEY, JSON.stringify(prev));
      return { success: false, message: err?.response?.data?.message || err.message };
    }
  },
}));

export default useCartStore;
