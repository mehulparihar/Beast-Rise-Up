/**
 * Product store
 * - caching for product lists & detail
 * - pagination & filters state
 */

import create from "zustand";
import { fetchProducts, fetchProductById, fetchFeatured, fetchByCategory } from "../api/product.api";

const useProductStore = create((set, get) => ({
  list: [],              // current product list
  total: 0,
  page: 1,
  limit: 24,
  filters: {},           // e.g., { category, priceMin, priceMax, sort }
  featured: [],
  productCache: {},      // keyed by id for quick lookup
  loading: false,
  error: null,

  setLoading: (v) => set({ loading: v }),
  setError: (err) => set({ error: err }),
  setFilters: (filters) => set({ filters }),
  setPage: (p) => set({ page: p }),

  // fetch product list with current filters + pagination
  loadProducts: async (opts = {}) => {
    set({ loading: true, error: null });
    const params = {
      page: get().page,
      limit: get().limit,
      ...get().filters,
      ...opts,
    };

    try {
      const res = await fetchProducts(params);
      // expect res to include items & total OR data structure { products, total }
      const products = res.products || res.items || res.data || res;
      const total = res.total || res.count || (products.length || 0);

      set({ list: products, total, loading: false });
      // cache each product
      const cache = { ...get().productCache };
      (products || []).forEach((p) => { if (p && p._id) cache[p._id] = p; });
      set({ productCache: cache });
      return { success: true, products };
    } catch (err) {
      console.error("Load products error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  loadProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      // return cached if exists
      const cached = get().productCache[id];
      if (cached) {
        set({ loading: false });
        return { success: true, product: cached };
      }
      const res = await fetchProductById(id);
      const product = res.product || res.data || res;
      set((state) => ({ productCache: { ...state.productCache, [id]: product }, loading: false }));
      return { success: true, product };
    } catch (err) {
      console.error("Load product by id error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  loadFeatured: async () => {
    set({ loading: true });
    try {
      const res = await fetchFeatured();
      const featured = res.products || res.data || res;
      set({ featured, loading: false });
      return { success: true, featured };
    } catch (err) {
      console.error("Load featured error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  loadByCategory: async (category, params = {}) => {
    set({ loading: true });
    try {
      const res = await fetchByCategory(category, params);
      const products = res.products || res.data || res;
      set({ list: products, loading: false });
      return { success: true, products };
    } catch (err) {
      console.error("Load by category error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },
}));

export default useProductStore;
