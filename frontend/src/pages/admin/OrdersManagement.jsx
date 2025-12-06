"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  X,
  ChevronDown,
} from "lucide-react"
import { Link } from "react-router-dom"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, active: true },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]



const initialOrders = [
  {
    id: "ORD-7352",
    customer: {
      name: "Marcus Chen",
      email: "marcus.chen@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/marcus-chen-avatar.jpg",
    },
    items: [
      { name: "Beast Mode Hoodie", quantity: 2, price: 129.0, image: "/black-hoodie-streetwear.png" },
      { name: "Rise Up Tee", quantity: 1, price: 49.0, image: "/black-tshirt-streetwear.jpg" },
    ],
    total: 307.0,
    status: "Delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
    },
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-18T14:20:00",
  },
  {
    id: "ORD-7351",
    customer: {
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1 (555) 234-5678",
      avatar: "/sarah-wilson-avatar.jpg",
    },
    items: [{ name: "Rise Up Tee", quantity: 3, price: 49.0, image: "/black-tshirt-streetwear.jpg" }],
    total: 147.0,
    status: "Processing",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    shippingAddress: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    createdAt: "2024-01-16T09:15:00",
    updatedAt: "2024-01-16T09:15:00",
  },
  {
    id: "ORD-7350",
    customer: {
      name: "James Rodriguez",
      email: "james.r@email.com",
      phone: "+1 (555) 345-6789",
      avatar: "/james-rodriguez-avatar.jpg",
    },
    items: [
      { name: "Urban Joggers", quantity: 1, price: 89.0, image: "/black-joggers-streetwear.jpg" },
      { name: "Street Cap", quantity: 2, price: 35.0, image: "/black-cap-streetwear.jpg" },
    ],
    total: 159.0,
    status: "Shipped",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    shippingAddress: {
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    createdAt: "2024-01-14T16:45:00",
    updatedAt: "2024-01-17T11:30:00",
  },
  {
    id: "ORD-7349",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      avatar: "/emily-davis-avatar.jpg",
    },
    items: [{ name: "Beast Sneakers", quantity: 1, price: 159.0, image: "/black-sneakers-streetwear.jpg" }],
    total: 159.0,
    status: "Pending",
    paymentMethod: "Credit Card",
    paymentStatus: "Pending",
    shippingAddress: {
      street: "321 Elm Street",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "United States",
    },
    createdAt: "2024-01-17T08:00:00",
    updatedAt: "2024-01-17T08:00:00",
  },
  {
    id: "ORD-7348",
    customer: {
      name: "Michael Brown",
      email: "michael.b@email.com",
      phone: "+1 (555) 567-8901",
      avatar: "/michael-brown-avatar.jpg",
    },
    items: [
      { name: "Limited Edition Jacket", quantity: 1, price: 249.0, image: "/black-jacket-streetwear.png" },
      { name: "Beast Mode Hoodie", quantity: 1, price: 129.0, image: "/black-hoodie-streetwear.png" },
    ],
    total: 378.0,
    status: "Cancelled",
    paymentMethod: "PayPal",
    paymentStatus: "Refunded",
    shippingAddress: {
      street: "654 Maple Drive",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "United States",
    },
    createdAt: "2024-01-13T12:30:00",
    updatedAt: "2024-01-14T09:00:00",
  },
]

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

const OrdersManagement = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [orderStatusDropdown, setOrderStatusDropdown] = useState(null)
  const itemsPerPage = 5

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
      ),
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
    setOrderStatusDropdown(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />
      case "Processing":
        return <AlertCircle className="w-4 h-4" />
      case "Shipped":
        return <Truck className="w-4 h-4" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />
      case "Cancelled":
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "Refunded":
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="font-black text-lg">B</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">BEAST</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  link.active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
                <img src="/admin-avatar.png" alt="Admin" width={40} height={40} className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@beastrise.com</p>
              </div>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Orders</h1>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </div>
          </div>
        </header>

        {/* Orders Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: orders.length, color: "text-white" },
              {
                label: "Pending",
                value: orders.filter((o) => o.status === "Pending").length,
                color: "text-yellow-400",
              },
              {
                label: "Processing",
                value: orders.filter((o) => o.status === "Processing").length,
                color: "text-blue-400",
              },
              {
                label: "Delivered",
                value: orders.filter((o) => o.status === "Delivered").length,
                color: "text-green-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111111] border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search orders or customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full sm:w-[180px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setStatusFilter("all")
                        setStatusDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                    >
                      All Status
                    </button>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status)
                          setStatusDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#111111] border border-white/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Items</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono font-medium">#{order.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                              {order.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{order.customer.name}</p>
                              <p className="text-sm text-gray-500">{order.customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </span>
                        </td>
                        <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="relative">
                            <button
                              onClick={() => setOrderStatusDropdown(orderStatusDropdown === order.id ? null : order.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {orderStatusDropdown === order.id && (
                              <div className="absolute top-full left-0 mt-2 w-36 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                                {statusOptions.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order.id, status)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? "bg-red-600 hover:bg-red-700"
                        : "border border-white/20 bg-transparent hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setSelectedOrder(null)
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center font-medium">
                      {selectedOrder.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      {selectedOrder.customer.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Address</h3>
                  <div className="flex items-start gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div className="text-sm">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.zip}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OrdersManagement