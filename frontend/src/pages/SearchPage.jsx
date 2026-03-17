"use client"

import React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Flame,
  ShoppingBag,
  Search,
  User,
  X,
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Heart,
  Star,
  Instagram,
  Twitter,
  Sparkles,
  TrendingUp,
  Tag,
  ShoppingCart
} from "lucide-react"
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import useProductStore from "../stores/useProductStore"
import useCartStore from "../stores/useCartStore"
import useWishlistStore from "../stores/useWishlistStore"
import Loading from "./Loading"

// Product data
const allProducts = [
  {
    id: 1,
    name: "Beast Mode Hoodie",
    price: 89.99,
    originalPrice: 119.99,
    image: "/black-hoodie-streetwear.png",
    category: "Hoodies",
    rating: 4.8,
    reviews: 124,
    colors: ["Black", "Gray", "Red"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Rise Up Tee",
    price: 49.99,
    originalPrice: null,
    image: "/black-tshirt-streetwear.jpg",
    category: "T-Shirts",
    rating: 4.9,
    reviews: 89,
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: false,
    isSale: false,
  },
  {
    id: 3,
    name: "Street King Joggers",
    price: 79.99,
    originalPrice: null,
    image: "/black-joggers-streetwear.jpg",
    category: "Pants",
    rating: 4.7,
    reviews: 67,
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isSale: false,
  },
  {
    id: 4,
    name: "Urban Legend Cap",
    price: 34.99,
    originalPrice: 44.99,
    image: "/black-cap-streetwear.jpg",
    category: "Accessories",
    rating: 4.6,
    reviews: 45,
    colors: ["Black", "Red"],
    sizes: ["One Size"],
    isNew: false,
    isSale: true,
  },
  {
    id: 5,
    name: "Phantom Sneakers",
    price: 149.99,
    originalPrice: null,
    image: "/black-sneakers-streetwear.jpg",
    category: "Footwear",
    rating: 4.9,
    reviews: 156,
    colors: ["Black", "White", "Red"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    isNew: true,
    isSale: false,
  },
  {
    id: 6,
    name: "Night Rider Jacket",
    price: 199.99,
    originalPrice: 249.99,
    image: "/black-jacket-streetwear.png",
    category: "Jackets",
    rating: 4.8,
    reviews: 92,
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    isSale: true,
  },
  {
    id: 7,
    name: "Savage Crew Sweatshirt",
    price: 69.99,
    originalPrice: null,
    image: "/black-hoodie-streetwear.png",
    category: "Hoodies",
    rating: 4.5,
    reviews: 34,
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    isSale: false,
  },
  {
    id: 8,
    name: "Apex Cargo Pants",
    price: 89.99,
    originalPrice: null,
    image: "/black-joggers-streetwear.jpg",
    category: "Pants",
    rating: 4.7,
    reviews: 78,
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isSale: false,
  },
]

const categories = ["All", "Hoodies", "T-Shirts", "Pants", "Jackets", "Footwear", "Accessories"]
const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Selling", value: "bestselling" },
]
const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-50", label: "Under ₹50" },
  { value: "50-100", label: "₹50 - ₹100" },
  { value: "100-200", label: "₹100 - ₹200" },
  { value: "200+", label: "₹200+" },
]

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
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate();

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
          <img src={image || "/placeholder.svg"} alt={title} className="object-cover" />
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
              <p className="text-lg font-bold text-gray-900">₹{price?.toFixed(2)}</p>
              {originalPrice && <p className="text-gray-400 text-sm line-through">₹{originalPrice?.toFixed(2)}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product._id);
                }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Heart size={18} className={isWishlisted ? "fill-red-600 text-red-600" : "text-gray-400"} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, 1);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
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
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product._id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            size={18}
            className={`${isWishlisted ? "fill-red-600 text-red-600" : "text-gray-400 hover:text-red-600"} transition-colors`}
          />
        </motion.button>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
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
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
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
          className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer">
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
          <p className="text-gray-900 font-bold">₹{price?.toFixed(2)}</p>
          {originalPrice && <p className="text-gray-400 text-sm line-through">₹{originalPrice.toFixed(2)}</p>}
        </div>
      </div>
    </motion.div>
  )
}

const SearchPage = () => {
  const { searchParams } = useParams()
  const router = useNavigate()
  const initialQuery = searchParams || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false) // State for mobile search visibility

  const {
    list: products,
    loading,
    filters,
    setFilters,
    setPage,
    loadProducts,
    loadByCategory,
  } = useProductStore();

  const { addToCart } = useCartStore();
  const { add, remove, wishlist } = useWishlistStore();

  // Update search query from URL params
  useEffect(() => {
    const q = searchParams
    if (q) {
      setSearchQuery(q)
      setInputValue(q)
    } else {
      // If the query param is removed, clear the search state
      setSearchQuery("")
      setInputValue("")
    }
  }, [searchParams])

  useEffect(() => {   
      loadProducts()
  }, [])


  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = [...products]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Category
    if (selectedCategory !== "All") {
      results = results.filter(
        (p) => p.category === selectedCategory
      )
    }

    // Price range
    if (priceRange !== "all") {
      results = results.filter((p) => {
        const price = p.variants?.[0]?.discountedPrice || 0
        if (priceRange === "0-50") return price < 50
        if (priceRange === "50-100") return price >= 50 && price < 100
        if (priceRange === "100-200") return price >= 100 && price < 200
        if (priceRange === "200+") return price >= 200
        return true
      })
    }

    // Sort
    if (sortBy === "price-asc") {
      results.sort((a, b) =>
        a.variants[0].discountedPrice - b.variants[0].discountedPrice
      )
    }

    if (sortBy === "price-desc") {
      results.sort((a, b) =>
        b.variants[0].discountedPrice - a.variants[0].discountedPrice
      )
    }

    if (sortBy === "rating") {
      results.sort((a, b) => b.ratingAverage - a.ratingAverage)
    }

    return results
  }, [products, searchQuery, selectedCategory, priceRange, sortBy])


  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchQuery(inputValue)
      router.push(`/search?q=${encodeURIComponent(inputValue)}`)
    } else {
      // If input is empty, clear search and go to general search page
      setSearchQuery("")
      setInputValue("")
      router.push("/search")
    }
    setShowMobileSearch(false) // Close mobile search on submit
  }

  

  const clearFilters = () => {
    setSelectedCategory("All")
    setPriceRange("all")
    setSortBy("relevance")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Search</span>
              {searchQuery && (
                <>
                  <span>/</span>
                  <span className="text-red-600 font-medium">"{searchQuery}"</span>
                </>
              )}
            </div>

            {/* Dynamic Header based on search state */}
            {searchQuery ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                    Results for "<span className="text-red-600">{searchQuery}</span>"
                  </h1>
                  <p className="text-gray-500">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} matching your
                    search
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setInputValue("")
                    router.push("/search")
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <X size={16} />
                  Clear Search
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Browse All Products</h1>
                <p className="text-gray-500">Discover our complete collection of premium streetwear</p>
              </div>
            )}

            {/* Quick Stats / Suggestions */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                <Sparkles size={14} />
                <span>{allProducts.filter((p) => p.isNew).length} New Arrivals</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                <Tag size={14} />
                <span>{allProducts.filter((p) => p.isSale).length} On Sale</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-medium">
                <TrendingUp size={14} />
                <span>Top Rated</span>
              </div>
            </div>

            {/* Popular Searches */}
            {!searchQuery && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {["Hoodie", "Sneakers", "Jacket", "T-Shirt", "Joggers"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term.toLowerCase())
                        setInputValue(term.toLowerCase())
                        router.push(`/search?q=${term.toLowerCase()}`)
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && <span className="text-gray-500 font-normal"> in {selectedCategory}</span>}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
              >
                <span>{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                <ChevronDown size={16} className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {sortDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setSortDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${sortBy === option.value ? "text-red-600 font-medium" : "text-gray-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
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

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceRange === range.value
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

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                    <div className="space-y-2">
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

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setPriceRange(range.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceRange === range.value
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      clearFilters()
                      setShowFilters(false)
                    }}
                    className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid/List */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} variants={itemVariants}>
                    {viewMode === "grid" ? (
                      // Grid View Card
                      <ProductCard
                        product={product}
                        key={product._id}
                        title={product.title}
                        price={product.variants[0].discountedPrice}
                        originalPrice={product.variants[0].price}
                        image={product.defaultImage}
                        badge={product.isFeatured ? "Featured" : null}
                        rating={product.ratingAverage}
                        reviews={product.ratingCount}
                        viewMode="grid"
                        onAddToCart={(product, qty) => addToCart(product, qty)}
                        isWishlisted={wishlist.includes(product._id)}
                        onToggleWishlist={(id) =>
                          wishlist.includes(id) ? remove(id) : add(id)
                        }
                      />
                    ) : (
                      // List View Card
                      <ProductCard
                        product={product}
                        key={product._id}
                        title={product.title}
                        price={product.variants[0].discountedPrice}
                        originalPrice={product.variants[0].price}
                        image={product.defaultImage}
                        badge={product.isFeatured ? "Featured" : null}
                        rating={product.ratingAverage}
                        reviews={product.ratingCount}
                        viewMode="list"
                        onAddToCart={(product, qty) => addToCart(product, qty)}
                        isWishlisted={wishlist.includes(product._id)}
                        onToggleWishlist={(id) =>
                          wishlist.includes(id) ? remove(id) : add(id)
                        }
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // No Results
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  We couldn't find any products matching "{searchQuery}". Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default SearchPage