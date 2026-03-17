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
import AccountSidebar from "../../components/profie/AccountSidebar"
import MobileAccountNav from "../../components/profie/MobileAccountNav"
import useAuthStore from "../../stores/useAuthStore"




// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-red-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${enabled ? "translate-x-7" : "translate-x-1"
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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    phone: "",
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    twoFactor: false,
  })
  const { user, loading, fetchProfile, updateProfile, changePassword, logout } = useAuthStore();

  useEffect(() => {
    if (!user && !loading) {
      fetchProfile();
      console.log("User data in ProfilePage:", user);
    }
  }, [user, loading]);
  useEffect(() => {
    if (user) {
      const parts = user.name.trim().split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
      setProfile({
        firstName,
        lastName,
        email: user.email || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("Passwords do not match");
    }

    if(passwordForm.newPassword.length < 6) {
      return alert("New password must be at least 6 characters long");
    }

    const confirm = window.confirm(
      "Changing password will log you out. Continue?"
    );
    if (!confirm) return;

    const res = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (res.success) {
      alert("✅ Password updated. Please login again.");
      await logout();
    } else {
      alert(`❌ ${res.message}`);
    }
  };


  const handleProfileUpdate = async () => {
    const confirm = window.confirm("Are you sure you want to save changes?");
    if (!confirm) return;

    const payload = {
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatar,
    };

    const res = await updateProfile(payload);

    if (res.success) {
      alert("✅ Profile updated successfully");
    } else {
      alert("❌ Failed to update profile");
    }

  }

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
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.firstName}
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
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
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
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
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
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    onClick={handleProfileUpdate} >
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
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
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
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
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

                  <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    onClick={handlePasswordUpdate} >
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