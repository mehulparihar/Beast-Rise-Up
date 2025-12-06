"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Heart,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  Award,
  Leaf,
  Headphones,
  Star,
  Quote,
  Flame,
  Sparkles,
  Check,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ChevronDown,
} from "lucide-react"
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// ============================================
// DATA
// ============================================

const navLinks = [
  { label: "Shop", href: "#shop" },
  { label: "Men", href: "#men" },
  { label: "Women", href: "#women" },
  { label: "Streetwear", href: "#streetwear" },
  { label: "Gymwear", href: "#gymwear" },
  { label: "New Arrivals", href: "#new" },
]

const categories = [
  {
    title: "Men",
    description: "Bold designs for the modern man",
    image: "/men-streetwear-fashion-model-black-hoodie.jpg",
    itemCount: "240+ Items",
  },
  {
    title: "Women",
    description: "Power meets elegance",
    image: "/women-athletic-wear-fashion-model-gym-clothes.jpg",
    itemCount: "180+ Items",
  },
  {
    title: "Streetwear",
    description: "Urban style redefined",
    image: "/streetwear-fashion-urban-style-jacket-model.jpg",
    itemCount: "150+ Items",
  },
  {
    title: "Gymwear",
    description: "Performance engineered",
    image: "/gym-wear-athletic-man-training-clothes.jpg",
    itemCount: "120+ Items",
  },
]

const bestsellers = [
  {
    id: 1,
    title: "Beast Logo Premium Tee",
    price: "$49.99",
    image: "/black-premium-tshirt-with-logo-streetwear.jpg",
    badge: "BEST SELLER",
    rating: 4.9,
    reviews: 240,
  },
  {
    id: 2,
    title: "Power Hoodie Classic",
    price: "$99.99",
    image: "/black-premium-hoodie-streetwear-fashion.jpg",
    badge: "TOP RATED",
    rating: 4.95,
    reviews: 189,
  },
  {
    id: 3,
    title: "Rise Cargo Pants",
    price: "$89.99",
    image: "/black-cargo-streetwear-pants.jpg",
    badge: "TRENDING",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 4,
    title: "Elite Performance Tank",
    price: "$39.99",
    image: "/black-gym-tank-top-athletic-wear.jpg",
    rating: 4.85,
    reviews: 213,
  },
]

const trending = [
  {
    id: 9,
    title: "Beast Oversized Hoodie",
    price: "$109.99",
    image: "/oversized-black-hoodie-streetwear-model.jpg",
    badge: "TRENDING",
    rating: 4.92,
    reviews: 89,
  },
  {
    id: 10,
    title: "Rise Up Joggers",
    price: "$79.99",
    image: "/black-jogger-pants-streetwear-fashion.jpg",
    rating: 4.88,
    reviews: 134,
  },
  {
    id: 11,
    title: "Power Cropped Tee",
    price: "$44.99",
    image: "/women-cropped-tshirt-athletic-gym-wear.jpg",
    badge: "NEW",
    rating: 4.9,
    reviews: 67,
  },
  {
    id: 12,
    title: "Beast Training Shorts",
    price: "$54.99",
    image: "/black-training-shorts-gym-wear-athletic.jpg",
    rating: 4.85,
    reviews: 112,
  },
]

const newArrivals = [
  {
    id: 5,
    title: "Winter Beast Jacket",
    price: "$149.99",
    image: "/black-winter-jacket-premium-streetwear.jpg",
    badge: "NEW",
    rating: 5,
    reviews: 47,
  },
  {
    id: 6,
    title: "Rise Up Snapback",
    price: "$34.99",
    image: "/black-snapback-cap-streetwear-fashion.jpg",
    badge: "NEW",
    rating: 4.9,
    reviews: 63,
  },
  {
    id: 7,
    title: "Beast Crew Sweatshirt",
    price: "$79.99",
    image: "/black-crew-neck-sweatshirt-premium.jpg",
    badge: "NEW",
    rating: 4.95,
    reviews: 92,
  },
  {
    id: 8,
    title: "Elite Compression Shorts",
    price: "$59.99",
    image: "/placeholder.svg?height=500&width=375",
    badge: "NEW",
    rating: 4.88,
    reviews: 71,
  },
]

const highlights = [
  { icon: Truck, title: "Free Shipping", description: "Free delivery on orders over $99" },
  { icon: RefreshCw, title: "Easy Returns", description: "30-day hassle-free returns" },
  { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
  { icon: Award, title: "Premium Quality", description: "Crafted with the finest materials" },
  { icon: Leaf, title: "Sustainable", description: "Eco-conscious manufacturing" },
  { icon: Headphones, title: "24/7 Support", description: "Always here to help you" },
]

const testimonials = [
  {
    name: "Marcus J.",
    role: "Fitness Enthusiast",
    content:
      "Beast Rise Up changed my wardrobe game completely. The quality is incredible and I feel powerful wearing their pieces every day.",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    name: "Jessica M.",
    role: "Streetwear Collector",
    content:
      "Finally found a brand that gets streetwear aesthetics AND gym functionality. The attention to detail is unmatched. Absolutely obsessed!",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    name: "Alex R.",
    role: "Fitness Influencer",
    content:
      "The fit, the material, the vibe — everything about Beast Rise Up screams premium. My followers keep asking where I get my outfits.",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    name: "Sofia K.",
    role: "Fashion Designer",
    content:
      "As a designer, I appreciate the attention to detail. Beast Rise Up is doing something truly special in the industry.",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
]

const footerLinks = [
  { title: "Shop", links: ["Men", "Women", "Streetwear", "Gymwear", "New Arrivals", "Sale"] },
  { title: "Company", links: ["About Us", "Careers", "Blog", "Press", "Sustainability"] },
  { title: "Support", links: ["Contact", "FAQ", "Shipping", "Returns", "Size Guide", "Track Order"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
]

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
]

// ============================================
// COMPONENTS
// ============================================

// Product Card Component - Light Theme
function ProductCard({ title, price, originalPrice, image, badge, rating, reviews, id }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${badge === "NEW"
                  ? "bg-gray-900 text-white"
                  : badge === "SALE"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                }`}
            >
              {badge}
            </span>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            size={18}
            className={`${isFavorited ? "fill-red-600 text-red-600" : "text-gray-400 hover:text-red-600"} transition-colors`}
          />
        </motion.button>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-lg"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-900 font-bold">{price}</p>
          {originalPrice && <p className="text-gray-400 text-sm line-through">{originalPrice}</p>}
        </div>
      </div>
    </motion.div>
  )
}

function Navigation({ isScrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-900 text-white text-center py-2.5 text-sm font-medium tracking-wide">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-red-500" />
          <span>
            Free Shipping on Orders Over $99 | Use Code: <span className="font-bold text-red-500">BEAST20</span>
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
          <div className="max-w-7xl mx-auto px-4">
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-sm font-medium">Account</span>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Heart size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => navigate("/cart")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white font-semibold transition-colors hover:bg-gray-800"
                >
                  <ShoppingCart size={18} />
                  <span className="text-sm">$249.99</span>
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full">
                    3
                  </span>
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
          <div className="max-w-7xl mx-auto px-4">
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
                  <span>Free Shipping $99+</span>
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

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={containerVariants} className="order-2 lg:order-1">
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-6"
            >
              New Season Collection
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-gray-900 text-balance"
            >
              Unleash Your <span className="text-red-600">Inner Beast</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Premium streetwear and gymwear designed for those who refuse to blend in. Crafted with exceptional quality
              for confidence-driven individuals.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <motion.a
                href="#shop"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
              >
                Shop Now
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="#new"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors"
              >
                New Arrivals
              </motion.a>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck size={18} className="text-red-500" />
                <span>Free Shipping $99+</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw size={18} className="text-red-500" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield size={18} className="text-red-500" />
                <span>Secure Checkout</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50">
              <img
                src="/placeholder.svg?height=800&width=640"
                alt="Beast Rise Up Premium Streetwear Collection"
                className="w-full h-full object-cover"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <p className="text-xs text-gray-500 mb-1">Trending Now</p>
                <p className="text-gray-900 font-bold">Power Hoodie</p>
                <p className="text-red-600 font-bold">$99.99</p>
              </motion.div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-red-50 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-red-100 rounded-full -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section id="shop" className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">Shop by Category</h2>
            <p className="text-gray-500">Discover curated collections built for your lifestyle</p>
          </div>
          <a
            href="#all-categories"
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            View All Categories <ArrowRight size={18} />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <motion.a
              key={category.title}
              href={`#${category.title.toLowerCase()}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] cursor-pointer shadow-lg shadow-gray-200/50"
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={`${category.title} collection`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs text-white/80 font-medium mb-1">{category.itemCount}</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{category.title}</h3>
                <p className="text-sm text-white/70 mb-3 hidden md:block">{category.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                  Shop Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

function BestSellers() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">Best Sellers</h2>
            <p className="text-gray-500">The most loved pieces by our community</p>
          </div>
          <a
            href="#all-products"
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            View All <ArrowRight size={18} />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TrendingProducts() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={24} className="text-red-500" />
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Trending Now</h2>
            </div>
            <p className="text-gray-500">What the community is loving right now</p>
          </div>
          <a
            href="#trending"
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            See All Trending <ArrowRight size={18} />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function NewArrivals() {
  return (
    <section id="new" className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={24} className="text-red-500" />
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Just Dropped</h2>
            </div>
            <p className="text-gray-500">Fresh arrivals to elevate your wardrobe</p>
          </div>
          <a
            href="#all-new"
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            View All New <ArrowRight size={18} />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandHighlights() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Why Choose Beast Rise Up</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We're committed to delivering exceptional quality and service at every step
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                  <Icon size={24} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">Loved by 50,000+ Customers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">See what our community has to say about Beast Rise Up</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Quote size={24} className="text-red-100 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandStory() {
  return (
    <section id="about" className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-6">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900 leading-tight">
              Born to Inspire. <span className="text-red-600">Built to Empower.</span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Beast Rise Up was born from a simple belief: exceptional people deserve exceptional apparel. We've
              engineered every piece with uncompromising quality and cutting-edge design.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              From the gym to the streets, our collections empower individuals to embrace their strongest selves. Each
              garment is crafted with premium materials, meticulous attention to detail, and the bold aesthetic that
              defines our movement.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're not just a brand — we're a community of go-getters, dreamers, and achievers who refuse to settle for
              ordinary.
            </p>
            <motion.a
              href="#mission"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
            >
              Learn Our Mission
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50">
              <img
                src="/placeholder.svg?height=800&width=640"
                alt="Beast Rise Up Community"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 4000)
    }
  }

  return (
    <section className="py-16 md:py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
            <Mail size={28} className="text-red-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Join the Beast Movement</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new drops, early sales, and insider content. Be the first to know when new
            collections launch.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitted}
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-80"
            >
              {submitted ? (
                <>
                  <Check size={18} />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 mt-6">No spam, ever. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  )
}


const HomePage = () => {
 

  return (
    <main className="bg-white min-h-screen">
      <Navbar/>
      <Hero />
      <Categories />
      <BestSellers />
      <TrendingProducts />
      <NewArrivals />
      <BrandHighlights />
      <Testimonials />
      <BrandStory />
      <Newsletter />
      <Footer />
    </main>
  )
}

export default HomePage;
