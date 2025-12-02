import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRazorpayOrder, verifyPayment, markOrderPaid } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", protectRoute, createRazorpayOrder);
router.post("/verify-payment", protectRoute, verifyPayment);
router.post("/mark-paid", protectRoute, markOrderPaid);

export default router;