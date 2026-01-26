import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Search, User, Heart, ShoppingCart, X, Menu, ChevronDown, Truck, RefreshCw, Shield, Sparkles } from "lucide-react"
import useCartStore from '../../stores/useCartStore';

const navLinks = [
  { label: "Shop", href: "/category/all" },
  { label: "Men", href: "/category/men" },
  { label: "Women", href: "/category/women" },
  { label: "Streetwear", href: "/category/streetwear" },
  { label: "Gymwear", href: "/category/gymwear" },
  { label: "New Arrivals", href: "/category" },
]



const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { cart, loadCart } = useCartStore();


  useEffect(() => {
    loadCart();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce((sum, item) => {
    const price =
      item.product?.variants?.[0]?.discountedPrice ||
      item.product?.price ||
      0;
    return sum + price * item.quantity;
  }, 0);



  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-900 text-white text-center py-2.5 text-sm font-medium tracking-wide">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-red-500" />
          <span>
            Free Shipping on Orders Over ₹499 | Use Code: <span className="font-bold text-red-500">BEAST20</span>
          </span>
          <Sparkles size={14} className="text-red-500" />
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50" : "bg-white"
          }`}
      >
        {/* Top Nav Bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo Section */}
              <motion.a
                href="/"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-11 h-11 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Flame className="text-red-500" size={22} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-black tracking-tight leading-none">
                    <span className="text-gray-900">BEAST</span>
                    <span className="text-red-600"> RISE UP</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                    Premium Streetwear
                  </span>
                </div>
              </motion.a>

              {/* Center Search Bar - Desktop */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full group">
                  <input
                    type="text"
                    placeholder="Search for products, collections, styles..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchValue.trim()) {
                        navigate(`/search/${encodeURIComponent(searchValue.trim())}`)
                        setSearchValue("")
                      }
                    }}
                    className="w-full h-11 pl-12 pr-4 text-sm bg-gray-50 border-2 border-transparent rounded-lg focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1">
                {/* Mobile Search Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Search size={20} />
                </motion.button>

                {/* Account */}
                <motion.button
                  onClick={() => navigate("/account")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-sm font-medium">Account</span>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  onClick={() => navigate("/account/wishlist")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Heart size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => navigate("/checkout")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white font-semibold transition-colors hover:bg-gray-800"
                >
                  <ShoppingCart size={18} />
                  <span className="text-sm">₹{cartTotal.toFixed(2)}</span>
                  {cartCount > 0 && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full">
                      {cartCount}
                    </span>
                  )}
                </motion.button>

                {/* Mobile Menu Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors ml-1"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <nav className="hidden lg:block border-b border-gray-100 bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              {/* Category Links */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ scale: 1.02 }}
                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors rounded-md hover:bg-white group"
                  >
                    {link.label}
                    {link.label === "New Arrivals" && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded">
                        HOT
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-red-500" />
                  <span>Free Shipping ₹499+</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="text-red-500" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-gray-100 bg-white overflow-hidden"
            >
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchValue.trim()) {
                        navigate(`/search/${encodeURIComponent(searchValue.trim())}`)
                        setSearchOpen(false)
                        setSearchValue("")
                      }
                    }}
                    placeholder="Search products..."
                    autoFocus
                    className="w-full h-12 pl-12 pr-12 text-sm bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-xl"
            >
              {/* Mobile Nav Links */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-2">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between px-4 py-4 text-gray-800 hover:text-red-600 hover:bg-gray-50 font-semibold rounded-xl transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        {link.label}
                        {link.label === "New Arrivals" && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">HOT</span>
                        )}
                      </span>
                      <ChevronDown size={16} className="text-gray-400 -rotate-90" />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Quick Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-200 text-gray-800 font-semibold rounded-xl hover:border-gray-300 transition-colors"
                    >
                      <User size={18} />
                      Sign In
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <Heart size={18} />
                      Wishlist
                    </motion.button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-red-500" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-red-500" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Navbar

