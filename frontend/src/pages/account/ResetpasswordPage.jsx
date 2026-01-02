"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Flame,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import useAuthStore from "../../stores/useAuthStore"

const ResetpasswordPage = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const { token } = useParams();

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordStrength = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: "Weak", color: "bg-red-500" }
    if (passwordStrength <= 3) return { label: "Fair", color: "bg-yellow-500" }
    if (passwordStrength <= 4) return { label: "Good", color: "bg-blue-500" }
    return { label: "Strong", color: "bg-green-500" }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password")
      return
    }

    setIsLoading(true)

    // Simulate API call - replace with actual reset logic
    const res = await resetPassword(token, password);

    if (!res.success) {
      setError("Something went wrong");
      setIsLoading(false);
      return;
    }
    setIsSuccess(true)
    setIsLoading(false)
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
              Create a <span className="text-red-500">New Password</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg leading-relaxed mb-8"
            >
              Choose a strong, unique password to keep your account secure. Make it memorable but hard to guess.
            </motion.p>

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {[
                "Use at least 8 characters",
                "Mix uppercase & lowercase letters",
                "Include numbers and symbols",
                "Avoid common words or patterns",
              ].map((tip, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-red-500" />
                  </div>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-gray-500 text-sm">© 2025 Beast Rise Up. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div variants={itemVariants} className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3 justify-center">
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
              to="/login"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </motion.div>

          {!isSuccess ? (
            <>
              {/* Header */}
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Set new password</h1>
                <p className="text-gray-500">Your new password must be different from previously used passwords.</p>
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

              {/* Form */}
              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 h-full rounded-full transition-colors ${level <= passwordStrength ? getStrengthLabel().color : "bg-gray-200"
                                }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-xs font-semibold ${passwordStrength <= 2
                              ? "text-red-600"
                              : passwordStrength <= 3
                                ? "text-yellow-600"
                                : passwordStrength <= 4
                                  ? "text-blue-600"
                                  : "text-green-600"
                            }`}
                        >
                          {getStrengthLabel().label}
                        </span>
                      </div>

                      {/* Requirements Checklist */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { check: hasMinLength, label: "8+ characters" },
                          { check: hasUppercase, label: "Uppercase" },
                          { check: hasLowercase, label: "Lowercase" },
                          { check: hasNumber, label: "Number" },
                        ].map((req, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${req.check ? "bg-green-500" : "bg-gray-200"
                                }`}
                            >
                              {req.check && <Check size={10} className="text-white" />}
                            </div>
                            <span className={`text-xs ${req.check ? "text-gray-700" : "text-gray-400"}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`w-full h-13 pl-12 pr-12 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${confirmPassword && password !== confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : confirmPassword && password === confirmPassword
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500/10"
                            : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                        }`}
                      required
                    />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600 font-medium">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                      <Check size={12} /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading || password !== confirmPassword || passwordStrength < 3}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Password reset successful</h2>
              <p className="text-gray-500 mb-8">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors w-full"
              >
                Continue to login
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}

          {/* Terms */}
          <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            Remember your password?{" "}
            <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetpasswordPage