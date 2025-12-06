"use client"

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
  ShoppingCart,
  Trash2,
  Share2,
  Star,
  Bell,
  Camera,
  Check,
  ExternalLink,
} from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"

// Sidebar links
const sidebarLinks = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart, active: true },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
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

// Mock wishlist data
const initialWishlistItems = [
  {
    id: 1,
    title: "Beast Logo Premium Tee",
    price: 49.99,
    originalPrice: null,
    image: "/black-premium-tshirt-with-logo-streetwear.jpg",
    badge: "BEST SELLER",
    rating: 4.9,
    reviews: 240,
    inStock: true,
    addedDate: "Dec 1, 2025",
  },
  {
    id: 2,
    title: "Power Hoodie Classic",
    price: 99.99,
    originalPrice: 129.99,
    image: "/black-premium-hoodie-streetwear-fashion.jpg",
    badge: "SALE",
    rating: 4.95,
    reviews: 189,
    inStock: true,
    addedDate: "Nov 28, 2025",
  },
  {
    id: 3,
    title: "Rise Cargo Pants",
    price: 89.99,
    originalPrice: null,
    image: "/black-cargo-streetwear-pants.jpg",
    badge: "TRENDING",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    addedDate: "Nov 25, 2025",
  },
  {
    id: 4,
    title: "Winter Beast Jacket",
    price: 149.99,
    originalPrice: null,
    image: "/black-winter-jacket-premium-streetwear.jpg",
    badge: "NEW",
    rating: 5,
    reviews: 47,
    inStock: false,
    addedDate: "Nov 20, 2025",
  },
  {
    id: 5,
    title: "Beast Oversized Hoodie",
    price: 109.99,
    originalPrice: null,
    image: "/oversized-black-hoodie-streetwear-model.jpg",
    badge: null,
    rating: 4.92,
    reviews: 89,
    inStock: true,
    addedDate: "Nov 15, 2025",
  },
  {
    id: 6,
    title: "Rise Up Joggers",
    price: 79.99,
    originalPrice: 99.99,
    image: "/black-jogger-pants-streetwear-fashion.jpg",
    badge: "SALE",
    rating: 4.88,
    reviews: 134,
    inStock: true,
    addedDate: "Nov 10, 2025",
  },
  {
    id: 7,
    title: "Elite Performance Tank",
    price: 39.99,
    originalPrice: null,
    image: "/black-gym-tank-top-athletic-wear.jpg",
    badge: null,
    rating: 4.85,
    reviews: 213,
    inStock: true,
    addedDate: "Nov 5, 2025",
  },
  {
    id: 8,
    title: "Beast Crew Sweatshirt",
    price: 79.99,
    originalPrice: null,
    image: "/black-crew-neck-sweatshirt-premium.jpg",
    badge: "NEW",
    rating: 4.95,
    reviews: 92,
    inStock: false,
    addedDate: "Oct 30, 2025",
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

// Wishlist Item Card
function WishlistItemCard({
  item,
  onRemove,
  onAddToCart,
  isRemoving,
  isAddingToCart,
}) {
  const [showShareTooltip, setShowShareTooltip] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(`https://beastriseup.com/product/${item.id}`)
    setShowShareTooltip(true)
    setTimeout(() => setShowShareTooltip(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] bg-gray-100">
        {item.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                item.badge === "NEW"
                  ? "bg-gray-900 text-white"
                  : item.badge === "SALE"
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {item.badge}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg text-sm">Out of Stock</span>
          </div>
        )}

        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <Share2 size={16} className="text-gray-600" />
            </motion.button>
            <AnimatePresence>
              {showShareTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded whitespace-nowrap"
                >
                  Link copied!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
          </motion.button>
        </div>

        {/* View Product Link */}
        <Link
          href={`/product/${item.id}`}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-gray-900 font-semibold rounded-lg text-sm hover:bg-white transition-colors">
            <ExternalLink size={14} />
            View Product
          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <Link href={`/product/${item.id}`}>
          <h3 className="font-bold text-gray-900 mb-1 hover:text-red-600 transition-colors line-clamp-1">
            {item.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-900">{item.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
          {item.originalPrice && <p className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>}
          {item.originalPrice && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Added Date */}
        <p className="text-xs text-gray-500 mb-3">Added {item.addedDate}</p>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: item.inStock ? 1.02 : 1 }}
          whileTap={{ scale: item.inStock ? 0.98 : 1 }}
          onClick={onAddToCart}
          disabled={!item.inStock || isAddingToCart}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors text-sm ${
            item.inStock ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : item.inStock ? (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          ) : (
            "Notify When Available"
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)
  const [removingId, setRemovingId] = useState(null)
  const [addingToCartId, setAddingToCartId] = useState(null)
  const [addedToCart, setAddedToCart] = useState([])
  

  const handleRemove = async (id) => {
    setRemovingId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
    setRemovingId(null)
  }

  const handleAddToCart = async (id) => {
    setAddingToCartId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAddedToCart((prev) => [...prev, id])
    setAddingToCartId(null)
  }

  const handleAddAllToCart = async () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock)
    for (const item of inStockItems) {
      await handleAddToCart(item.id)
    }
  }

  const inStockCount = wishlistItems.filter((item) => item.inStock).length
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)

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
                <h1 className="text-2xl font-black text-gray-900 mb-1">My Wishlist</h1>
                <p className="text-gray-500">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved · {inStockCount} in stock
                </p>
              </div>
              {wishlistItems.length > 0 && inStockCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart size={18} />
                  Add All to Cart
                </motion.button>
              )}
            </div>

            {/* Summary Card */}
            {wishlistItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-black text-gray-900">${totalValue.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200" />
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="text-2xl font-black text-green-600">{inStockCount}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200 hidden sm:block" />
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-500">Out of Stock</p>
                      <p className="text-2xl font-black text-red-600">{wishlistItems.length - inStockCount}</p>
                    </div>
                  </div>
                  <Link
                    href="/products"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    Continue Shopping
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Wishlist Grid */}
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {wishlistItems.map((item) => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item.id)}
                      onAddToCart={() => handleAddToCart(item.id)}
                      isRemoving={removingId === item.id}
                      isAddingToCart={addingToCartId === item.id}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Start adding items you love to your wishlist</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Explore Products
                  <ChevronRight size={18} />
                </Link>
              </div>
            )}

            {/* Success Toast */}
            <AnimatePresence>
              {addedToCart.length > 0 && addingToCartId === null && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                  <div className="flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-full shadow-lg">
                    <Check size={18} className="text-green-400" />
                    <span className="font-medium">{addedToCart.length} item(s) added to cart</span>
                    <Link
                      href="/cart"
                      className="ml-2 px-3 py-1 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors"
                    >
                      View Cart
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default WishlistPage