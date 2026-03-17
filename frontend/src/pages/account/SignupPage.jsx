"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle, RefreshCw, Edit2, Shield, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../stores/useAuthStore"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"

// --- Google Icon ---
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// --- Password strength ---
function getPasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 1) return { strength: 1, label: "Weak", color: "bg-red-500" }
  if (strength <= 2) return { strength: 2, label: "Fair", color: "bg-orange-500" }
  if (strength <= 3) return { strength: 3, label: "Good", color: "bg-yellow-500" }
  if (strength <= 4) return { strength: 4, label: "Strong", color: "bg-green-500" }
  return { strength: 5, label: "Very Strong", color: "bg-green-600" }
}

const SignupPage = () => {
  const navigate = useNavigate()

  // UI state
  const [step, setStep] = useState("signup") // 'signup' | 'verify'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)

  // OTP state
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""])
  const otpInputsRef = useRef([])
  const [otpError, setOtpError] = useState("") // message to show on OTP verify failure
  const [shakeOtp, setShakeOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Loading / errors
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // password strength & match
  const passwordStrength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // auth store (keeps google login)
  const googleLogin = useAuthStore((state) => state.googleLogin)
  const sendOtp = useAuthStore((state) => state.sendOtp)
  const verifyOtpAndSignup = useAuthStore((state) => state.verifyOtp)


  
 
  // Timer countdown
  useEffect(() => {
    let timer
    if (!canResend && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [resendTimer, canResend])

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => otpInputsRef.current[0]?.focus(), 200)
  }, [])

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newBoxes = [...otpBoxes]
    newBoxes[index] = value
    setOtpBoxes(newBoxes)
    setOtpError("")

    // Auto-jump to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }

    // Auto-submit when all filled
    if (newBoxes.every((box) => box) && newBoxes.join("").length === 6) {
      setTimeout(() => verifyOtp(newBoxes.join("")), 100)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpBoxes[index] && index > 0) {
        const newBoxes = [...otpBoxes]
        newBoxes[index - 1] = ""
        setOtpBoxes(newBoxes)
        otpInputsRef.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").trim()
    
    if (!/^\d{6}$/.test(pasteData)) return

    const digits = pasteData.split("")
    setOtpBoxes(digits)
    setOtpError("")
    
    // Focus last box and auto-submit
    setTimeout(() => {
      otpInputsRef.current[5]?.focus()
      verifyOtp(pasteData)
    }, 100)
  }


  // Google login hook
  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("")
      setIsGoogleLoading(true)
      try {
        const googleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        await googleLogin(googleUser.data)
        navigate("/")
      } catch (err) {
        console.error(err)
        setError("Google login failed")
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: () => {
      setError("Google login failed")
      setIsGoogleLoading(false)
    },
  })

  // --- Framer Motion variants for slide ---
  const slideContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  }

  const slideLeft = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.25 } },
  }

  const slideRight = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: 50, opacity: 0, transition: { duration: 0.25 } },
  }

  // --- Send OTP (called when user clicks Create Account) ---
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError("")
    setOtpError("")

    // validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    try {
      // call send-otp route (your routes: POST /send-otp)
      const payload = {
        email,
      }
      const res = await sendOtp(email);

      if (!res.success) {
        setError(res.message || "Failed to send OTP");
        return;
      }

      // switch to OTP verification step
      setStep("verify")
      setOtpBoxes(["", "", "", "", "", ""])
      setResendTimer(30)
      setCanResend(false)
      // focus first OTP input after small delay
      setTimeout(() => otpInputsRef.current[0]?.focus(), 180)
    } catch (err) {
      console.error("send-otp err:", err)
      setError(err?.response?.data?.message || "Failed to send OTP. Try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // --- Resend OTP ---
  const handleResendOtp = async () => {
    if (!canResend) return
    try {
      setIsLoading(true)
      const res = await sendOtp(email)
      if (!res.success) {
        setOtpError(res.message || "Failed to resend OTP");
        setShakeOtp(true);
        setTimeout(() => setShakeOtp(false), 450);
        return;
      }
      setOtpBoxes(["", "", "", "", "", ""])
      setResendTimer(30)
      setCanResend(false)
      setOtpError("")
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150)
    } catch (err) {
      console.error("resend err:", err)
      setOtpError("Failed to resend OTP. Try again.")
      setShakeOtp(true)
      setTimeout(() => setShakeOtp(false), 450)
    } finally {
      setIsLoading(false)
    }
  }

  // --- OTP verify (calls POST /verify-otp which also creates account on server) ---
  const verifyOtp = async (code) => {
    setOtpError("")
    setError("")
    setIsLoading(true)
    try {
      const payload = {
        name: fullName,
        email,
        password,
        otp: code,
      };
      const res = await verifyOtpAndSignup(payload);
      if (!res.success) {
        const msg = res.message || "Invalid OTP. Please try again.";
        setOtpError(msg);
        setShakeOtp(true);
        setTimeout(() => setShakeOtp(false), 500);
        setOtpBoxes(["", "", "", "", "", ""]);
        setTimeout(() => otpInputsRef.current[0]?.focus(), 120);
        return;
      }
      navigate("/")
    } catch (err) {
      console.error("verify err:", err)
      const msg = err?.response?.data?.message || "Invalid OTP. Please try again."
      setOtpError(msg)
      // shake animation
      setShakeOtp(true)
      setTimeout(() => setShakeOtp(false), 500)
      // clear the boxes for re-try (optional UX choice)
      setOtpBoxes(["", "", "", "", "", ""])
      setTimeout(() => otpInputsRef.current[0]?.focus(), 120)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding (kept same as your original) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
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

          <div className="max-w-md">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-black text-white mb-6 leading-tight">
              Join the <span className="text-red-500">Beast Movement</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-400 text-lg leading-relaxed mb-8">
              Create your account and become part of a community of 50,000+ individuals who refuse to settle for ordinary.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
              {["Exclusive access to limited drops", "20% off your first order", "Member-only rewards program", "Free express shipping forever"].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Check size={12} className="text-red-500" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-gray-500 text-sm">© 2025 Beast Rise Up. All rights reserved.</p>
        </div>

        <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20">
          <img src="/streetwear-fashion-silhouette-dark.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Side - Signup / OTP */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div variants={slideContainer} initial="hidden" animate="visible" className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <motion.div variants={slideLeft} className="lg:hidden mb-8">
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
          <motion.div variants={slideLeft}>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors mb-8">
              <ArrowLeft size={16} />
              Back to store
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={slideLeft} className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div variants={slideLeft} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {/* Google signup */}
          <motion.div variants={slideLeft} className="mb-6">
            <button onClick={handleGoogleSignup} disabled={isGoogleLoading || isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
              {isGoogleLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={slideLeft} className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          {/* -- SLIDE: signup form or otp verify -- */}
          <div className="relative">
            {/* Signup Form */}
            {step === "signup" && (
              <motion.form variants={slideLeft} initial="hidden" animate="visible" exit="exit" onSubmit={handleSendOtp} className="space-y-5 bg-white">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
                  <div className="relative">
                    <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full h-13 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" required />
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                  <div className="relative">
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full h-13 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" required />
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full h-13 pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" required />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* strength */}
                  {password.length > 0 && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Password strength: <span className="font-semibold">{passwordStrength.label}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm password</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className={`w-full h-13 pl-12 pr-12 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${confirmPassword.length > 0 ? (passwordsMatch ? "border-green-500 focus:border-green-500 focus:ring-green-500/10" : "border-red-500 focus:border-red-500 focus:ring-red-500/10") : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"}`} required />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && <p className="mt-2 text-xs text-red-600 font-medium">Passwords do not match</p>}
                  {passwordsMatch && <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1"><Check size={12} />Passwords match</p>}
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${acceptTerms ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-gray-400"}`}>{acceptTerms && <Check size={14} className="text-white" />}</div>
                    </div>
                    <span className="text-sm text-gray-600">I agree to the <Link to="/terms" className="text-red-600 font-semibold hover:text-red-700 transition-colors">Terms of Service</Link> and <Link to="/privacy-policy" className="text-red-600 font-semibold hover:text-red-700 transition-colors">Privacy Policy</Link></span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input type="checkbox" checked={subscribeNewsletter} onChange={(e) => setSubscribeNewsletter(e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${subscribeNewsletter ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-gray-400"}`}>{subscribeNewsletter && <Check size={14} className="text-white" />}</div>
                    </div>
                    <span className="text-sm text-gray-600">Sign me up for exclusive drops, promotions, and the latest news</span>
                  </label>
                </div>

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading || isGoogleLoading} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create account <ArrowRight size={18} /></>}
                </motion.button>
              </motion.form>
            )}

            {/* OTP Verify */}
            {step === "verify" && (
              <div className="w-full max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {!showSuccess ? (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Header with Icon */}
                      <div className="text-center space-y-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
                        >
                          <Mail className="text-white" size={28} />
                        </motion.div>

                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verify your email
                          </h2>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            We've sent a 6-digit verification code to
                          </p>
                          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="font-semibold text-gray-900">{email}</span>
                            {/* <button
                              // onClick={onEditEmail}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Edit email"
                            >
                              <Edit2 size={14} />
                            </button> */}
                          </div>
                        </div>
                      </div>

                      {/* OTP Input */}
                      <motion.div
                        animate={shakeOtp ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-center gap-3">
                          {otpBoxes.map((digit, index) => (
                            <motion.input
                              key={index}
                              ref={(el) => (otpInputsRef.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(e.target.value, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              onPaste={index === 0 ? handlePaste : undefined}
                              disabled={isLoading}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`
                      w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl
                      border-2 transition-all duration-200 outline-none
                      ${otpError
                                  ? "border-red-500 bg-red-50 text-red-600"
                                  : digit
                                    ? "border-red-500 bg-red-50 text-gray-900"
                                    : "border-gray-200 bg-white text-gray-900"
                                }
                      ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                      focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                            />
                          ))}
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                          {otpError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg"
                            >
                              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                              <span className="text-sm text-red-700 font-medium">{otpError}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Verify Button */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => verifyOtp(otpBoxes.join(""))}
                        disabled={otpBoxes.some((box) => !box) || isLoading}
                        className="
                w-full py-4 rounded-xl font-bold text-white
                bg-gradient-to-r from-gray-900 to-gray-800
                hover:from-gray-800 hover:to-gray-700
                disabled:from-gray-300 disabled:to-gray-300
                disabled:cursor-not-allowed
                transition-all duration-200
                shadow-lg shadow-gray-900/20
                flex items-center justify-center gap-2
              "
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify & Continue</span>
                            <Check size={18} />
                          </>
                        )}
                      </motion.button>

                      {/* Resend Section */}
                      <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">Didn't receive the code?</p>

                        {canResend ? (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                    text-sm font-semibold text-red-600
                    bg-red-50 hover:bg-red-100
                    border border-red-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                          >
                            {isResending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw size={16} />
                                <span>Resend Code</span>
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                            <span className="text-sm text-gray-600">
                              Resend available in{" "}
                              <span className="font-semibold text-gray-900">{resendTimer}s</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Security Note */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <Shield size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          For your security, this code will expire in 10 minutes. Never share this code with anyone.
                        </p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    // Success State
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6 py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30"
                      >
                        <Check className="text-white" size={40} strokeWidth={3} />
                      </motion.div>

                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Email Verified!
                        </h3>
                        <p className="text-gray-600">
                          Your account has been successfully created
                        </p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-16 h-1 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Security Note */}
          <motion.p variants={slideLeft} className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            Your data is protected with industry-standard encryption. We never share your information with third parties.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignupPage
