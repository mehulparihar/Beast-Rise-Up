import express from 'express';
import { getAllUsers, customersOrdersAgg, getUserById, updateUser, deleteUser, login, logout, signup, refreshToken, getProfile, forgotPassword, resetPassword, updateProfile, googleLogin, requestOtp, verifyOtpAndCreateUser, changePassword } from "../controllers/auth.controller.js";
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);
router.post("/google", googleLogin);
router.post("/send-otp", requestOtp);
router.post("/verify-otp", verifyOtpAndCreateUser);
router.put("/change-password", protectRoute, changePassword);

router.get("/admin/customers", protectRoute, adminRoute, getAllUsers);
router.post("/admin/customers/orders-agg", protectRoute, adminRoute, customersOrdersAgg);
router.get("/admin/customers/:id", protectRoute, adminRoute, getUserById);
router.put("/admin/customers/:id", protectRoute, adminRoute, updateUser);
router.delete("/admin/customers/:id", protectRoute, adminRoute, deleteUser);


export default router;