"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../stores/useAuthStore"


// Google Icon SVG Component
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login({ email, password });

      if (res.success) {
        navigate("/"); // redirect on successful login
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleLoading(true)

    // Simulate Google OAuth - replace with actual Google auth
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Google login initiated")
    // Handle Google OAuth flow here

    setIsGoogleLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Flame className="text-red-500" size={24} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">
                <span className="text-white">BEAST</span>
                <span className="text-red-500"> RISE UP</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Premium Streetwear
              </span>
            </div>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-white mb-6 leading-tight"
            >
              Unleash Your <span className="text-red-500">Inner Beast</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg leading-relaxed mb-8"
            >
              Sign in to access exclusive drops, track your orders, and join a community of 50,000+ who refuse to blend
              in.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {[
                "Early access to new collections",
                "Exclusive member-only discounts",
                "Track orders and manage wishlist",
                "Free shipping on all orders",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Check size={12} className="text-red-500" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-gray-500 text-sm">© 2025 Beast Rise Up. All rights reserved.</p>
        </div>

        {/* Decorative Image */}
        <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20">
          <img src="/streetwear-fashion-silhouette-dark.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div variants={itemVariants} className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3 justify-center">
              <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
                <Flame className="text-red-500" size={22} />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-gray-900">BEAST</span>
                <span className="text-red-600"> RISE UP</span>
              </span>
            </Link>
          </motion.div>

          {/* Back Link */}
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to store
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {/* Google Login */}
          <motion.div variants={itemVariants}>
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          {/* Login Form */}
          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-13 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  required
                />
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-13 pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  required
                />
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-gray-400"
                      }`}
                  >
                    {rememberMe && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Terms */}
          <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-gray-600 hover:text-red-600 underline transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-gray-600 hover:text-red-600 underline transition-colors">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage