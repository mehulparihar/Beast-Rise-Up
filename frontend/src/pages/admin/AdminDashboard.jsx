"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Link } from "react-router-dom"
import { analytics as apianalytics } from "../../api/analytics.api"
import { logout } from "../../api/auth.api"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, active: true },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
]

const revenueData = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 198 },
  { name: "Mar", revenue: 5000, orders: 320 },
  { name: "Apr", revenue: 4500, orders: 278 },
  { name: "May", revenue: 6000, orders: 389 },
  { name: "Jun", revenue: 5500, orders: 349 },
  { name: "Jul", revenue: 7000, orders: 430 },
]

const categoryData = [
  { name: "Hoodies", sales: 4000 },
  { name: "T-Shirts", sales: 3000 },
  { name: "Pants", sales: 2000 },
  { name: "Shoes", sales: 2780 },
  { name: "Accessories", sales: 1890 },
]

const recentOrders = [
  { id: "#ORD-7352", customer: "Marcus Chen", product: "Beast Mode Hoodie", amount: "$129.00", status: "Completed" },
  { id: "#ORD-7351", customer: "Sarah Wilson", product: "Rise Up Tee", amount: "$49.00", status: "Processing" },
  { id: "#ORD-7350", customer: "James Rodriguez", product: "Urban Joggers", amount: "$89.00", status: "Shipped" },
  { id: "#ORD-7349", customer: "Emily Davis", product: "Street Cap", amount: "$35.00", status: "Completed" },
  { id: "#ORD-7348", customer: "Michael Brown", product: "Beast Sneakers", amount: "$159.00", status: "Pending" },
]

const topProducts = [
  { name: "Beast Mode Hoodie", sales: 1234, revenue: "$159,186", image: "/black-hoodie-streetwear.png" },
  { name: "Rise Up Tee", sales: 987, revenue: "$48,363", image: "/black-tshirt-streetwear.jpg" },
  { name: "Urban Joggers", sales: 756, revenue: "$67,284", image: "/black-joggers-streetwear.jpg" },
  { name: "Street Cap", sales: 654, revenue: "$22,890", image: "/black-cap-streetwear.jpg" },
]

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [revenueRange, setRevenueRange] = useState("30") // "7" | "30" | "90"

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const res = await apianalytics();
        setAnalytics(res.data)
      } catch (err) {
        console.error("Fetch analytics error", err)
        setError("Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0)

  const formatDateLabel = (isoDate) => {
    try {
      const d = new Date(isoDate)
      return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    } catch {
      return isoDate
    }
  }

  // derive display data (safe defaults)
  const kpis = analytics?.kpis || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, pageViews: null }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(kpis.totalRevenue),
      change: "+0%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: (kpis.totalOrders ?? 0).toLocaleString(),
      change: "+0%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: (kpis.totalCustomers ?? 0).toLocaleString(),
      change: "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Page Views",
      value: kpis.pageViews == null ? "—" : (kpis.pageViews ?? 0).toLocaleString(),
      change: "-0%",
      trend: "down",
      icon: Eye,
    },
  ]

  // revenue chart data selection
  const revenueOverview = analytics?.revenueOverview || {}
  const revenueData = (revenueRange === "7" ? revenueOverview.days7 : revenueRange === "90" ? revenueOverview.days90 : revenueOverview.days30) || []

  const revenueChartData = revenueData.map((r) => ({
    name: formatDateLabel(r._id || r.date || r.name),
    revenue: r.revenue || 0,
  }))

  // category bar data
  const salesByCategory = analytics?.salesByCategory || []
  const categoryData = salesByCategory.map((c) => ({ name: c.category || "Unknown", sales: c.revenue || 0 }))

  // recent orders
  const recentOrdersRaw = analytics?.recentOrders || []
  const recentOrders = recentOrdersRaw.map((o) => ({
    id: o._id,
    customer: o.user?.name || o.user?.email || "Unknown",
    product: (o.items && o.items[0] && (o.items[0].productSnapshot?.title || o.items[0].product?.title)) || "—",
    amount: formatCurrency(o.totalAmount || 0),
    status: o.status || "Unknown",
    createdAt: o.createdAt,
  }))

  // top products
  const topProductsRaw = analytics?.topProducts || []
  const topProducts = topProductsRaw.map((p) => ({
    name: p.name,
    sales: p.unitsSold || 0,
    revenue: formatCurrency(p.revenue || 0),
    image: p.image || "/placeholder.svg",
  }))

  // top customers
  const topCustomersRaw = analytics?.topCustomers || []
  const topCustomers = topCustomersRaw.map((c) => ({
    name: c.name,
    email: c.email,
    orders: c.orders || 0,
    totalSpent: formatCurrency(c.totalSpent || 0),
    joined: c.joined ? new Date(c.joined).toLocaleDateString("en-IN") : "—",
  }))


  // const stats = [
  //   {
  //     title: "Total Revenue",
  //     value: "₹45,231.89",
  //     change: "+20.1%",
  //     trend: "up",
  //     icon: DollarSign,
  //   },
  //   {
  //     title: "Total Orders",
  //     value: "2,350",
  //     change: "+15.2%",
  //     trend: "up",
  //     icon: ShoppingCart,
  //   },
  //   {
  //     title: "Total Customers",
  //     value: "1,247",
  //     change: "+12.5%",
  //     trend: "up",
  //     icon: Users,
  //   },
  //   {
  //     title: "Page Views",
  //     value: "48,352",
  //     change: "-3.2%",
  //     trend: "down",
  //     icon: Eye,
  //   },
  // ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="font-black text-lg">B</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">BEAST</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${link.active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
                <img src="/admin-avatar.png" alt="Admin" width={40} height={40} className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@beastrise.com</p>
              </div>
              <button
                // onClick={() => logout()}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
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
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 transition-colors text-sm font-medium"
              >
                View Store
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bg-[#111111] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <div className="relative">
                    <button
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(dropdownOpen === "revenue" ? null : "revenue")}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {dropdownOpen === "revenue" && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10">
                        <button
                          onClick={() => { setRevenueRange("7"); setDropdownOpen(null) }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          Last 7 days
                        </button>
                        <button
                          onClick={() => { setRevenueRange("30"); setDropdownOpen(null) }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          Last 30 days
                        </button>
                        <button
                          onClick={() => { setRevenueRange("90"); setDropdownOpen(null) }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          Last 90 days
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#dc2626"
                          strokeWidth={2}
                          dot={{ fill: "#dc2626" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Sales Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="bg-[#111111] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold">Sales by Category</h3>
                  <div className="relative">
                    <button
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(dropdownOpen === "category" ? null : "category")}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {dropdownOpen === "category" && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10">
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          This Month
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          Last Month
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors">
                          This Year
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="sales" fill="#dc2626" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="bg-[#111111] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{order.customer}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.id} · {order.product}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold">{order.amount}</p>
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${order.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : order.status === "Processing"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : order.status === "Shipped"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <div className="bg-[#111111] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold">Top Products</h3>
                  <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.name}
                        className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                        <p className="font-semibold">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard