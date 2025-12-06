"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Heart,
  Star,
  Flame,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  X,
  ChevronDown,
  Check,
  Truck,
  RefreshCw,
  Shield,
  User,
  Menu,
  List,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

// ============================================
// DATA
// ============================================

const allProducts = [
  {
    id: 1,
    title: "Beast Logo Premium Tee",
    price: 49.99,
    originalPrice: null,
    image: "/black-premium-tshirt-with-logo-streetwear.jpg",
    badge: "BEST SELLER",
    rating: 4.9,
    reviews: 240,
    category: "Men",
    type: "T-Shirts",
    color: "Black",
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    title: "Power Hoodie Classic",
    price: 99.99,
    originalPrice: 129.99,
    image: "/black-premium-hoodie-streetwear-fashion.jpg",
    badge: "TOP RATED",
    rating: 4.95,
    reviews: 189,
    category: "Men",
    type: "Hoodies",
    color: "Black",
    size: ["S", "M", "L", "XL"],
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
    category: "Men",
    type: "Pants",
    color: "Black",
    size: ["28", "30", "32", "34", "36"],
  },
  {
    id: 4,
    title: "Elite Performance Tank",
    price: 39.99,
    originalPrice: null,
    image: "/black-gym-tank-top-athletic-wear.jpg",
    badge: null,
    rating: 4.85,
    reviews: 213,
    category: "Men",
    type: "Tanks",
    color: "Black",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    title: "Beast Oversized Hoodie",
    price: 109.99,
    originalPrice: null,
    image: "/oversized-black-hoodie-streetwear-model.jpg",
    badge: "NEW",
    rating: 4.92,
    reviews: 89,
    category: "Streetwear",
    type: "Hoodies",
    color: "Black",
    size: ["S", "M", "L", "XL", "XXL"],
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
    category: "Streetwear",
    type: "Pants",
    color: "Black",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    title: "Power Cropped Tee",
    price: 44.99,
    originalPrice: null,
    image: "/women-cropped-tshirt-athletic-gym-wear.jpg",
    badge: "NEW",
    rating: 4.9,
    reviews: 67,
    category: "Women",
    type: "T-Shirts",
    color: "Black",
    size: ["XS", "S", "M", "L"],
  },
  {
    id: 8,
    title: "Beast Training Shorts",
    price: 54.99,
    originalPrice: null,
    image: "/black-training-shorts-gym-wear-athletic.jpg",
    badge: null,
    rating: 4.85,
    reviews: 112,
    category: "Gymwear",
    type: "Shorts",
    color: "Black",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: 9,
    title: "Winter Beast Jacket",
    price: 149.99,
    originalPrice: 189.99,
    image: "/black-winter-jacket-premium-streetwear.jpg",
    badge: "SALE",
    rating: 5,
    reviews: 47,
    category: "Streetwear",
    type: "Jackets",
    color: "Black",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: 10,
    title: "Rise Up Snapback",
    price: 34.99,
    originalPrice: null,
    image: "/black-snapback-cap-streetwear-fashion.jpg",
    badge: "NEW",
    rating: 4.9,
    reviews: 63,
    category: "Accessories",
    type: "Hats",
    color: "Black",
    size: ["One Size"],
  },
  {
    id: 11,
    title: "Beast Crew Sweatshirt",
    price: 79.99,
    originalPrice: null,
    image: "/black-crew-neck-sweatshirt-premium.jpg",
    badge: null,
    rating: 4.95,
    reviews: 92,
    category: "Men",
    type: "Sweatshirts",
    color: "Black",
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 12,
    title: "Elite Compression Shorts",
    price: 59.99,
    originalPrice: null,
    image: "/black-compression-shorts-gym-wear.jpg",
    badge: null,
    rating: 4.88,
    reviews: 71,
    category: "Gymwear",
    type: "Shorts",
    color: "Black",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: 13,
    title: "Women's Power Leggings",
    price: 69.99,
    originalPrice: null,
    image: "/women-black-athletic-leggings-gym-wear.jpg",
    badge: "BEST SELLER",
    rating: 4.93,
    reviews: 298,
    category: "Women",
    type: "Leggings",
    color: "Black",
    size: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 14,
    title: "Beast Sports Bra",
    price: 49.99,
    originalPrice: null,
    image: "/women-black-sports-bra-athletic-wear.jpg",
    badge: null,
    rating: 4.87,
    reviews: 156,
    category: "Women",
    type: "Sports Bras",
    color: "Black",
    size: ["XS", "S", "M", "L"],
  },
  {
    id: 15,
    title: "Rise Performance Tee",
    price: 44.99,
    originalPrice: null,
    image: "/men-black-performance-athletic-tshirt.jpg",
    badge: null,
    rating: 4.82,
    reviews: 178,
    category: "Gymwear",
    type: "T-Shirts",
    color: "Black",
    size: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 16,
    title: "Beast Gym Duffle Bag",
    price: 89.99,
    originalPrice: null,
    image: "/black-gym-duffle-bag-premium.jpg",
    badge: "NEW",
    rating: 4.91,
    reviews: 54,
    category: "Accessories",
    type: "Bags",
    color: "Black",
    size: ["One Size"],
  },
]

const categories = ["All", "Men", "Women", "Streetwear", "Gymwear", "Accessories"]

const types = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Pants",
  "Shorts",
  "Jackets",
  "Tanks",
  "Leggings",
  "Sports Bras",
  "Hats",
  "Bags",
]
const priceRanges = [
  { label: "All Prices", value: "all", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under $50", value: "0-50", min: 0, max: 50 },
  { label: "$50 - $100", value: "50-100", min: 50, max: 100 },
  { label: "$100 - $150", value: "100-150", min: 100, max: 150 },
  { label: "Over $150", value: "150+", min: 150, max: Number.POSITIVE_INFINITY },
]
const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Selling", value: "bestselling" },
]

// ============================================
// COMPONENTS
// ============================================

function ProductCard({
  title,
  price,
  originalPrice,
  image,
  badge,
  rating,
  reviews,
  viewMode = "grid",
}) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {badge && (
            <span
              className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-bold rounded-full ${badge === "NEW"
                  ? "bg-gray-900 text-white"
                  : badge === "SALE"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
            >
              {badge}
            </span>
          )}
          <img src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-red-500 text-red-500" />
                <span className="text-sm font-medium text-gray-900">{rating}</span>
              </div>
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
              {originalPrice && <p className="text-gray-400 text-sm line-through">${originalPrice.toFixed(2)}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Heart size={18} className={isFavorited ? "fill-red-600 text-red-600" : "text-gray-400"} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

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
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
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
            <Star size={14} className="fill-red-500 text-red-500" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-900 font-bold">${price.toFixed(2)}</p>
          {originalPrice && <p className="text-gray-400 text-sm line-through">${originalPrice.toFixed(2)}</p>}
        </div>
      </div>
    </motion.div>
  )
}

const ProductsPage = () => {
  const router = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [viewMode, setViewMode] = useState("grid")
  const [gridCols, setGridCols] = useState(3)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const { categoryName } = useParams();

  useEffect(() => {
    if (categoryName) {
      const formatted = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
      setSelectedCategory(formatted);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryName]);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false
    }
    if (selectedType !== "All" && product.type !== selectedType) {
      return false
    }
    if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) {
      return false
    }
    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort.value) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "bestselling":
        return b.reviews - a.reviews
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedType("All")
    setSelectedPriceRange(priceRanges[0])
    setSearchQuery("")
  }

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedType !== "All" ||
    selectedPriceRange.label !== "All Prices" ||
    searchQuery !== ""

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Bar */}
      <Navbar />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-semibold rounded-lg transition-colors ${selectedCategory === category ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {category}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <User size={20} />
                  <span className="font-medium">Account</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{selectedCategory === "All" ? "All Products" : selectedCategory}</span>


            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h1>
            <p className="text-gray-500">
              Discover {sortedProducts.length} premium pieces crafted for those who refuse to blend in
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Type</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedType === type ? "bg-gray-900 text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-1">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedPriceRange.value === range.value
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                </button>

                <span className="text-sm text-gray-500">
                  {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    Sort: {selectedSort.label}
                    <ChevronDown size={16} className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setSortDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2"
                        >
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedSort(option)
                                setSortDropdownOpen(false)
                              }}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              {option.label}
                              {selectedSort.value === option.value && <Check size={16} className="text-red-600" />}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden md:flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                      }`}
                    title="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                      }`}
                    title="List view"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Grid Columns (only in grid view) */}
                {viewMode === "grid" && (
                  <div className="hidden lg:flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setGridCols(2)}
                      className={`p-2 rounded-md transition-colors ${gridCols === 2 ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={`p-2 rounded-md transition-colors ${gridCols === 3 ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    {selectedCategory}
                    <X size={14} />
                  </button>
                )}
                {selectedType !== "All" && (
                  <button
                    onClick={() => setSelectedType("All")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    {selectedType}
                    <X size={14} />
                  </button>
                )}
                {selectedPriceRange.label !== "All Prices" && (
                  <button
                    onClick={() => setSelectedPriceRange(priceRanges[0])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    {selectedPriceRange.label}
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            )}

            {/* Product Grid/List */}
            {sortedProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className={`grid gap-4 md:gap-6 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      badge={product.badge}
                      rating={product.rating}
                      reviews={product.reviews}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      badge={product.badge}
                      rating={product.rating}
                      reviews={product.reviews}
                      viewMode="list"
                    />
                  ))}
                </div>
              )
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {/* Load More */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Load More Products
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Shipping", description: "On orders over $99" },
              { icon: RefreshCw, title: "Easy Returns", description: "30-day hassle-free" },
              { icon: Shield, title: "Secure Payment", description: "100% protected" },
              { icon: Star, title: "Premium Quality", description: "Crafted with care" },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <Icon size={22} className="text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4 space-y-6">
                {/* Category */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Type */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Type</h4>
                  <div className="space-y-1">
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedType === type
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedPriceRange.value === range.value
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearFilters()
                      setShowFilters(false)
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductsPage