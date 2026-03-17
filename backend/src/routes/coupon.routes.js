import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createCoupon, getAllCoupons, deleteCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/", protectRoute, adminRoute, createCoupon);
router.get("/", protectRoute, adminRoute, getAllCoupons);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

router.post("/validate", protectRoute, validateCoupon);

export default router;