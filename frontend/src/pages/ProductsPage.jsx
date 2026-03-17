"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Heart,
  Star,
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
  List,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import useProductStore from "../stores/useProductStore"
import Loading from "./Loading"
import useCartStore from "../stores/useCartStore"
import useWishlistStore from "../stores/useWishlistStore"

/* ═══════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════ */

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

const typeToSubCategory = {
  "T-Shirts": "t-shirts",
  Hoodies: "hoodies",
  Sweatshirts: "sweatshirts",
  Pants: "pants",
  Shorts: "shorts",
  Jackets: "jackets",
  Tanks: "tanks",
  Leggings: "leggings",
  "Sports Bras": "sports-bras",
  Hats: "hats",
  Bags: "bags",
}

const priceRanges = [
  { value: "all", label: "All Prices", min: 0, max: Infinity },
  { value: "0-500", label: "Under ₹500", min: 0, max: 500 },
  { value: "500-1000", label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { value: "1000-2000", label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { value: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { value: "5000+", label: "₹5,000+", min: 5000, max: Infinity },
  { value: "custom", label: "Custom Range", min: 0, max: Infinity },
]

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Selling", value: "bestselling" },
]

/* ═══════════════════════════════════════
   HELPER: get display price from product
   ═══════════════════════════════════════ */

const getProductPrice = (product) => {
  const v = product?.variants?.[0]
  if (!v) return 0
  if (v.discountedPrice != null && v.discountedPrice > 0) return Number(v.discountedPrice)
  if (v.price != null && v.price > 0) return Number(v.price)
  return 0
}

const getOriginalPrice = (product) => {
  const v = product?.variants?.[0]
  if (!v) return null
  const dp = v.discountedPrice != null && v.discountedPrice > 0 ? Number(v.discountedPrice) : null
  const p = v.price != null && v.price > 0 ? Number(v.price) : null
  // only show original if there's a discount
  if (dp && p && p > dp) return p
  return null
}

/* ═══════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════ */

function ProductCard({
  product,
  title,
  price,
  originalPrice,
  image,
  badge,
  rating,
  reviews,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  viewMode = "grid",
}) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        onClick={() => navigate(`/product/${product._id}`)}
        className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {badge && (
            <span
              className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-bold rounded-full ${
                badge === "NEW"
                  ? "bg-gray-900 text-white"
                  : badge === "SALE"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {badge}
            </span>
          )}
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-red-500 text-red-500" />
                <span className="text-sm font-medium text-gray-900">
                  {rating ?? 0}
                </span>
              </div>
              <span className="text-sm text-gray-500">({reviews ?? 0} reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900">₹{price?.toFixed(2)}</p>
              {originalPrice && (
                <p className="text-gray-400 text-sm line-through">
                  ₹{originalPrice?.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleWishlist(product._id)
                }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Heart
                  size={18}
                  className={
                    isWishlisted
                      ? "fill-red-600 text-red-600"
                      : "text-gray-400"
                  }
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart(product, 1)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
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
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm cursor-pointer"
      >
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                badge === "NEW"
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
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product._id)
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            size={18}
            className={`${
              isWishlisted
                ? "fill-red-600 text-red-600"
                : "text-gray-400 hover:text-red-600"
            } transition-colors`}
          />
        </motion.button>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          className="absolute bottom-3 left-3 right-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product, 1)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-lg"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
      <div>
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
        >
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-red-500 text-red-500" />
            <span className="text-sm font-medium text-gray-900">
              {rating ?? 0}
            </span>
          </div>
          <span className="text-sm text-gray-500">({reviews ?? 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-900 font-bold">₹{price?.toFixed(2)}</p>
          {originalPrice && (
            <p className="text-gray-400 text-sm line-through">
              ₹{originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   PRICE RANGE FILTER COMPONENT
   ═══════════════════════════════════════ */

function PriceRangeFilter({
  selectedPriceRange,
  setSelectedPriceRange,
  customMin,
  setCustomMin,
  customMax,
  setCustomMax,
  onApplyCustom,
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
      <div className="space-y-1">
        {priceRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => {
              setSelectedPriceRange(range)
              if (range.value !== "custom") {
                setCustomMin("")
                setCustomMax("")
              }
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedPriceRange.value === range.value
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Price Inputs */}
      {selectedPriceRange.value === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onApplyCustom()
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="No limit"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onApplyCustom()
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={onApplyCustom}
            className="w-full px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Apply Price Range
          </button>
          {(customMin || customMax) && (
            <p className="text-xs text-gray-500 text-center">
              Filtering: ₹{customMin || "0"} – ₹{customMax || "∞"}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */

const ProductsPage = () => {
  const navigate = useNavigate()
  const { categoryName = "all" } = useParams()

  /* ── filter state ── */
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [customMin, setCustomMin] = useState("")
  const [customMax, setCustomMax] = useState("")
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])

  /* ── view state ── */
  const [viewMode, setViewMode] = useState("grid")
  const [gridCols, setGridCols] = useState(3)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  /* ── stores ── */
  const {
    list: products,
    loading,
    filters,
    setFilters,
    setPage,
    loadProducts,
    loadByCategory,
  } = useProductStore()

  const { addToCart } = useCartStore()
  const { add, remove, wishlist } = useWishlistStore()

  /* ══════════════════════════════
     COMPUTED: active price bounds
     ══════════════════════════════ */
  const activePriceMin = useMemo(() => {
    if (selectedPriceRange.value === "custom") {
      return customMin !== "" ? Number(customMin) : 0
    }
    return selectedPriceRange.min
  }, [selectedPriceRange, customMin])

  const activePriceMax = useMemo(() => {
    if (selectedPriceRange.value === "custom") {
      return customMax !== "" ? Number(customMax) : Infinity
    }
    return selectedPriceRange.max
  }, [selectedPriceRange, customMax])

  /* ══════════════════════════════
     IMAGE HELPER
     ══════════════════════════════ */
  const getProductImage = useCallback((product) => {
    const img = product?.variants?.[0]?.colors?.[0]?.images?.[0]
    if (!img) return "/placeholder.svg"
    if (typeof img === "string") return img
    return img.url || img.secure_url || "/placeholder.svg"
  }, [])

  const getDefaultSelection = useCallback((product) => {
    const variant = product?.variants?.[0]
    if (!variant) return null
    const size = variant?.sizes?.[0]
    const color = variant?.colors?.[0]
    if (!size || !color) return null
    return {
      product,
      productId: product._id,
      sku: variant.sku,
      size,
      colorName: color.name,
    }
  }, [])

  /* ══════════════════════════════
     APPLY CUSTOM PRICE
     ══════════════════════════════ */
  const applyCustomPrice = useCallback(() => {
    const min = customMin !== "" ? Number(customMin) : 0
    const max = customMax !== "" ? Number(customMax) : Infinity

    if (min < 0) {
      setCustomMin("0")
      return
    }
    if (max !== Infinity && max < min) {
      setCustomMax(String(min))
      return
    }

    // Update the custom range object so filtering triggers
    setSelectedPriceRange({
      value: "custom",
      label: `₹${min} – ${max === Infinity ? "∞" : `₹${max}`}`,
      min,
      max,
    })
  }, [customMin, customMax])

  /* ══════════════════════════════
     LOAD DATA ON FILTER CHANGE
     ══════════════════════════════ */
  useEffect(() => {
    const category = (categoryName || "all").toLowerCase()

    const params = {}

    // type → subCategory
    if (selectedType !== "All" && typeToSubCategory[selectedType]) {
      params.subCategory = typeToSubCategory[selectedType]
    }

    // search
    if (searchQuery.trim()) {
      params.search = searchQuery.trim()
    }

    // sort
    if (selectedSort?.value && selectedSort.value !== "relevance") {
      params.sort = selectedSort.value
    }

    // price — only send finite values
    if (activePriceMin > 0) {
      params.priceMin = activePriceMin
    }
    if (activePriceMax < Infinity) {
      params.priceMax = activePriceMax
    }

    if (category === "all") {
      loadProducts({ page: 1, filters: params })
    } else {
      loadByCategory(category, { page: 1, ...params })
    }
  }, [
    categoryName,
    selectedType,
    activePriceMin,
    activePriceMax,
    selectedSort,
    searchQuery,
  ])

  /* ══════════════════════════════
     CLIENT SIDE FILTERING + SORT
     ══════════════════════════════ */
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return []

    return products
      .filter((p) => {
        // TYPE
        if (selectedType !== "All") {
          const expected = typeToSubCategory[selectedType]
          if (expected && p.subCategory !== expected) return false
        }

        // PRICE
        const price = getProductPrice(p)
        if (price < activePriceMin) return false
        if (price > activePriceMax) return false

        // SEARCH
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = p.title?.toLowerCase().includes(q)
          const matchBrand = p.brand?.toLowerCase().includes(q)
          const matchCategory = p.category?.toLowerCase().includes(q)
          if (!matchTitle && !matchBrand && !matchCategory) return false
        }

        return true
      })
      .sort((a, b) => {
        const priceA = getProductPrice(a)
        const priceB = getProductPrice(b)

        switch (selectedSort.value) {
          case "price-asc":
            return priceA - priceB
          case "price-desc":
            return priceB - priceA
          case "rating":
            return (b.ratingAverage || 0) - (a.ratingAverage || 0)
          case "newest":
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            )
          default:
            return 0
        }
      })
  }, [products, selectedType, activePriceMin, activePriceMax, selectedSort, searchQuery])

  /* ══════════════════════════════
     CLEAR FILTERS
     ══════════════════════════════ */
  const clearFilters = useCallback(() => {
    navigate("/category/all")
    setSelectedType("All")
    setSelectedPriceRange(priceRanges[0])
    setCustomMin("")
    setCustomMax("")
    setSearchQuery("")
    setSelectedSort(sortOptions[0])
    if (setPage) setPage(1)
    if (setFilters) setFilters({}, true)
    loadProducts({ page: 1 })
  }, [navigate, loadProducts, setPage, setFilters])

  const hasActiveFilters =
    categoryName?.toLowerCase() !== "all" ||
    selectedType !== "All" ||
    selectedPriceRange.value !== "all" ||
    searchQuery.trim() !== ""

  /* ══════════════════════════════
     SEARCH HANDLER
     ══════════════════════════════ */
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  /* ══════════════════════════════
     ACTIVE PRICE LABEL
     ══════════════════════════════ */
  const activePriceLabel = useMemo(() => {
    if (selectedPriceRange.value === "all") return null
    if (selectedPriceRange.value === "custom") {
      if (!customMin && !customMax) return null
      return `₹${customMin || "0"} – ${customMax ? `₹${customMax}` : "∞"}`
    }
    return selectedPriceRange.label
  }, [selectedPriceRange, customMin, customMax])

  /* ══════════════════════════════
     RENDER
     ══════════════════════════════ */

  // if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50">
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
                    navigate(`/category/${category}`)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-semibold rounded-lg transition-colors ${
                    categoryName?.toLowerCase() === category.toLowerCase()
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/account"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {categoryName?.toLowerCase() === "all"
                  ? "All Products"
                  : categoryName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                  {categoryName?.toLowerCase() === "all"
                    ? "All Products"
                    : categoryName}
                </h1>
                <p className="text-gray-500">
                  Discover {filteredProducts.length} premium pieces crafted for
                  those who refuse to blend in
                </p>
              </div>

              {/* Search bar in header */}
              <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ══════ DESKTOP SIDEBAR ══════ */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:underline"
                  >
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
                      onClick={() => navigate(`/category/${category}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryName?.toLowerCase() === category.toLowerCase()
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedType === type
                          ? "bg-gray-900 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <PriceRangeFilter
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                customMin={customMin}
                setCustomMin={setCustomMin}
                customMax={customMax}
                setCustomMax={setCustomMax}
                onApplyCustom={applyCustomPrice}
              />
            </div>
          </aside>

          {/* ══════ MAIN CONTENT ══════ */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <span className="text-sm text-gray-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
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
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        sortDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setSortDropdownOpen(false)}
                        />
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
                              {selectedSort.value === option.value && (
                                <Check size={16} className="text-red-600" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Mode */}
                <div className="hidden md:flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="List view"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Grid Columns */}
                {viewMode === "grid" && (
                  <div className="hidden lg:flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setGridCols(3)}
                      className={`p-2 rounded-md transition-colors ${
                        gridCols === 3
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setGridCols(2)}
                      className={`p-2 rounded-md transition-colors ${
                        gridCols === 2
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-sm text-gray-500">Active filters:</span>

                {categoryName?.toLowerCase() !== "all" && (
                  <button
                    onClick={() => navigate("/category/all")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    {categoryName}
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

                {activePriceLabel && (
                  <button
                    onClick={() => {
                      setSelectedPriceRange(priceRanges[0])
                      setCustomMin("")
                      setCustomMax("")
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    {activePriceLabel}
                    <X size={14} />
                  </button>
                )}

                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                  >
                    "{searchQuery}"
                    <X size={14} />
                  </button>
                )}

                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:underline ml-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* Product Grid / List */}
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div
                  className={`grid gap-4 md:gap-6 ${
                    gridCols === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      product={product}
                      key={product._id}
                      title={product.title}
                      price={getProductPrice(product)}
                      originalPrice={getOriginalPrice(product)}
                      image={getProductImage(product)}
                      badge={product.isFeatured ? "Featured" : null}
                      rating={product.ratingAverage}
                      reviews={product.ratingCount}
                      viewMode="grid"
                      onAddToCart={(prod, qty = 1) => {
                        const selection = getDefaultSelection(prod)
                        if (!selection) return
                        addToCart({ ...selection, quantity: qty })
                      }}
                      isWishlisted={wishlist.includes(product._id)}
                      onToggleWishlist={(id) =>
                        wishlist.includes(id) ? remove(id) : add(id)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      product={product}
                      key={product._id}
                      title={product.title}
                      price={getProductPrice(product)}
                      originalPrice={getOriginalPrice(product)}
                      image={getProductImage(product)}
                      badge={product.isFeatured ? "Featured" : null}
                      rating={product.ratingAverage}
                      reviews={product.ratingCount}
                      viewMode="list"
                      onAddToCart={(prod, qty = 1) => {
                        const selection = getDefaultSelection(prod)
                        if (!selection) return
                        addToCart({ ...selection, quantity: qty })
                      }}
                      isWishlisted={wishlist.includes(product._id)}
                      onToggleWishlist={(id) =>
                        wishlist.includes(id) ? remove(id) : add(id)
                      }
                    />
                  ))}
                </div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
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
            {filteredProducts.length > 0 && (
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
              {
                icon: Truck,
                title: "Free Shipping",
                description: "On orders over ₹999",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                description: "30-day hassle-free",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "100% protected",
              },
              {
                icon: Star,
                title: "Premium Quality",
                description: "Crafted with care",
              },
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
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* ══════ MOBILE FILTERS DRAWER ══════ */}
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
                        onClick={() => navigate(`/category/${category}`)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          categoryName?.toLowerCase() ===
                          category.toLowerCase()
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type
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
                <PriceRangeFilter
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  customMin={customMin}
                  setCustomMin={setCustomMin}
                  customMax={customMax}
                  setCustomMax={setCustomMax}
                  onApplyCustom={applyCustomPrice}
                />
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