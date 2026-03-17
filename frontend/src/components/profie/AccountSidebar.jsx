"use client";
import { Link, useLocation } from "react-router-dom";
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
import useAuthStore from "../../stores/useAuthStore";
import { useState } from "react";

// Sidebar navigation items
const sidebarLinks = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  // { label: "Gift Vouchers", href: "/account/gift-vouchers", icon: Gift },
  // { label: "Payment Methods", href: "/account/payment", icon: CreditCard },
  { label: "Settings", href: "/account/settings", icon: Settings },
]

export default function AccountSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  console.log("User in Sidebar:", user);
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
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => {
              // const confirm = window.confirm("Are you sure you want to sign out?");
              // if (confirm) logout();
              setShowLogoutConfirm(true)
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[360px] rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Sign out?
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                You will be logged out of your account.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowLogoutConfirm(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  )
}