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
import AccountSidebar from "../../components/profie/AccountSidebar"
import MobileAccountNav from "../../components/profie/MobileAccountNav"
import useWishlistStore from "../../stores/useWishlistStore"
import useCartStore from "../../stores/useCartStore"
import useAuthStore from "../../stores/useAuthStore"




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



// Wishlist Item Card
function WishlistItemCard({
  item,
  onRemove,
  onAddToCart,
  isRemoving,
  isAddingToCart,
}) {
  const [showShareTooltip, setShowShareTooltip] = useState(false)



  // price & stock derived from first variant (safe fallbacks)
  const variant = item?.variants?.[0] || {};
  const price = variant?.discountedPrice ?? variant?.price ?? 0;
  const originalPrice = variant?.price ?? null;
  const inStock = Array.isArray(variant?.stockBySizeColor) &&
  variant.stockBySizeColor.some((s) => Number(s.stock) > 0);
  
  

  const handleShare = () => {
    navigator.clipboard.writeText(`https://beastriseup.com/product/${item._id}`)
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
              className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${item.badge === "NEW"
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
        {!inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg text-sm">Out of Stock</span>
          </div>
        )}

        <img src={item.defaultImage || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />

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
            onClick={() => onRemove(item._id)}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
          </motion.button>
        </div>

        {/* View Product Link */}
        <Link
          to={`/product/${item._id}`}
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
        <Link to={`/product/${item._id}`}>
          <h3 className="font-bold text-gray-900 mb-1 hover:text-red-600 transition-colors line-clamp-1">
            {item.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-900">{item.ratingAverage || 5.0}</span>
          </div>
          <span className="text-sm text-gray-500">({item.reviews || 0} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-lg font-bold text-gray-900">₹{price}</p>
          {originalPrice && <p className="text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>}
          {originalPrice && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Added Date */}
        {/* <p className="text-xs text-gray-500 mb-3">Added {item.addedDate}</p> */}

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: item.inStock ? 1.02 : 1 }}
          whileTap={{ scale: item.inStock ? 0.98 : 1 }}
          onClick={() => onAddToCart(item._id)}
          disabled={!inStock || isAddingToCart}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors text-sm ${inStock ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : inStock ? (
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
  // const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)
  const [removingId, setRemovingId] = useState(null)
  const [addingToCartId, setAddingToCartId] = useState(null)
  const [addedToCart, setAddedToCart] = useState([])

  const { wishlist, remove, add, loadWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();


  console.log("Wishlist:", wishlist);
  useEffect(() => {
    // Load wishlist from store on mount
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await remove(id); // calls backend + reloads wishlist (per store)
    } catch (err) {
      console.error("Remove wishlist failed", err);
    } finally {
      setRemovingId(null);
    }
  }

  const handleAddToCart = async (id) => {

    try {
      setAddingToCartId(id)
      await addToCart(id, 1)
      setAddedToCart((prev) => [...prev, id])
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAddingToCartId(null);
    }

  }

  const handleAddAllToCart = async () => {
    const inStockItems = wishlist.filter((item) => item.inStock)
    for (const item of inStockItems) {
      await handleAddToCart(item._id)
    }
  }

  const inStockCount = wishlist.filter((item) => {
    const variant = item?.variants?.[0];
    return variant?.stockBySizeColor?.some((s) => s.stock > 0);
  }).length;

  const totalValue = wishlist.reduce((s, it) => {
    const v = it?.variants?.[0]?.discountedPrice ?? it?.variants?.[0]?.price ?? 0;
    return s + v;
  }, 0);

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
                <h1 className="text-2xl font-black text-gray-900 mb-1">My Wishlist</h1>
                <p className="text-gray-500">
                  {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved · {inStockCount} in stock
                </p>
              </div>
              {wishlist.length > 0 && inStockCount > 0 && (
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
            {wishlist.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-black text-gray-900">₹{totalValue.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200" />
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="text-2xl font-black text-green-600">{inStockCount}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200 hidden sm:block" />
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-500">Out of Stock</p>
                      <p className="text-2xl font-black text-red-600">{wishlist.length - inStockCount}</p>
                    </div>
                  </div>
                  <Link
                    to="/category/all"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    Continue Shopping
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Wishlist Grid */}
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item._id)}
                      onAddToCart={() => handleAddToCart(item._id)}
                      isRemoving={removingId === item._id}
                      isAddingToCart={addingToCartId === item._id}
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
                  to="/category/all"
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
                      to="/checkout"
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