import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAllProducts, getProductById, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct, 
    createProduct, updateProduct, deleteProduct
 } from '../controllers/product.controller.js';
import upload from '../middleware/uploadMemory.js';

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/:id", getProductById);

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.post("/", protectRoute, adminRoute, upload.array("images", 20), createProduct); 
router.put("/:id", protectRoute, adminRoute, upload.array("images", 20), updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);


export default router;