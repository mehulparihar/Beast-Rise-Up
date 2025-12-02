import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getDashboardAnalytics);

export default router;