"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Flame,
  User,
  Package,
  Heart,
  MapPin,
  Gift,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bell,
  Camera,
  Tag,
  ArrowRight,
  X,
} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import AccountSidebar from "../../components/profie/AccountSidebar"
import MobileAccountNav from "../../components/profie/MobileAccountNav"



// User data
const userData = {
  name: "Marcus Johnson",
  avatar: "/male-fitness-avatar.jpg",
  loyaltyPoints: 2450,
  tier: "Gold Member",
}

// Mock vouchers data
const myVouchers = [
  {
    id: "GV-001",
    code: "BEAST-GIFT-X8K2M",
    amount: 50,
    balance: 50,
    status: "Active",
    expiryDate: "Mar 15, 2026",
    source: "Purchased",
  },
  {
    id: "GV-002",
    code: "BEAST-PROMO-Y4N7P",
    amount: 25,
    balance: 10.5,
    status: "Active",
    expiryDate: "Feb 28, 2026",
    source: "Promotional",
  },
  {
    id: "GV-003",
    code: "BEAST-LOYAL-Z9R3Q",
    amount: 20,
    balance: 0,
    status: "Used",
    expiryDate: "Jan 31, 2026",
    source: "Loyalty Reward",
  },
  {
    id: "GV-004",
    code: "BEAST-BDAY-W5T1L",
    amount: 15,
    balance: 0,
    status: "Expired",
    expiryDate: "Nov 30, 2025",
    source: "Birthday Gift",
  },
]

// Gift card purchase options
const giftCardOptions = [
  { amount: 25, popular: false },
  { amount: 50, popular: true },
  { amount: 75, popular: false },
  { amount: 100, popular: false },
  { amount: 150, popular: false },
  { amount: 200, popular: false },
]

// Status configurations
const statusConfig = {
  Active: { color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle2 },
  Used: { color: "text-gray-500", bgColor: "bg-gray-100", icon: Check },
  Expired: { color: "text-red-600", bgColor: "bg-red-100", icon: AlertCircle },
}




// Voucher Card Component
function VoucherCard({ voucher }) {
  const [copied, setCopied] = useState(false)
  const config = statusConfig[voucher.status]
  const StatusIcon = config.icon
  const isUsable = voucher.status === "Active" && voucher.balance > 0

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border overflow-hidden ${
        isUsable ? "border-gray-100 shadow-sm" : "border-gray-100 opacity-75"
      }`}
    >
      {/* Card Header with Pattern */}
      <div className={`relative p-5 ${isUsable ? "bg-gradient-to-r from-gray-900 to-gray-800" : "bg-gray-200"}`}>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-600 rounded-full blur-xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gift size={18} className={isUsable ? "text-red-400" : "text-gray-400"} />
              <span className={`text-sm font-medium ${isUsable ? "text-gray-400" : "text-gray-500"}`}>
                {voucher.source}
              </span>
            </div>
            <div className={`text-3xl font-black ${isUsable ? "text-white" : "text-gray-500"}`}>
              ₹{voucher.balance.toFixed(2)}
            </div>
            {voucher.balance !== voucher.amount && (
              <p className={`text-sm ${isUsable ? "text-gray-400" : "text-gray-400"}`}>
                of ₹{voucher.amount.toFixed(2)} original
              </p>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.color}`}
          >
            <StatusIcon size={12} />
            {voucher.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Voucher Code */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1.5">Voucher Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-900 truncate">
              {voucher.code}
            </code>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              disabled={!isUsable}
              className={`p-2 rounded-lg transition-colors ${
                isUsable ? "hover:bg-gray-100 text-gray-600" : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </motion.button>
          </div>
        </div>

        {/* Expiry */}
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-gray-400" />
          <span className="text-gray-500">
            {voucher.status === "Expired" ? "Expired" : "Expires"}: {voucher.expiryDate}
          </span>
        </div>

        {/* Use Button */}
        {isUsable && (
          <Link
            to="/category/all"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Use Voucher
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// Buy Gift Card Modal
function BuyGiftCardModal({ isOpen, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [isForSelf, setIsForSelf] = useState(true)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Buy Gift Card</h2>
              <p className="text-sm text-gray-500">Perfect gift for any occasion</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {giftCardOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => {
                      setSelectedAmount(option.amount)
                      setCustomAmount("")
                    }}
                    className={`relative px-4 py-3 rounded-xl font-bold text-lg transition-all ${
                      selectedAmount === option.amount && !customAmount
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    ₹{option.amount}
                    {option.popular && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                        POPULAR
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mt-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    min="10"
                    max="500"
                    className="w-full h-12 pl-8 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Min ₹10 - Max ₹500</p>
              </div>
            </div>

            {/* Recipient Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Who is this for?</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsForSelf(true)}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isForSelf ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Myself
                </button>
                <button
                  onClick={() => setIsForSelf(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    !isForSelf ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Someone Else
                </button>
              </div>
            </div>

            {/* Recipient Details (if for someone else) */}
            {!isForSelf && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient's Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient's Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-black text-gray-900">₹{customAmount || selectedAmount || 0}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              <CreditCard size={20} />
              Purchase Gift Card
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Redeem Voucher Component
function RedeemVoucher() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("idle")

  const handleRedeem = async () => {
    if (!code.trim()) return
    setIsLoading(true)
    setStatus("idle")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, show error if code doesn't start with "BEAST"
    if (code.toUpperCase().startsWith("BEAST")) {
      setStatus("success")
      setCode("")
    } else {
      setStatus("error")
    }

    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
          <Tag size={20} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Redeem a Voucher</h3>
          <p className="text-sm text-gray-500">Have a voucher code? Enter it below</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setStatus("idle")
          }}
          placeholder="Enter voucher code"
          className="flex-1 h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all font-mono uppercase"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRedeem}
          disabled={isLoading || !code.trim()}
          className="px-6 h-12 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Redeem"
          )}
        </motion.button>
      </div>

      {status === "success" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-green-600 flex items-center gap-1"
        >
          <CheckCircle2 size={14} />
          Voucher redeemed successfully!
        </motion.p>
      )}

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          Invalid voucher code. Please check and try again.
        </motion.p>
      )}
    </div>
  )
}

const VouchersPage = () => {
  const [showBuyModal, setShowBuyModal] = useState(false)
  

  // Calculate totals
  const activeBalance = myVouchers.filter((v) => v.status === "Active").reduce((sum, v) => sum + v.balance, 0)

  const activeVouchers = myVouchers.filter((v) => v.status === "Active")
  const usedExpiredVouchers = myVouchers.filter((v) => v.status !== "Active")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <AccountSidebar />

          <div className="flex-1 min-w-0">
            <MobileAccountNav />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Gift Vouchers</h1>
                <p className="text-gray-500">Manage and redeem your gift vouchers</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBuyModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Buy Gift Card
              </motion.button>
            </div>

            {/* Balance Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-500 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">₹{activeBalance.toFixed(2)}</span>
                    <span className="text-gray-400">
                      across {activeVouchers.length} voucher{activeVouchers.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles size={24} className="text-red-400" />
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Loyalty Points</p>
                    <p className="font-bold">{userData.loyaltyPoints.toLocaleString()} pts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redeem Voucher */}
            <RedeemVoucher />

            {/* Active Vouchers */}
            {activeVouchers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Active Vouchers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVouchers.map((voucher) => (
                    <VoucherCard key={voucher.id} voucher={voucher} />
                  ))}
                </div>
              </div>
            )}

            {/* Used/Expired Vouchers */}
            {usedExpiredVouchers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Used & Expired</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {usedExpiredVouchers.map((voucher) => (
                    <VoucherCard key={voucher.id} voucher={voucher} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {myVouchers.length === 0 && (
              <div className="mt-8 bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift size={32} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No vouchers yet</h3>
                <p className="text-gray-500 mb-6">Purchase a gift card or redeem a voucher code to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBuyModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={18} />
                  Buy Gift Card
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Buy Gift Card Modal */}
      <BuyGiftCardModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default VouchersPage