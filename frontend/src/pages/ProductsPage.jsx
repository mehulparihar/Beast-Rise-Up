"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
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
import useProductStore from "../stores/useProductStore"
import Loading from "./Loading"
import useCartStore from "../stores/useCartStore"
import useWishlistStore from "../stores/useWishlistStore"



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
   { value: "all", label: "All Prices" },
  { value: "0-50", label: "Under ₹50" },
  { value: "50-100", label: "₹50 - ₹100" },
  { value: "100-200", label: "₹100 - ₹200" },
  { value: "200+", label: "₹200+" },
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

const ProductsPage = () => {
  const router = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [viewMode, setViewMode] = useState("grid")
  const [gridCols, setGridCols] = useState(3)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const { categoryName } = useParams();

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
  };


  useEffect(() => {
    if (!categoryName) return;

    const category = categoryName.toLowerCase();

    const params = {};

    if (selectedType !== "All") params.type = selectedType;
    if (searchQuery) params.search = searchQuery;
    if (selectedSort?.value) params.sort = selectedSort.value;
    params.priceMin = selectedPriceRange.min;
    params.priceMax = selectedPriceRange.max;

    if (category === "all") {
      loadProducts({
        page: 1,
        filters: params,
      });
    } else {
      loadByCategory(category, {
        page: 1,
        ...params,
      });
    }
  }, [
    categoryName,
    selectedType,
    selectedPriceRange,
    selectedSort,
    searchQuery,
  ])

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // TYPE (subCategory)
        if (selectedType !== "All") {
          if (p.subCategory !== typeToSubCategory[selectedType]) return false;
        }

        // PRICE
        const price = p?.variants?.[0]?.discountedPrice ?? 0;
        if (price < selectedPriceRange.min) return false;
        if (price > selectedPriceRange.max) return false;

        // SEARCH
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!p.title.toLowerCase().includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort.value === "price-asc") {
          return a.variants[0].discountedPrice - b.variants[0].discountedPrice;
        }
        if (selectedSort.value === "price-desc") {
          return b.variants[0].discountedPrice - a.variants[0].discountedPrice;
        }
        if (selectedSort.value === "rating") {
          return (b.ratingAverage || 0) - (a.ratingAverage || 0);
        }
        return 0;
      });
  }, [
    products,
    selectedType,
    selectedPriceRange,
    selectedSort,
    searchQuery,
  ]);


  console.log("Category from URL:", filteredProducts);
  console.log("Selected Filters:", filters);

  const clearFilters = () => {
    router("/category/all")
    setSelectedType("All");
    setSelectedPriceRange(priceRanges[0]);
    setSearchQuery("");
    setPage(1);
    setFilters({}, true); // clear store filters
    loadProducts({ page: 1 });
  }

  const hasActiveFilters =
    categoryName !== "all" ||
    selectedType !== "All" ||
    selectedPriceRange.label !== "All Prices" ||
    searchQuery !== ""

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  { loading && <Loading /> }

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
                    router(`/category/${category}`)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-semibold rounded-lg transition-colors ${categoryName === category ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{categoryName === "all" ? "All Products" : categoryName}</span>


            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {categoryName === "all" ? "All Products" : categoryName}
            </h1>
            <p className="text-gray-500">
              Discover {filteredProducts.length} premium pieces crafted for those who refuse to blend in
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
                      onClick={() => router(`/category/${category}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryName.toLowerCase() === category.toLowerCase()
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
                  {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
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
                      onClick={() => setGridCols(3)}
                      className={`p-2 rounded-md transition-colors ${gridCols === 3 ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setGridCols(2)}
                      className={`p-2 rounded-md transition-colors ${gridCols === 2 ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
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
                {categoryName !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
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
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className={`grid gap-4 md:gap-6 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
                  {filteredProducts.map((product) => (
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
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
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
                        onClick={() => router(`/category/${category}`)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryName === category
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