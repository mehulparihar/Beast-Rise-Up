"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
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
  Bell,
  Camera,
  Mail,
  Lock,
  Smartphone,
  Globe,
  Moon,
  Eye,
  EyeOff,
  Shield,
  Trash2,
} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"

// Sidebar navigation items
const sidebarLinks = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Gift Vouchers", href: "/account/gift-vouchers", icon: Gift },
  { label: "Payment Methods", href: "/account/payment", icon: CreditCard },
  { label: "Settings", href: "/account/settings", icon: Settings, active: true },
]

// Mock user data
const userData = {
  name: "Marcus Johnson",
  email: "marcus.johnson@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "/male-fitness-avatar.jpg",
  memberSince: "January 2024",
  loyaltyPoints: 2450,
  tier: "Gold Member",
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

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-red-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  )
}

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  })
  const [preferences, setPreferences] = useState({
    darkMode: false,
    twoFactor: false,
  })

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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Navigation */}
            <MobileAccountNav />

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Page Header */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900 mb-1">Account Settings</h1>
                <p className="text-gray-500">Manage your profile and preferences</p>
              </motion.div>

              {/* Profile Information */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User size={20} className="text-gray-400" />
                    Profile Information
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={userData.avatar || "/placeholder.svg"}
                        alt={userData.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Camera size={14} className="text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="Marcus"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Johnson"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Smartphone size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={userData.phone}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </motion.div>

              {/* Password & Security */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Lock size={20} className="text-gray-400" />
                    Password & Security
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <Shield size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={preferences.twoFactor}
                      onChange={(val) => setPreferences({ ...preferences, twoFactor: val })}
                    />
                  </div>

                  <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                    Update Password
                  </button>
                </div>
              </motion.div>

              {/* Notification Preferences */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-gray-400" />
                    Notification Preferences
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    {
                      key: "email",
                      label: "Email Notifications",
                      desc: "Receive order updates via email",
                      icon: Mail,
                    },
                    {
                      key: "sms",
                      label: "SMS Notifications",
                      desc: "Get text alerts for deliveries",
                      icon: Smartphone,
                    },
                    {
                      key: "push",
                      label: "Push Notifications",
                      desc: "Browser notifications for updates",
                      icon: Bell,
                    },
                    {
                      key: "marketing",
                      label: "Marketing Emails",
                      desc: "Promotions and new arrivals",
                      icon: Gift,
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.key} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Icon size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={notifications[item.key]}
                          onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                        />
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe size={20} className="text-gray-400" />
                    Preferences
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Moon size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Dark Mode</h3>
                        <p className="text-sm text-gray-500">Switch to dark theme</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={preferences.darkMode}
                      onChange={(val) => setPreferences({ ...preferences, darkMode: val })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Globe size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Language</h3>
                        <p className="text-sm text-gray-500">Select your preferred language</p>
                      </div>
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Delete Account */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Delete Account</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-sm">
                        Delete My Account
                      </button>
                    </div>
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

export default SettingsPage