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
import useAuthStore from "../../stores/useAuthStore"
import Loading from "../Loading"
import AccountSidebar from "../../components/profie/AccountSidebar"
import MobileAccountNav from "../../components/profie/MobileAccountNav"
import StatusBadge from "../../components/profie/StatusBadge"



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


const ProfilePage = () => {
  const { user, fetchProfile, loading } = useAuthStore();

  useEffect(() => {
  if (!user && !loading) {
    fetchProfile();
    console.log("User data in ProfilePage:", user);
  }
}, [user, loading]);

  const quickStats = [
  { label: "Total Orders", value: user?.orders?.length || 0, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "In Transit", value: user?.orders?.filter(order => order.status === "in-transit").length || 0, icon: Truck, color: "bg-amber-50 text-amber-600" },
  { label: "Wishlist Items", value: user?.wishlist?.length || 0, icon: Heart, color: "bg-red-50 text-red-600" },
  { label: "Reviews Given", value: user?.reviews?.length || 0, icon: Star, color: "bg-green-50 text-green-600" },
]



  const userData = {
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar || "/placeholder.svg",
    memberSince: new Date(user?.createdAt).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
    loyaltyPoints: user?.loyaltyPoints || 0,
    tier: user?.tier || "Member",
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  if (loading || !user) {
    return <Loading />;
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
                    to="/account/settings"
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
                    to="/account/orders"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    View All
                    <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="divide-y divide-gray-100">
                  {user?.orders?.slice(0, 3).map(order => (
                    <div key={order._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={order.items[0]?.product?.images?.[0] || "/placeholder.svg"}
                            alt={`Order ${order.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">#{order._id}</h3>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{order.totalAmount?.toFixed(2)}</p>
                          <Link
                            to={`/account/orders/${order._id}`}
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
                  to="/account/wishlist"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <Heart size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">My Wishlist</h3>
                      <p className="text-sm text-gray-500">{user?.wishlist?.length || 0} items saved</p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-auto text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                  </div>
                </Link>

                <Link
                  to="/account/addresses"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <MapPin size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Addresses</h3>
                      <p className="text-sm text-gray-500">{user?.addresses?.length || 0} saved addresses</p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-auto text-gray-400 group-hover:text-red-600 transition-colors"
                    />
                  </div>
                </Link>

                <Link
                  to="/account/gift-vouchers"
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Gift size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Gift Vouchers</h3>
                      <p className="text-sm text-gray-500">₹50.00 available</p>
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
                      to="/account/settings"
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