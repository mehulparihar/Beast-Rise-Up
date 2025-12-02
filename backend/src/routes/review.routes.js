import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview, getProductReviews, updateReview, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/:productId", protectRoute, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:reviewId", protectRoute, updateReview);
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;