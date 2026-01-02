import redis from "../config/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail, resetPasswordTemplate } from "../services/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import Order from "../models/order.model.js";



const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const signup = async (req, res, next) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ name, email, password });

        // authenticate
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken,
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist").lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        user.orders = orders;

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: true, message: "If the email exists, a reset link is sent." });
        }

        // create reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // store hashed token in DB
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // send email
        sendEmail({
            to: user.email,
            subject: "Reset Your Password - BeastRiseUp",
            html: resetPasswordTemplate(resetLink),
        });

        return res.json({
            success: true,
            message: "Password reset link sent if the email exists.",
        });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // not expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);          
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log("Change Password Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const payload = req.body;

        delete payload.role;
        delete payload.password;
        delete payload.email;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: payload },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const googleLogin = async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
        const googleData = req.body.credential;

        if (!googleData) {
            return res.status(400).json({ message: "No Google data received" });
        }
        const { sub, email, name, picture } = googleData;
        // Check if user exists
        let user = await User.findOne({ email });

        // If not, create new user (Google users have no password)
        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                googleId: sub,
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        // Set cookies
        setCookies(res, accessToken, refreshToken);

        return res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            accessToken,
            refreshToken,

        });

    } catch (err) {
        console.error("Google OAuth Error:", err.message);
        return res.status(401).json({ message: "Google authentication failed" });
    }
};


export const requestOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("OTP request for email:", email);
        // if user already exists & verified
        const user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res
                .status(400)
                .json({ success: false, message: "Email already registered" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // Store OTP in Redis (expires in 10 min)
        await redis.set(`otp:${email}`, hashedOtp, "EX", 600);

        // Send email
        await sendEmail({
            to: email,
            subject: "Your BeastRiseUp OTP Code",
            html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
        });

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.log("OTP error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const verifyOtpAndCreateUser = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        // Get stored OTP from Redis
        const hashedOtp = await redis.get(`otp:${email}`);

        if (!hashedOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Request a new one.",
            });
        }

        const hashedInputOtp = crypto.createHash("sha256").update(otp).digest("hex");

        if (hashedInputOtp !== hashedOtp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // OTP valid → create user
        const newUser = await User.create({
            name,
            email,
            password,
            isVerified: true,
        });

        // Delete OTP from Redis
        await redis.del(`otp:${email}`);

        res.json({
            success: true,
            message: "Email verified & user created",
            user: newUser,
        });
    } catch (error) {
        console.log("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
