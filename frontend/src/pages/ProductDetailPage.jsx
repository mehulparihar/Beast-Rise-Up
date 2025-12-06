"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCw,
  Shield,
  Flame,
  ArrowRight,
  Minus,
  Plus,
  Check,
  ChevronDown,
  Share2,
  Ruler,
  Package,
  Instagram,
  Twitter,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

// Product data
const product = {
  id: 1,
  title: "Power Hoodie Classic",
  price: 99.99,
  originalPrice: 129.99,
  description:
    "The iconic Power Hoodie is engineered for those who demand both style and performance. Crafted from premium heavyweight cotton blend with a brushed interior for unmatched comfort. Features an oversized fit, kangaroo pocket, and our signature Beast Rise Up embroidery.",
  images: [
    "/black-premium-hoodie-streetwear-fashion.jpg",
    "/black-premium-hoodie-back-view.jpg",
    "/black-premium-hoodie-detail-view.jpg",
    "/black-premium-hoodie-lifestyle.jpg",
  ],
  rating: 4.95,
  reviews: 189,
  badge: "BEST SELLER",
  category: "Hoodies",
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Black", hex: "#1a1a1a" },
    { name: "Charcoal", hex: "#36454f" },
    { name: "Navy", hex: "#1e3a5f" },
  ],
  features: [
    "Premium heavyweight 400gsm cotton blend",
    "Brushed interior for ultimate comfort",
    "Oversized relaxed fit",
    "Signature Beast Rise Up embroidery",
    "Kangaroo pocket with hidden zip",
    "Ribbed cuffs and hem",
  ],
  details: {
    material: "80% Cotton, 20% Polyester",
    fit: "Oversized / Relaxed",
    care: "Machine wash cold, tumble dry low",
    origin: "Designed in LA, Made in Portugal",
  },
  inStock: true,
  lowStock: true,
  stockCount: 5,
}

// Related products
const relatedProducts = [
  {
    id: 2,
    title: "Beast Logo Premium Tee",
    price: 49.99,
    image: "/black-premium-tshirt-with-logo-streetwear.jpg",
    rating: 4.9,
    reviews: 240,
  },
  {
    id: 3,
    title: "Rise Cargo Pants",
    price: 89.99,
    image: "/black-cargo-streetwear-pants.jpg",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 4,
    title: "Beast Oversized Hoodie",
    price: 109.99,
    image: "/oversized-black-hoodie-streetwear-model.jpg",
    rating: 4.92,
    reviews: 89,
    badge: "TRENDING",
  },
  {
    id: 5,
    title: "Elite Performance Tank",
    price: 39.99,
    image: "/black-gym-tank-top-athletic-wear.jpg",
    rating: 4.85,
    reviews: 213,
  },
]

// Reviews data
const reviewsData = [
  {
    id: 1,
    name: "Marcus J.",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    title: "Best hoodie I've ever owned",
    content:
      "The quality is absolutely insane. Super thick material, perfect oversized fit, and the embroidery is top notch. Already ordered two more colors.",
    helpful: 24,
    size: "L",
    fit: "True to size",
  },
  {
    id: 2,
    name: "Jessica M.",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "Worth every penny",
    content:
      "I was hesitant about the price but this hoodie exceeded all expectations. The weight of the fabric feels premium and it's so comfortable. Size up if you want that oversized look!",
    helpful: 18,
    size: "M",
    fit: "Size up for oversized",
  },
  {
    id: 3,
    name: "Alex R.",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    title: "My new favorite",
    content:
      "The attention to detail is incredible. From the stitching to the embroidery, everything is perfect. This is my third Beast Rise Up purchase and they never disappoint.",
    helpful: 31,
    size: "XL",
    fit: "True to size",
  },
]

// Size guide data
const sizeGuide = {
  headers: ["Size", "Chest", "Length", "Sleeve"],
  rows: [
    ["XS", '38"', '26"', '24"'],
    ["S", '40"', '27"', '25"'],
    ["M", '42"', '28"', '26"'],
    ["L", '44"', '29"', '27"'],
    ["XL", '46"', '30"', '28"'],
    ["XXL", '48"', '31"', '29"'],
  ],
}

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  

  const handleAddToCart = () => {
    if (!selectedSize) return
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/products" className="text-gray-500 hover:text-red-600 transition-colors">
              Products
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/products?category=hoodies" className="text-gray-500 hover:text-red-600 transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
            >
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-4 py-1.5 text-xs font-bold rounded-full bg-red-600 text-white shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
              {product.lowStock && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-500 text-white shadow-lg">
                    <Zap size={12} />
                    Only {product.stockCount} left
                  </span>
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 transition-all ${
                    currentImageIndex === idx ? "ring-2 ring-red-500 ring-offset-2" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/products?category=${product.category.toLowerCase()}`}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  {product.category}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating) ? "fill-red-500 text-red-500" : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{product.title}</h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    Color: <span className="font-normal text-gray-600">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-red-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">Size</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <Ruler size={14} />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] h-12 px-4 rounded-lg font-bold transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && <p className="mt-2 text-sm text-red-600">Please select a size</p>}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="text-sm font-bold text-gray-900 mb-3 block">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-l-lg hover:bg-gray-200 transition-colors text-gray-700"
                    >
                      <Minus size={18} />
                    </motion.button>
                    <span className="w-14 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-r-lg hover:bg-gray-200 transition-colors text-gray-700"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : selectedSize
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${
                    isFavorited
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  <Heart size={22} className={isFavorited ? "fill-red-600" : ""} />
                </motion.button>
              </div>

              {/* Buy Now */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 mb-6 border-2 border-gray-900 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all"
              >
                Buy Now
                <ArrowRight size={20} />
              </motion.button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl mb-6">
                <div className="text-center">
                  <Truck size={20} className="mx-auto mb-1 text-red-600" />
                  <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RefreshCw size={20} className="mx-auto mb-1 text-red-600" />
                  <p className="text-xs font-medium text-gray-700">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield size={20} className="mx-auto mb-1 text-red-600" />
                  <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Share this product</span>
                <div className="flex gap-2">
                  {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      <Icon size={16} />
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {[
              { id: "details", label: "Details & Features" },
              { id: "reviews", label: `Reviews (${product.reviews})` },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold transition-colors relative ${
                  activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
                    <ul className="space-y-3">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                    <div className="space-y-3">
                      {Object.entries(product.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500 capitalize">{key}</span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Reviews Summary */}
                  <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-white rounded-2xl border border-gray-100">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-black text-gray-900 mb-2">{product.rating}</div>
                      <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-red-500 text-red-500" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Based on {product.reviews} reviews</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-600 w-6">{stars}</span>
                          <Star size={14} className="fill-red-500 text-red-500" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: stars === 5 ? "85%" : stars === 4 ? "12%" : "3%" }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-10">
                            {stars === 5 ? "85%" : stars === 4 ? "12%" : "3%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviewsData.map((review) => (
                      <div key={review.id} className="p-6 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{review.name}</span>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <Check size={12} />
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-red-500 text-red-500" />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div>Size: {review.size}</div>
                            <div>{review.fit}</div>
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                        <p className="text-gray-600 mb-4">{review.content}</p>
                        <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full mt-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                  >
                    Load More Reviews
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="p-6 bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Package size={22} className="text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Shipping Information</h3>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Free standard shipping on orders over $99</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Express shipping available (2-3 business days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>International shipping to 50+ countries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Order tracking available for all shipments</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <RefreshCw size={22} className="text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Returns & Exchanges</h3>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>30-day hassle-free returns policy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Free returns for Beast Rise Up members</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Easy size exchanges at no extra cost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-red-600 flex-shrink-0 mt-1" />
                        <span>Full refund within 5 business days</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16 pt-16 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">You May Also Like</h2>
            <Link
              href="/products"
              className="flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/product/${item.id}`}>
                  <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm">
                    {item.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                          {item.badge}
                        </span>
                      </div>
                    )}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={14} className="fill-red-500 text-red-500" />
                    <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    <span className="text-sm text-gray-500">({item.reviews})</span>
                  </div>
                  <p className="text-gray-900 font-bold">${item.price.toFixed(2)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Size Guide</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown size={20} className="rotate-180" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {sizeGuide.headers.map((header) => (
                        <th key={header} className="px-4 py-3 bg-gray-100 text-left text-sm font-bold text-gray-900">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-sm ${cellIdx === 0 ? "font-bold text-gray-900" : "text-gray-600"}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-500">Tip: For an oversized fit, we recommend sizing up one size.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ProductDetailPage