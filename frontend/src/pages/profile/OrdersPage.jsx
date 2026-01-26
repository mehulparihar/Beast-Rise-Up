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
  ChevronDown,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  RotateCcw,
  Download,
  Bell,
  Camera,
} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import useAuthStore from "../../stores/useAuthStore"
import AccountSidebar from "../../components/profie/AccountSidebar"
import MobileAccountNav from "../../components/profie/MobileAccountNav"




// Status configurations
const statusConfig = {
  Delivered: { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-100" },
  "In Transit": { icon: Truck, color: "text-blue-600", bgColor: "bg-blue-100" },
  Processing: { icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100" },
  Cancelled: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
}

// Filter options
const filterOptions = [
  { label: "All Orders", value: "all" },
  { label: "Delivered", value: "Delivered" },
  { label: "In Transit", value: "In Transit" },
  { label: "Processing", value: "Processing" },
  { label: "Cancelled", value: "Cancelled" },
]





// Order Card Component
function OrderCard({
  order,
  isExpanded,
  onToggle,
}) {
  const config = statusConfig[order.status] || statusConfig.Processing
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Order Header */}
      <div className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={order.items[0]?.product?.images?.[0] || "/placeholder.svg"}
                alt={order.items[0]?.product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">#{order._id}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.color}`}
                >
                  <StatusIcon size={12} />
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                {order.items.length} item
                {order.items.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
              {order.status === "Delivered" && <p className="text-xs text-gray-500">Delivered {order.deliveredDate}</p>}
              {order.status === "In Transit" && <p className="text-xs text-blue-600">Est. {order.estimatedDelivery}</p>}
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
              {/* Order Items */}
              <div className="pt-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product?.defaultImage?.[0] || "/placeholder.svg"}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.product?.title}</h4>
                      <p className="text-sm text-gray-500">
                        Size: {item.variant?.size} · Color: {item.variant?.color} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.variant?.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Tracking Info */}
              {order.tracking && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-mono font-semibold text-gray-900">{order.tracking}</p>
                </div>
              )}

              {/* Cancellation Reason */}
              {order.status === "Cancelled" && order.cancelledReason && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl">
                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Cancellation Reason:</span> {order.cancelledReason}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/account/orders/${order._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  <Eye size={16} />
                  View Details
                </Link>
                {order.status === "Delivered" && (
                  <>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <RotateCcw size={16} />
                      Buy Again
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Download size={16} />
                      Invoice
                    </button>
                  </>
                )}
                {order.status === "In Transit" && (
                  <a
                    href={`https://track.example.com/${order.tracking}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Truck size={16} />
                    Track Package
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const { user, fetchProfile, loading } = useAuthStore();

  useEffect(() => {
    if (!user && !loading) {
      fetchProfile();
      console.log("User data in ProfilePage:", user);
    }
  }, [user, loading]);

  const orders = user?.orders || [];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  console.log("Filtered Orders:", filteredOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <AccountSidebar />

          <div className="flex-1 min-w-0">
            <MobileAccountNav />

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 mb-1">My Orders</h1>
              <p className="text-gray-500">View and track all your orders</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders by ID or product name..."
                    className="w-full h-11 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Filter Toggle (Mobile) */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center justify-center gap-2 h-11 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl"
                >
                  <Filter size={18} />
                  Filters
                </button>

                {/* Desktop Filters */}
                <div className="hidden sm:flex items-center gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        selectedFilter === option.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="sm:hidden overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-4">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedFilter(option.value)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedFilter === option.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    isExpanded={expandedOrder === order.id}
                    onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't placed any orders yet"}
                  </p>
                  <Link
                    to="/category/all"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                    <ChevronRight size={18} />
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary Stats */}
            {filteredOrders.length > 0 && (
              <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  Showing {filteredOrders.length} of {orders.length} orders
                  {selectedFilter !== "all" && ` · Filtered by: ${selectedFilter}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default OrdersPage