"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
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
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "./Loading";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import useWishlistStore from "../stores/useWishlistStore";

// ============================================
// STATIC DATA
// ============================================

const categoryData = [
  {
    title: "Men",
    slug: "Men",
    description: "Bold designs for the modern man",
    image: "/men-streetwear-fashion-model-black-hoodie.jpg",
  },
  {
    title: "Women",
    slug: "Women",
    description: "Power meets elegance",
    image:
      "/women-athletic-wear-fashion-model-gym-clothes.jpg",
  },
  {
    title: "Streetwear",
    slug: "Streetwear",
    description: "Urban style redefined",
    image:
      "/streetwear-fashion-urban-style-jacket-model.jpg",
  },
  {
    title: "Gymwear",
    slug: "Gymwear",
    description: "Performance engineered",
    image:
      "/gym-wear-athletic-man-training-clothes.jpg",
  },
];

const highlights = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over ₹999",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Crafted with the finest materials",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Eco-conscious manufacturing",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help you",
  },
];

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
      "Finally found a brand that gets streetwear aesthetics AND gym functionality. The attention to detail is unmatched.",
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
];

// ============================================
// HELPERS — all bugs fixed
// ============================================

/**
 * Extract a displayable image URL from a product.
 *
 * Handles all edge cases:
 * - defaultImage as valid URL string
 * - defaultImage as {url, public_id} object (backend bug)
 * - defaultImage as "[object Object]" string (backend bug)
 * - variant → color → images[0] as string or object
 * - No images at all → placeholder
 */
const getProductImage = (product) => {
  if (!product) return "/placeholder.svg";

  // Helper: check if a string looks like a valid URL
  const isValidUrl = (str) =>
    typeof str === "string" &&
    str.length > 1 &&
    !str.includes("[object") &&
    (str.startsWith("http") || str.startsWith("/"));

  // 1. Try defaultImage
  const di = product.defaultImage;
  if (di) {
    if (isValidUrl(di)) return di;
    if (typeof di === "object") {
      const url = di.url || di.secure_url;
      if (isValidUrl(url)) return url;
    }
  }

  // 2. Search through variants → colors → images
  const variants = product.variants;
  if (!Array.isArray(variants)) return "/placeholder.svg";

  for (const variant of variants) {
    if (!Array.isArray(variant.colors)) continue;

    for (const color of variant.colors) {
      if (!Array.isArray(color.images) || color.images.length === 0)
        continue;

      for (const img of color.images) {
        if (!img) continue;

        // String URL
        if (isValidUrl(img)) return img;

        // Object with url/secure_url
        if (typeof img === "object") {
          const url = img.url || img.secure_url;
          if (isValidUrl(url)) return url;
        }
      }
    }
  }

  return "/placeholder.svg";
};

/**
 * Get default variant selection for quick add-to-cart.
 *
 * Returns what the cart store needs:
 * { product, productId, sku, size, colorName }
 *
 * `product` = full object (needed for store's optimistic UI update)
 * `productId` = string ID (sent to backend API)
 */
const getDefaultSelection = (product) => {
  if (!product?._id) return null;

  const variant = product.variants?.[0];
  if (!variant?.sku) return null;

  const size = variant.sizes?.[0];
  const color = variant.colors?.[0];

  if (!size || !color?.name) return null;

  return {
    product, // full object for store's optimistic update
    productId: product._id,
    sku: variant.sku,
    size,
    colorName: color.name,
  };
};

/**
 * Auto-compute badge from product data
 */
const getBadge = (product) => {
  if (!product?.createdAt) return null;

  const daysSinceCreated =
    (Date.now() - new Date(product.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);

  const variant = product.variants?.[0];
  const hasDiscount =
    variant?.discountedPrice &&
    variant?.price &&
    variant.discountedPrice < variant.price;

  if (daysSinceCreated <= 14) return "NEW";
  if (hasDiscount) return "SALE";
  if (product.isFeatured) return "BEST SELLER";
  if (product.tags?.includes("trending")) return "TRENDING";
  return null;
};

const getPrice = (product) => {
  const v = product?.variants?.[0];
  return v?.discountedPrice ?? v?.price ?? 0;
};

const getOriginalPrice = (product) => {
  return product?.variants?.[0]?.price ?? 0;
};

/**
 * BUG FIX: Check if product is in wishlist.
 *
 * The wishlist array can contain:
 * - Plain string IDs (after optimistic `add()`)
 * - Populated product objects (after `loadWishlist()` from backend)
 * - ObjectId-like objects with ._id
 *
 * This helper handles all cases.
 */
const isInWishlist = (wishlist, productId) => {
  if (!Array.isArray(wishlist) || !productId) return false;

  return wishlist.some((item) => {
    // Plain string ID
    if (typeof item === "string") return item === productId;

    // Object with _id (populated product or ObjectId)
    if (item?._id) {
      const itemId =
        typeof item._id === "string"
          ? item._id
          : item._id.toString?.() || String(item._id);
      return itemId === productId;
    }

    return false;
  });
};

// ============================================
// PRODUCT CARD
// ============================================

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const image = getProductImage(product);
  const price = getPrice(product);
  const originalPrice = getOriginalPrice(product);
  const badge = getBadge(product);
  const showOriginal = originalPrice > 0 && originalPrice > price;
  const discountPct = showOriginal
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
    : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await onAddToCart(product, 1);
    } finally {
      setAdding(false);
    }
  };

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
      {/* Image container */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm cursor-pointer"
      >
        {/* Badge */}
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

        {/* Wishlist */}
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
            className={`${
              isWishlisted
                ? "fill-red-600 text-red-600"
                : "text-gray-400 hover:text-red-600"
            } transition-colors`}
          />
        </motion.button>

        {/* Product image */}
        {!imgError && image !== "/placeholder.svg" ? (
          <img
            src={image}
            alt={product.title || "Product"}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ShoppingCart
                size={32}
                className="text-gray-300 mx-auto mb-2"
              />
              <p className="text-xs text-gray-400 font-medium">
                No image
              </p>
            </div>
          </div>
        )}

        {/* Add-to-cart hover overlay */}
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
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-lg disabled:opacity-70"
          >
            {adding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Product info */}
      <div>
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
        >
          {product.title || "Untitled Product"}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star
              size={14}
              className="fill-amber-400 text-amber-400"
            />
            <span className="text-sm font-medium text-gray-900">
              {(product.ratingAverage || 0).toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({product.ratingCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-gray-900 font-bold">
            ₹{price.toFixed(2)}
          </p>
          {showOriginal && (
            <>
              <p className="text-gray-400 text-sm line-through">
                ₹{originalPrice.toFixed(2)}
              </p>
              {discountPct > 0 && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  {discountPct}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// PRODUCT SKELETON
// ============================================

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl bg-gray-200 aspect-[3/4] mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// REUSABLE PRODUCT SECTION
// ============================================

function ProductSection({
  title,
  subtitle,
  icon: Icon,
  products,
  linkText,
  linkTo,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  loading,
  bgClass = "bg-white",
}) {
  return (
    <section className={`py-16 md:py-20 px-4 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            {Icon ? (
              <div className="flex items-center gap-2 mb-2">
                <Icon size={24} className="text-red-500" />
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  {title}
                </h2>
              </div>
            ) : (
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">
                {title}
              </h2>
            )}
            <p className="text-gray-500">{subtitle}</p>
          </div>
          <Link
            to={linkTo}
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            {linkText} <ArrowRight size={18} />
          </Link>
        </motion.div>

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                isWishlisted={isInWishlist(
                  wishlist,
                  product._id
                )}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No products found in this section.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// HERO
// ============================================

function Hero({ trendingProduct }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const heroImage = trendingProduct
    ? getProductImage(trendingProduct)
    : "/placeholder.svg?height=800&width=640";

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT */}
          <motion.div
            variants={containerVariants}
            className="order-2 lg:order-1"
          >
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
              Unleash Your{" "}
              <span className="text-red-600">Inner Beast</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
            >
              Premium streetwear and gymwear designed for those who
              refuse to blend in. Crafted with exceptional quality
              for confidence-driven individuals.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-10"
            >
              <motion.button
                onClick={() => navigate("/category/All")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
              >
                Shop Now
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                onClick={() => navigate("/category/All")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors"
              >
                New Arrivals
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6"
            >
              {[
                { icon: Truck, text: "Free Shipping ₹999+" },
                { icon: RefreshCw, text: "30-Day Returns" },
                { icon: Shield, text: "Secure Checkout" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-gray-500"
                >
                  <item.icon size={18} className="text-red-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50">
              <img
                src={heroImage}
                alt="Beast Rise Up Premium Streetwear Collection"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "/placeholder.svg?height=800&width=640";
                }}
              />

              {trendingProduct && (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  onClick={() =>
                    navigate(
                      `/product/${trendingProduct._id}`
                    )
                  }
                  className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <p className="text-xs text-gray-500 mb-1">
                    Trending Now
                  </p>
                  <p className="text-gray-900 font-bold line-clamp-1">
                    {trendingProduct.title}
                  </p>
                  <p className="text-red-600 font-bold">
                    ₹{getPrice(trendingProduct).toFixed(2)}
                  </p>
                </motion.div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-red-50 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-red-100 rounded-full -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CATEGORIES
// ============================================

function Categories({ categoryCounts }) {
  const navigate = useNavigate();

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
            <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500">
              Discover curated collections built for your lifestyle
            </p>
          </div>
          <Link
            to="/category/All"
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
          >
            View All Categories <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryData.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              onClick={() =>
                navigate(`/category/${category.slug}`)
              }
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] cursor-pointer shadow-lg shadow-gray-200/50"
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={`${category.title} collection`}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs text-white/80 font-medium mb-1">
                  {categoryCounts[category.slug.toLowerCase()]
                    ? `${categoryCounts[category.slug.toLowerCase()]}+ Items`
                    : "Shop Now"}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {category.title}
                </h3>
                <p className="text-sm text-white/70 mb-3 hidden md:block">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                  Shop Now{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BRAND HIGHLIGHTS
// ============================================

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
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">
            Why Choose Beast Rise Up
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We're committed to delivering exceptional quality and
            service at every step
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                  <Icon size={24} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS
// ============================================

function Testimonials() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">
            Loved by 50,000+ Customers
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            See what our community has to say about Beast Rise Up
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
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
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.image || "/placeholder.svg"}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {t.name}
                  </p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BRAND STORY
// ============================================

function BrandStory() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 px-4 bg-white">
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
              Born to Inspire.{" "}
              <span className="text-red-600">
                Built to Empower.
              </span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Beast Rise Up was born from a simple belief:
              exceptional people deserve exceptional apparel.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              From the gym to the streets, our collections empower
              individuals to embrace their strongest selves.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're not just a brand — we're a community of
              go-getters, dreamers, and achievers who refuse to
              settle for ordinary.
            </p>
            <motion.button
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
            >
              Learn Our Mission
              <ArrowRight size={18} />
            </motion.button>
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
  );
}

// ============================================
// NEWSLETTER
// ============================================

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

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
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Join the Beast Movement
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new drops, early sales, and
            insider content.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
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
          <p className="text-xs text-gray-500 mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOMEPAGE — main component
// ============================================

const HomePage = () => {
  const navigate = useNavigate();

  // ── Stores (using CORRECT method names from your stores) ──
  const {
    list: products,
    loading,
    loadProducts,
  } = useProductStore();

  // BUG FIX: Use `loadCart` not `fetchCart`
  const { addToCart, loadCart } = useCartStore();

  // BUG FIX: Use `loadWishlist` not `fetchWishlist`
  const {
    add: addToWishlist,
    remove: removeFromWishlist,
    wishlist,
    loadWishlist,
  } = useWishlistStore();

  // ── Load data on mount ──
  useEffect(() => {
    // Load products (public — always works)
    loadProducts({ page: 1, limit: 50 });

    // Load cart + wishlist (authenticated — fails silently if not logged in)
    loadCart().catch(() => {});
    loadWishlist().catch(() => {});
  }, []);

  // ── Derive sections ──
  const bestSellers = useMemo(
    () =>
      [...products]
        .filter(
          (p) =>
            p.isFeatured || (p.ratingCount || 0) >= 10
        )
        .sort(
          (a, b) =>
            (b.ratingCount || 0) - (a.ratingCount || 0)
        )
        .slice(0, 4),
    [products]
  );

  const trendingProducts = useMemo(
    () =>
      [...products]
        .filter(
          (p) =>
            p.tags?.includes("trending") ||
            (p.ratingAverage || 0) >= 4.0
        )
        .sort(
          (a, b) =>
            (b.ratingAverage || 0) -
            (a.ratingAverage || 0)
        )
        .slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 4),
    [products]
  );

  const heroTrending =
    trendingProducts[0] || newArrivals[0] || null;

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = (p.category || "").toLowerCase();
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // ── BUG FIX: addToCart handler ──
  // Must pass `product` (full object) for store's optimistic update
  // Plus { productId, sku, size, colorName } for the API call
  const handleAddToCart = useCallback(
    async (product, qty = 1) => {
      const selection = getDefaultSelection(product);
      if (!selection) {
        toast.error(
          "This product has no available variants. Please view product details."
        );
        return;
      }

      // selection already has { product, productId, sku, size, colorName }
      await addToCart({
        ...selection,
        quantity: qty,
      });
    },
    [addToCart]
  );

  // ── BUG FIX: wishlist toggle ──
  // Extracts the correct ID regardless of whether wishlist
  // contains strings or populated objects
  const handleToggleWishlist = useCallback(
    async (productId) => {
      const isCurrentlyWishlisted = isInWishlist(
        wishlist,
        productId
      );

      if (isCurrentlyWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  // ── Loading ──
  if (loading && products.length === 0) {
    return <Loading />;
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <Hero trendingProduct={heroTrending} />

      <Categories categoryCounts={categoryCounts} />

      <ProductSection
        title="Best Sellers"
        subtitle="The most loved pieces by our community"
        products={bestSellers}
        linkText="View All"
        linkTo="/category/All"
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        loading={loading}
        bgClass="bg-gray-50"
      />

      <ProductSection
        title="Trending Now"
        subtitle="What the community is loving right now"
        icon={Flame}
        products={trendingProducts}
        linkText="See All Trending"
        linkTo="/category/All"
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        loading={loading}
        bgClass="bg-white"
      />

      <ProductSection
        title="Just Dropped"
        subtitle="Fresh arrivals to elevate your wardrobe"
        icon={Sparkles}
        products={newArrivals}
        linkText="View All New"
        linkTo="/category/All"
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        loading={loading}
        bgClass="bg-gray-50"
      />

      <BrandHighlights />
      <Testimonials />
      <BrandStory />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default HomePage;