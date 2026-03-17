"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Flame, Package, ArrowRight, Copy, Check } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import Footer from "../../components/layout/Footer"

const OrderSuccessPage = () => {
   const [searchParams] = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const [copied, setCopied] = useState(false)

  const orderId = `BRU${Date.now().toString().slice(-8)}`

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Confetti effect or any celebration animation can be added here
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-green-600" size={40} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8">
              Thank you for your purchase. We&apos;ve received your order and will begin processing it shortly.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Order ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900">{orderId}</span>
                <button onClick={copyOrderId} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                  {copied ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {paymentId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment ID</span>
                <span className="font-mono text-sm text-gray-700">{paymentId}</span>
              </div>
            )}
          </motion.div>

          {/* Estimated Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl mb-8"
          >
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div className="text-left">
              <p className="text-white/70 text-sm">Estimated Delivery</p>
              <p className="text-white font-bold">3-5 Business Days</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/orders"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Track Your Order
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
      </motion.div>
    </div>
  )
}

export default OrderSuccessPage