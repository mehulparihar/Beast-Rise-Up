import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlist.controller.js';

const router = express.Router();

router.post("/add", protectRoute, addToWishlist);
router.delete("/:productId", protectRoute, removeFromWishlist);
router.get("/", protectRoute, getWishlist);

export default router;