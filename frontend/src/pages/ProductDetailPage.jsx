"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCw,
  Shield,
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
  AlertCircle,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "./Loading";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import useWishlistStore from "../stores/useWishlistStore";
import API from "../api/axios";

// ============================================
// HELPERS
// ============================================

/**
 * Validate and extract image URL.
 * Handles: string URL, {url, secure_url} object, "[object Object]" bug
 */
const isValidUrl = (str) =>
  typeof str === "string" &&
  str.length > 1 &&
  !str.includes("[object") &&
  (str.startsWith("http") || str.startsWith("/"));

const extractUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return isValidUrl(img) ? img : null;
  if (typeof img === "object") {
    const url = img.url || img.secure_url;
    return isValidUrl(url) ? url : null;
  }
  return null;
};

/**
 * Get all displayable images for a specific color
 */
const getColorImages = (color) => {
  if (!color?.images || !Array.isArray(color.images)) return [];
  return color.images.map(extractUrl).filter(Boolean);
};

/**
 * Get product image (first available)
 */
const getProductImage = (product) => {
  if (!product) return "/placeholder.svg";

  // 1. defaultImage
  const di = extractUrl(product.defaultImage);
  if (di) return di;

  // 2. variants → colors → images
  if (Array.isArray(product.variants)) {
    for (const variant of product.variants) {
      if (!Array.isArray(variant.colors)) continue;
      for (const color of variant.colors) {
        const imgs = getColorImages(color);
        if (imgs.length > 0) return imgs[0];
      }
    }
  }

  return "/placeholder.svg";
};

const getPrice = (product) => {
  const v = product?.variants?.[0];
  return v?.discountedPrice ?? v?.price ?? 0;
};

const getOriginalPrice = (product) => {
  return product?.variants?.[0]?.price ?? 0;
};

/**
 * Check if product ID is in wishlist.
 * Wishlist can contain plain strings OR populated product objects.
 */
const isInWishlist = (wishlist, productId) => {
  if (!Array.isArray(wishlist) || !productId) return false;
  return wishlist.some((item) => {
    if (typeof item === "string") return item === productId;
    if (item?._id) {
      const id =
        typeof item._id === "string"
          ? item._id
          : item._id.toString?.() || String(item._id);
      return id === productId;
    }
    return false;
  });
};

// ============================================
// SIZE GUIDE DATA
// ============================================

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
};

// ============================================
// RELATED PRODUCT CARD (mini)
// ============================================

function RelatedProductCard({ product: p }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const image = getProductImage(p);
  const price = getPrice(p);
  const originalPrice = getOriginalPrice(p);
  const showOriginal = originalPrice > 0 && originalPrice > price;

  const badge = useMemo(() => {
    if (!p?.createdAt) return null;
    const days =
      (Date.now() - new Date(p.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 14) return "NEW";
    if (showOriginal) return "SALE";
    if (p.isFeatured) return "BEST SELLER";
    if (p.tags?.includes("trending")) return "TRENDING";
    return null;
  }, [p, showOriginal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${p._id}`)}
    >
      <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                badge === "SALE"
                  ? "bg-red-600 text-white"
                  : badge === "NEW"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {badge}
            </span>
          </div>
        )}
        {!imgError && image !== "/placeholder.svg" ? (
          <img
            src={image}
            alt={p.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart size={32} className="text-gray-300" />
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
        {p.title}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <Star size={14} className="fill-red-500 text-red-500" />
        <span className="text-sm font-medium text-gray-900">
          {(p.ratingAverage || 0).toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({p.ratingCount || 0})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-gray-900 font-bold">₹{price.toFixed(2)}</p>
        {showOriginal && (
          <p className="text-gray-400 text-sm line-through">
            ₹{originalPrice.toFixed(2)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // ── Stores ──
  const {
    loadProductById,
    productCache,
    list: allProducts,
    loadProducts,
    loading: storeLoading,
  } = useProductStore();

  const { addToCart, loadCart } = useCartStore();

  const {
    add: addToWishlist,
    remove: removeFromWishlist,
    wishlist,
    loadWishlist,
  } = useWishlistStore();

  // ── Local state ──
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // ── Reviews state ──
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  // ── Load product ──
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = productCache[productId];
      if (cached) {
        setProduct(cached);
        setLoading(false);
        return;
      }

      const result = await loadProductById(productId);
      if (result.success && result.product) {
        setProduct(result.product);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    };

    fetchProduct();

    // Scroll to top on product change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // ── Load wishlist + cart on mount ──
  useEffect(() => {
    loadWishlist().catch(() => {});
    loadCart().catch(() => {});
  }, []);

  // ── Load reviews when tab switches to reviews ──
  useEffect(() => {
    if (activeTab === "reviews" && productId && reviews.length === 0) {
      fetchReviews(1);
    }
  }, [activeTab, productId]);

  // ── Load related products if allProducts is empty ──
  useEffect(() => {
    if (allProducts.length === 0) {
      loadProducts({ page: 1, limit: 50 }).catch(() => {});
    }
  }, []);

  // ── Fetch reviews from API ──
  const fetchReviews = async (page = 1) => {
    setReviewsLoading(true);
    try {
      const { data } = await API.get(`/reviews/${productId}`, {
        params: { page },
      });
      if (page === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      }
      setReviewsPagination(
        data.pagination || { total: 0, page: 1, totalPages: 1 }
      );
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // ── Derived data ──
  const variant = product?.variants?.[0];

  // Set initial color when product/variant loads
  useEffect(() => {
    if (!variant) {
      setSelectedColor(null);
      setSelectedSize("");
      setCurrentImageIndex(0);
      return;
    }

    const firstColor = variant.colors?.[0] || null;
    setSelectedColor(firstColor);
    setSelectedSize("");
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [variant]);

  // ── Images for currently selected color ──
  const images = useMemo(() => {
    // 1. Selected color images
    if (selectedColor) {
      const colorImgs = getColorImages(selectedColor);
      if (colorImgs.length > 0) return colorImgs;
    }

    // 2. Product defaultImage
    const di = extractUrl(product?.defaultImage);
    if (di) return [di];

    // 3. Search all variants/colors
    if (product?.variants) {
      for (const v of product.variants) {
        if (!Array.isArray(v.colors)) continue;
        for (const c of v.colors) {
          const imgs = getColorImages(c);
          if (imgs.length > 0) return imgs;
        }
      }
    }

    return ["/placeholder.svg"];
  }, [selectedColor, product]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor?.name]);

  // ── Price ──
  const price = variant?.discountedPrice ?? variant?.price ?? 0;
  const originalPrice =
    variant?.discountedPrice &&
    variant?.price &&
    variant.price > variant.discountedPrice
      ? variant.price
      : null;
  const savingsAmount = originalPrice ? originalPrice - price : 0;
  const savingsPercent = originalPrice
    ? Math.round((savingsAmount / originalPrice) * 100)
    : 0;

  // ── Stock check ──
  const stockEntry = useMemo(() => {
    if (!selectedSize || !selectedColor || !variant?.stockBySizeColor)
      return null;
    return variant.stockBySizeColor.find(
      (s) =>
        s.size === selectedSize &&
        s.colorName === selectedColor.name
    );
  }, [selectedSize, selectedColor, variant]);

  const isInStock = stockEntry ? stockEntry.stock > 0 : false;
  const stockLeft = stockEntry?.stock ?? null;
  const isLowStock = stockLeft !== null && stockLeft > 0 && stockLeft <= 5;
  const canAddToCart = selectedSize && selectedColor && isInStock;

  // ── Related products ──
  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts
      .filter(
        (p) =>
          p._id !== product._id &&
          (p.category?.toLowerCase() ===
            product.category?.toLowerCase() ||
            p.subCategory === product.subCategory)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  // ── Wishlist check ──
  const isFavorited = isInWishlist(wishlist, productId);

  // ── Badge computation ──
  const badge = useMemo(() => {
    if (!product?.createdAt) return null;
    const days =
      (Date.now() - new Date(product.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 14) return "NEW";
    if (originalPrice) return "SALE";
    if (product.isFeatured) return "BEST SELLER";
    if (product.tags?.includes("trending")) return "TRENDING";
    return null;
  }, [product, originalPrice]);

  // ── Handlers ──

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      if (!selectedSize) toast.error("Please select a size");
      else if (!selectedColor) toast.error("Please select a color");
      else toast.error("This item is out of stock");
      return;
    }

    if (stockLeft !== null && quantity > stockLeft) {
      toast.error(`Only ${stockLeft} items available`);
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        product, // full object for optimistic update in store
        productId: product._id,
        sku: variant.sku,
        size: selectedSize,
        colorName: selectedColor.name,
        quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!canAddToCart) {
      if (!selectedSize) toast.error("Please select a size");
      return;
    }

    await handleAddToCart();
    navigate("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (isFavorited) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  // ── Loading / Error states ──
  if (loading) return <Loading />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <AlertCircle
            size={48}
            className="text-gray-400 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/category/All")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse Products
            <ArrowRight size={18} />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link
              to="/"
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              to="/category/All"
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight
                  size={14}
                  className="text-gray-400"
                />
                <Link
                  to={`/category/${product.category}`}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ═══════════════════════════════════════ */}
          {/* LEFT: Product Images                    */}
          {/* ═══════════════════════════════════════ */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
            >
              {/* Badge */}
              {badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                      badge === "SALE"
                        ? "bg-red-600 text-white"
                        : badge === "NEW"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {badge}
                  </span>
                </div>
              )}

              {/* Low stock warning */}
              {isLowStock && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-500 text-white shadow-lg">
                    <Zap size={12} />
                    Only {stockLeft} left
                  </span>
                </div>
              )}

              {/* Current image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedColor?.name}-${currentImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${product.title} - ${selectedColor?.name || ""}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
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
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 transition-all ${
                      currentImageIndex === idx
                        ? "ring-2 ring-red-500 ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* RIGHT: Product Info                     */}
          {/* ═══════════════════════════════════════ */}
          <div className="lg:py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                {product.category && (
                  <Link
                    to={`/category/${product.category}`}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    {product.category}
                    {product.subCategory
                      ? ` / ${product.subCategory}`
                      : ""}
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i <
                          Math.floor(product.ratingAverage || 0)
                            ? "fill-red-500 text-red-500"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {(product.ratingAverage || 0).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-3xl font-black text-gray-900">
                  ₹{price.toFixed(2)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded">
                      Save ₹{savingsAmount.toFixed(2)} ({savingsPercent}%)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Color Selection */}
              {variant?.colors && variant.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-900">
                      Color:{" "}
                      <span className="font-normal text-gray-600">
                        {selectedColor?.name || "Select"}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {variant.colors.map((color, idx) => (
                      <button
                        key={color.name || idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor?.name === color.name
                            ? "ring-2 ring-red-500 ring-offset-2"
                            : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                        }`}
                        style={{
                          backgroundColor:
                            color.hexCode || "#e5e7eb",
                        }}
                        title={color.name}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {variant?.sizes && variant.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-900">
                      Size
                    </span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <Ruler size={14} />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.sizes.map((size) => {
                      // Check if this size + color combo is in stock
                      const sizeStock =
                        selectedColor &&
                        variant.stockBySizeColor?.find(
                          (s) =>
                            s.size === size &&
                            s.colorName === selectedColor.name
                        );
                      const sizeAvailable =
                        !sizeStock || sizeStock.stock > 0;

                      return (
                        <button
                          key={size}
                          onClick={() =>
                            sizeAvailable && setSelectedSize(size)
                          }
                          disabled={!sizeAvailable}
                          className={`min-w-[50px] h-12 px-4 rounded-lg font-bold transition-all ${
                            selectedSize === size
                              ? "bg-gray-900 text-white"
                              : sizeAvailable
                              ? "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-900"
                              : "bg-gray-100 border-2 border-gray-100 text-gray-300 cursor-not-allowed line-through"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="mt-2 text-sm text-red-600">
                      Please select a size
                    </p>
                  )}
                  {selectedSize &&
                    stockLeft !== null &&
                    stockLeft > 0 &&
                    stockLeft <= 10 && (
                      <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                        <Zap size={14} />
                        Only {stockLeft} left in stock
                      </p>
                    )}
                  {selectedSize && stockLeft === 0 && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Out of stock for this size/color
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <span className="text-sm font-bold text-gray-900 mb-3 block">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="w-12 h-12 flex items-center justify-center rounded-l-lg hover:bg-gray-200 transition-colors text-gray-700"
                    >
                      <Minus size={18} />
                    </motion.button>
                    <span className="w-14 text-center font-bold text-gray-900 text-lg">
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const max =
                          stockLeft !== null
                            ? stockLeft
                            : 99;
                        setQuantity(
                          Math.min(quantity + 1, max)
                        );
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-r-lg hover:bg-gray-200 transition-colors text-gray-700"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total:{" "}
                    <span className="font-bold text-gray-900">
                      ₹{(price * quantity).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: canAddToCart ? 1.01 : 1 }}
                  whileTap={{ scale: canAddToCart ? 0.99 : 1 }}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || addingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : canAddToCart
                      ? "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : addedToCart ? (
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
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${
                    isFavorited
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  <Heart
                    size={22}
                    className={isFavorited ? "fill-red-600" : ""}
                  />
                </motion.button>
              </div>

              {/* Buy Now */}
              <motion.button
                whileHover={{ scale: canAddToCart ? 1.01 : 1 }}
                whileTap={{ scale: canAddToCart ? 0.99 : 1 }}
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 mb-6 border-2 rounded-xl font-bold text-lg transition-all ${
                  canAddToCart
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Buy Now
                <ArrowRight size={20} />
              </motion.button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl mb-6">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: RefreshCw, label: "30-Day Returns" },
                  { icon: Shield, label: "Secure Payment" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon
                      size={20}
                      className="mx-auto mb-1 text-red-600"
                    />
                    <p className="text-xs font-medium text-gray-700">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  Share this product
                </span>
                <div className="flex gap-2">
                  {[Instagram, Twitter, Facebook].map(
                    (Icon, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-colors"
                      >
                        <Icon size={16} />
                      </motion.button>
                    )
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* TABS                                    */}
        {/* ═══════════════════════════════════════ */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              {
                id: "details",
                label: "Details & Features",
              },
              {
                id: "reviews",
                label: `Reviews (${product.ratingCount || 0})`,
              },
              {
                id: "shipping",
                label: "Shipping & Returns",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {/* ── Details Tab ── */}
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Features
                    </h3>
                    {product.features &&
                    product.features.length > 0 ? (
                      <ul className="space-y-3">
                        {product.features.map(
                          (feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3"
                            >
                              <Check
                                size={18}
                                className="text-red-600 flex-shrink-0 mt-0.5"
                              />
                              <span className="text-gray-600">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No features listed.
                      </p>
                    )}
                  </div>

                  {/* Product Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Product Details
                    </h3>
                    {product.details &&
                    Object.keys(product.details).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(product.details)
                          .filter(
                            ([, value]) =>
                              value && value.trim()
                          )
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between py-2 border-b border-gray-100"
                            >
                              <span className="text-gray-500 capitalize">
                                {key}
                              </span>
                              <span className="text-gray-900 font-medium">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        No details available.
                      </p>
                    )}

                    {/* Variant info */}
                    {variant && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-bold text-gray-900">
                          Variant Info
                        </h4>
                        {variant.sku && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">
                              SKU
                            </span>
                            <span className="text-gray-900 font-medium font-mono text-sm">
                              {variant.sku}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">
                            Available Sizes
                          </span>
                          <span className="text-gray-900 font-medium">
                            {variant.sizes?.join(", ") ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">
                            Available Colors
                          </span>
                          <span className="text-gray-900 font-medium">
                            {variant.colors
                              ?.map((c) => c.name)
                              .join(", ") || "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Reviews Tab ── */}
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
                      <div className="text-5xl font-black text-gray-900 mb-2">
                        {(
                          product.ratingAverage || 0
                        ).toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i <
                              Math.floor(
                                product.ratingAverage || 0
                              )
                                ? "fill-red-500 text-red-500"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Based on {product.ratingCount || 0}{" "}
                        reviews
                      </p>
                    </div>
                  </div>

                  {/* Reviews list */}
                  {reviewsLoading && reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">
                        Loading reviews...
                      </p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="p-6 bg-white rounded-2xl border border-gray-100"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">
                                  {review.user?.name ||
                                    "Anonymous"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[
                                    ...Array(
                                      review.rating || 0
                                    ),
                                  ].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className="fill-red-500 text-red-500"
                                    />
                                  ))}
                                  {[
                                    ...Array(
                                      5 -
                                        (review.rating || 0)
                                    ),
                                  ].map((_, i) => (
                                    <Star
                                      key={`empty-${i}`}
                                      size={14}
                                      className="fill-gray-200 text-gray-200"
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star
                        size={32}
                        className="text-gray-300 mx-auto mb-4"
                      />
                      <p className="text-gray-500">
                        No reviews yet. Be the first to review!
                      </p>
                    </div>
                  )}

                  {/* Load more reviews */}
                  {reviewsPagination.page <
                    reviewsPagination.totalPages && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        fetchReviews(
                          reviewsPagination.page + 1
                        )
                      }
                      disabled={reviewsLoading}
                      className="w-full mt-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50"
                    >
                      {reviewsLoading
                        ? "Loading..."
                        : "Load More Reviews"}
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* ── Shipping Tab ── */}
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
                        <Package
                          size={22}
                          className="text-red-600"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Shipping Information
                      </h3>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      {[
                        "Free standard shipping on orders over ₹999",
                        "Express shipping available (2-3 business days)",
                        "Pan-India delivery available",
                        "Order tracking available for all shipments",
                      ].map((text, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2"
                        >
                          <Check
                            size={16}
                            className="text-red-600 flex-shrink-0 mt-1"
                          />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <RefreshCw
                          size={22}
                          className="text-red-600"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Returns & Exchanges
                      </h3>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      {[
                        "30-day hassle-free returns policy",
                        "Free returns for registered members",
                        "Easy size exchanges at no extra cost",
                        "Full refund within 5 business days",
                      ].map((text, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2"
                        >
                          <Check
                            size={16}
                            className="text-red-600 flex-shrink-0 mt-1"
                          />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* RELATED PRODUCTS                        */}
        {/* ═══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                You May Also Like
              </h2>
              <Link
                to="/category/All"
                className="flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
              >
                View All <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <RelatedProductCard
                  key={item._id}
                  product={item}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ═══════════════════════════════════════ */}
      {/* SIZE GUIDE MODAL                        */}
      {/* ═══════════════════════════════════════ */}
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
                <h3 className="text-xl font-bold text-gray-900">
                  Size Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown
                    size={20}
                    className="rotate-180"
                  />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {sizeGuide.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 bg-gray-100 text-left text-sm font-bold text-gray-900"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-sm ${
                              cellIdx === 0
                                ? "font-bold text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Tip: For an oversized fit, we recommend sizing up
                one size.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;