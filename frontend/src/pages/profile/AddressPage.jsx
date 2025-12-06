"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Edit2,
  Trash2,
  Check,
  Home,
  Building2,
  Bell,
  Camera,
  X,
  AlertCircle,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"

// Sidebar links
const sidebarLinks = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin, active: true },
  { label: "Gift Vouchers", href: "/account/gift-vouchers", icon: Gift },
  { label: "Payment Methods", href: "/account/payment", icon: CreditCard },
  { label: "Settings", href: "/account/settings", icon: Settings },
]

// User data
const userData = {
  name: "Marcus Johnson",
  avatar: "/male-fitness-avatar.jpg",
  loyaltyPoints: 2450,
  tier: "Gold Member",
}

// Initial addresses
const initialAddresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    name: "Marcus Johnson",
    phone: "+1 (555) 123-4567",
    address: "123 Fitness Street",
    apartment: "Apt 4B",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "United States",
    isDefault: true,
  },
  {
    id: 2,
    type: "work",
    label: "Office",
    name: "Marcus Johnson",
    phone: "+1 (555) 987-6543",
    address: "456 Business Ave",
    apartment: "Suite 200",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90015",
    country: "United States",
    isDefault: false,
  },
]



// Account Sidebar Component
function AccountSidebar() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
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

// Mobile Navigation
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

// Address Card Component
function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const TypeIcon = address.type === "work" ? Building2 : Home

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
        address.isDefault ? "border-red-500 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                address.type === "work" ? "bg-blue-50" : "bg-amber-50"
              }`}
            >
              <TypeIcon size={20} className={address.type === "work" ? "text-blue-600" : "text-amber-600"} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{address.label}</h3>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                  <Check size={12} />
                  Default Address
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Edit2 size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="p-5">
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-gray-900">{address.name}</p>
          <p className="text-gray-600">{address.phone}</p>
          <p className="text-gray-600">
            {address.address}
            {address.apartment && `, ${address.apartment}`}
          </p>
          <p className="text-gray-600">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-gray-600">{address.country}</p>
        </div>

        {/* Set as Default Button */}
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Set as Default
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Add/Edit Address Modal
function AddressModal({ isOpen, onClose, address, onSave }) {
  const [formData, setFormData] = useState({
    type: address?.type || "home",
    label: address?.label || "",
    name: address?.name || "",
    phone: address?.phone || "",
    address: address?.address || "",
    apartment: address?.apartment || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "United States",
    isDefault: address?.isDefault || false,
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    const newErrors = {}
    if (!formData.label.trim()) newErrors.label = "Label is required"
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
    onClose()
  }

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
          <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{address ? "Edit Address" : "Add New Address"}</h2>
              <p className="text-sm text-gray-500">
                {address ? "Update your address details" : "Add a new delivery address"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Address Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "home" })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    formData.type === "home" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Home size={18} />
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "work" })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    formData.type === "work" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Building2 size={18} />
                  Work
                </button>
              </div>
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => {
                  setFormData({ ...formData, label: e.target.value })
                  setErrors({ ...errors, label: "" })
                }}
                placeholder="e.g., Home, Office, Mom's House"
                className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                  errors.label ? "border-red-500" : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.label && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.label}
                </p>
              )}
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    setErrors({ ...errors, name: "" })
                  }}
                  placeholder="John Doe"
                  className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    errors.name ? "border-red-500" : "border-gray-200 focus:border-red-500"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    setErrors({ ...errors, phone: "" })
                  }}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    errors.phone ? "border-red-500" : "border-gray-200 focus:border-red-500"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value })
                  setErrors({ ...errors, address: "" })
                }}
                placeholder="123 Main Street"
                className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                  errors.address ? "border-red-500" : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                placeholder="Apt 4B, Suite 200"
                className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value })
                    setErrors({ ...errors, city: "" })
                  }}
                  placeholder="Los Angeles"
                  className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    errors.city ? "border-red-500" : "border-gray-200 focus:border-red-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value })
                    setErrors({ ...errors, state: "" })
                  }}
                  placeholder="CA"
                  className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    errors.state ? "border-red-500" : "border-gray-200 focus:border-red-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => {
                    setFormData({ ...formData, zipCode: e.target.value })
                    setErrors({ ...errors, zipCode: "" })
                  }}
                  placeholder="90001"
                  className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    errors.zipCode ? "border-red-500" : "border-gray-200 focus:border-red-500"
                  }`}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Set as Default */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    formData.isDefault ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {formData.isDefault && <Check size={14} className="text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Set as default address</span>
            </label>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              {address ? "Save Changes" : "Add Address"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Delete Confirmation Modal
function DeleteModal({ isOpen, onClose, onConfirm, addressLabel }) {
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Address?</h3>
          <p className="text-gray-500 text-center mb-6">
            Are you sure you want to delete "{addressLabel}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


const AddressPage = () => {
   const [addresses, setAddresses] = useState(initialAddresses)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [deletingAddress, setDeletingAddress] = useState(null)
  

  const handleSave = (addressData) => {
    if (editingAddress) {
      // Edit existing
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddress.id) {
            return { ...addressData, id: addr.id }
          }
          // If new address is default, remove default from others
          if (addressData.isDefault && addr.id !== editingAddress.id) {
            return { ...addr, isDefault: false }
          }
          return addr
        }),
      )
    } else {
      // Add new
      const newId = Math.max(...addresses.map((a) => a.id), 0) + 1
      setAddresses((prev) => {
        const updated = addressData.isDefault ? prev.map((addr) => ({ ...addr, isDefault: false })) : prev
        return [...updated, { ...addressData, id: newId }]
      })
    }
    setEditingAddress(null)
    setShowAddModal(false)
  }

  const handleDelete = () => {
    if (deletingAddress) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== deletingAddress.id))
      setDeletingAddress(null)
    }
  }

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">My Addresses</h1>
                <p className="text-gray-500">Manage your delivery addresses</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Add New Address
              </motion.button>
            </div>

            {/* Addresses Grid */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={() => {
                        setEditingAddress(address)
                        setShowAddModal(true)
                      }}
                      onDelete={() => setDeletingAddress(address)}
                      onSetDefault={() => handleSetDefault(address.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No addresses yet</h3>
                <p className="text-gray-500 mb-6">Add your first delivery address to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={18} />
                  Add New Address
                </motion.button>
              </div>
            )}

            {/* Info Card */}
            {addresses.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Tip:</span> Your default address will be pre-selected at checkout for
                  faster ordering.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Address Modal */}
      <AddressModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingAddress(null)
        }}
        address={editingAddress}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleDelete}
        addressLabel={deletingAddress?.label || ""}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AddressPage