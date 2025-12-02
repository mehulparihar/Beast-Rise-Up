import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/add", protectRoute, addToCart);
router.put("/update", protectRoute, updateCartItem);
router.delete("/remove/:productId", protectRoute, removeCartItem);
router.delete("/clear", protectRoute, clearCart);

export default router;