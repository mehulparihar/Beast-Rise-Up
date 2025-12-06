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
} from "lucide-react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

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
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
]
const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "200+", label: "$200+" },
]

const SearchPage = () => {
   const [searchParams] = useSearchParams()
  const router = useNavigate()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [wishlist, setWishlist] = useState([])
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false) // State for mobile search visibility
  

  // Update search query from URL params
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setSearchQuery(q)
      setInputValue(q)
    } else {
      // If the query param is removed, clear the search state
      setSearchQuery("")
      setInputValue("")
    }
  }, [searchParams])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = [...allProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.colors.some((c) => c.toLowerCase().includes(query)),
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      results = results.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    if (priceRange !== "all") {
      results = results.filter((product) => {
        const price = product.price
        switch (priceRange) {
          case "0-50":
            return price < 50
          case "50-100":
            return price >= 50 && price < 100
          case "100-200":
            return price >= 100 && price < 200
          case "200+":
            return price >= 200
          default:
            return true
        }
      })
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        results.sort((a, b) => b.price - a.price)
        break
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "relevance": // Default sort by relevance if nothing else is selected
      default:
        // If sort is relevance and there's a search query, sort by relevance
        if (sortBy === "relevance" && searchQuery) {
          const query = searchQuery.toLowerCase()
          results.sort((a, b) => {
            const aMatch =
              a.name.toLowerCase().includes(query) ||
              a.category.toLowerCase().includes(query) ||
              a.colors.some((c) => c.toLowerCase().includes(query))
            const bMatch =
              b.name.toLowerCase().includes(query) ||
              b.category.toLowerCase().includes(query) ||
              b.colors.some((c) => c.toLowerCase().includes(query))
            if (aMatch && !bMatch) return -1
            if (!aMatch && bMatch) return 1
            return 0
          })
        }
        break
    }

    return results
  }, [searchQuery, selectedCategory, sortBy, priceRange])

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

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar/>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-900 transition-colors">
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
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                        sortBy === option.value ? "text-red-600 font-medium" : "text-gray-700"
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceRange === range.value
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
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category
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
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            priceRange === range.value
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
                  <motion.div key={product.id} variants={itemVariants}>
                    {viewMode === "grid" ? (
                      // Grid View Card
                      <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">NEW</span>
                            )}
                            {product.isSale && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">SALE</span>
                            )}
                          </div>
                          {/* Wishlist Button */}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              wishlist.includes(product.id)
                                ? "bg-red-500 text-white"
                                : "bg-white/90 text-gray-600 hover:bg-white"
                            }`}
                          >
                            <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                          </button>
                          {/* Quick Add */}
                          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                              Quick Add
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View Card
                      <div className="flex bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative w-40 sm:w-52 flex-shrink-0 bg-gray-100">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">NEW</span>
                            )}
                            {product.isSale && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">SALE</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
                            <div className="flex items-center gap-1 mb-3">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {product.rating} ({product.reviews} reviews)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.colors.map((color) => (
                                <span key={color} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-900">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-2.5 rounded-lg transition-colors ${
                                  wishlist.includes(product.id)
                                    ? "bg-red-100 text-red-500"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                              </button>
                              <button className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-colors">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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
      <Footer/>
    </div>
  )
}

export default SearchPage