import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getUserOrders);
router.get("/:orderId", protectRoute, getOrderById);
router.get("/admin/all", protectRoute, adminRoute, getAllOrders);
router.patch("/admin/:orderId", protectRoute, adminRoute, updateOrderStatus);

export default router;