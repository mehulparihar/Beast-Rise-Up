/**
 * Order store
 * - create order, get my orders, get order by id
 * - minimal caching of recent orders
 */

import {create} from "zustand";
import { createOrder as apiCreateOrder, getMyOrders as apiGetMyOrders, getOrderById as apiGetOrderById } from "../api/order.api";

const ORD_KEY = "orders_recent_v1";

const useOrderStore = create((set, get) => ({
  orders: JSON.parse(localStorage.getItem(ORD_KEY) || "[]"),
  loading: false,
  error: null,

  setOrders: (orders) => {
    localStorage.setItem(ORD_KEY, JSON.stringify(orders || []));
    set({ orders });
  },

  createOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCreateOrder(payload);
      // res.order expected
      await get().refreshOrders(); // reload user orders
      set({ loading: false });
      return { success: true, order: res.order || res.data || res };
    } catch (err) {
      console.error("Create order error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message || err?.response?.data?.message };
    }
  },

  refreshOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiGetMyOrders();
      const orders = res.orders || res.data?.orders || res;
      localStorage.setItem(ORD_KEY, JSON.stringify(orders));
      set({ orders, loading: false });
      return { success: true, orders };
    } catch (err) {
      console.error("Get orders error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },

  getOrderById: async (id) => {
    set({ loading: true });
    try {
      const res = await apiGetOrderById(id);
      set({ loading: false });
      return { success: true, order: res.order || res.data || res };
    } catch (err) {
      console.error("Get order by id error:", err);
      set({ loading: false, error: err?.message });
      return { success: false, message: err?.message };
    }
  },
}));

export default useOrderStore;
