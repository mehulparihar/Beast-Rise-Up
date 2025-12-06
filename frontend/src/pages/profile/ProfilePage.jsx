"use client"
import { motion } from "framer-motion"
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
  ShoppingBag,
  Truck,
  Star,
  Bell,
  Shield,
  Edit2,
  Camera,
} from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"


// Sidebar navigation items
const sidebarLinks = [
  { label: "Dashboard", href: "/account", icon: User, active: true },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Gift Vouchers", href: "/account/gift-vouchers", icon: Gift },
  { label: "Payment Methods", href: "/account/payment", icon: CreditCard },
  { label: "Settings", href: "/account/settings", icon: Settings },
]

// Mock user data
const userData = {
  name: "Marcus Johnson",
  email: "marcus.johnson@example.com",
  avatar: "/male-fitness-avatar.jpg",
  memberSince: "January 2024",
  loyaltyPoints: 2450,
  tier: "Gold Member",
}

// Recent orders mock data
const recentOrders = [
  {
    id: "BRU-78523",
    date: "Dec 1, 2025",
    status: "Delivered",
    total: 149.99,
    items: 2,
    image: "/black-premium-hoodie-streetwear-fashion.jpg",
  },
  {
    id: "BRU-78412",
    date: "Nov 25, 2025",
    status: "In Transit",
    total: 89.99,
    items: 1,
    image: "/black-cargo-streetwear-pants.jpg",
  },
  {
    id: "BRU-78301",
    date: "Nov 18, 2025",
    status: "Delivered",
    total: 199.98,
    items: 3,
    image: "/black-premium-tshirt-with-logo-streetwear.jpg",
  },
]

// Quick stats
const quickStats = [
  { label: "Total Orders", value: "12", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "In Transit", value: "1", icon: Truck, color: "bg-amber-50 text-amber-600" },
  { label: "Wishlist Items", value: "8", icon: Heart, color: "bg-red-50 text-red-600" },
  { label: "Reviews Given", value: "5", icon: Star, color: "bg-green-50 text-green-600" },
]

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    Delivered: "bg-green-100 text-green-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  )
}

// Account Sidebar Component
function AccountSidebar() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
        {/* User Profile Card */}
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg">{userData.name}</h3>
              <p className="text-gray-400 text-sm">{userData.tier}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
            <div>
              <p className="text-xs text-gray-400">Loyalty Points</p>
              <p className="font-bold text-lg">{userData.loyaltyPoints.toLocaleString()}</p>
            </div>
            <Gift size={24} className="text-red-400" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  link.active ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
                {link.active && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

// Mobile Account Navigation
function MobileAccountNav() {
  return (
    <div className="lg:hidden mb-6 overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                link.active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon size={16} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const ProfilePage = () => {
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Dashboard Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Navigation */}
            <MobileAccountNav />

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Welcome Header */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-1">
                      Welcome back, {userData.name.split(" ")[0]}!
                    </h1>
                    <p className="text-gray-500">
                      Member since {userData.memberSince} · {userData.tier}
                    </p>
                  </div>
                  <Link
                    href="/account/settings"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </Link>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                        <Icon size={20} />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  )
                })}
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <p className="text-sm text-gray-500">Track and manage your orders</p>
                  </div>
                  <Link
                    href="/account/orders"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    View All
                    <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={order.image || "/placeholder.svg"}
                            alt={`Order ${order.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{order.id}</h3>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-gray-500">
                            {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/account/wishlist"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <Heart size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">My Wishlist</h3>
                      <p className="text-sm text-gray-500">8 items saved</p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-auto text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                  </div>
                </Link>

                <Link
                  href="/account/addresses"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <MapPin size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Addresses</h3>
                      <p className="text-sm text-gray-500">2 saved addresses</p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-auto text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                  </div>
                </Link>

                <Link
                  href="/account/gift-vouchers"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Gift size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Gift Vouchers</h3>
                      <p className="text-sm text-gray-500">$50.00 available</p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-auto text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shield size={24} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Secure Your Account</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Enable two-factor authentication for extra security on your account.
                    </p>
                    <Link
                      href="/account/settings"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      Enable 2FA
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ProfilePage