"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Flame,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  Shield,
  CreditCard,
  ChevronRight,
  Check,
  MapPin,
  Phone,
  User,
  Mail,
  Home,
  Building,
  Loader2,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Star,
  AlertCircle,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import useCartStore from "../../stores/useCartStore"
import useAuthStore from "../../stores/useAuthStore"
import useProductStore from "../../stores/useProductStore"
import useWishlistStore from "../../stores/useWishlistStore"
import { createPaymentOrder, verifyPayment } from "../../api/payment.api"

/* ═══════════════════════════════════════
   IMAGE HELPERS
   ═══════════════════════════════════════ */

const resolveImageSrc = (img) => {
  if (!img) return null
  if (typeof img === "string" && img.length > 0 && img !== "/placeholder.svg") return img
  if (typeof img === "object") return img.url || img.secure_url || null
  return null
}

const getCartItemImage = (item) => {
  // 1. Selected color images (most specific)
  console.log(item);
  const colorImages = item?.product.variants[0].colors[0].images;
  if (Array.isArray(colorImages) && colorImages.length > 0) {
    const src = resolveImageSrc(colorImages[0])
    if (src) return src
  }

  // 2. Variant's first color's first image
  const variantColors = item?.productSnapshot?.variant?.colors
  if (Array.isArray(variantColors)) {
    for (const color of variantColors) {
      if (Array.isArray(color.images) && color.images.length > 0) {
        const src = resolveImageSrc(color.images[0])
        if (src) return src
      }
    }
  }

  // 3. defaultImage on snapshot
  const defaultImg = resolveImageSrc(item?.productSnapshot?.defaultImage)
  if (defaultImg) return defaultImg

  // 4. image field directly on snapshot
  const directImg = resolveImageSrc(item?.productSnapshot?.image)
  if (directImg) return directImg

  // 5. product level image
  const productImg = resolveImageSrc(item?.product?.defaultImage)
  if (productImg) return productImg

  // 6. fallback — try product variants
  const productVariants = item?.product?.variants
  if (Array.isArray(productVariants)) {
    for (const v of productVariants) {
      if (Array.isArray(v.colors)) {
        for (const c of v.colors) {
          if (Array.isArray(c.images) && c.images.length > 0) {
            const src = resolveImageSrc(c.images[0])
            if (src) return src
          }
        }
      }
    }
  }

  return "/placeholder.svg"
}

const getProductImage = (product) => {
  // default image
  const defaultImg = resolveImageSrc(product?.defaultImage)
  if (defaultImg) return defaultImg

  // first variant → first color → first image
  const variants = product?.variants
  if (Array.isArray(variants)) {
    for (const v of variants) {
      if (Array.isArray(v.colors)) {
        for (const c of v.colors) {
          if (Array.isArray(c.images) && c.images.length > 0) {
            const src = resolveImageSrc(c.images[0])
            if (src) return src
          }
        }
      }
    }
  }

  return "/placeholder.svg"
}

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
  if (dp && p && p > dp) return p
  return null
}

/* ═══════════════════════════════════════
   CART ITEM PRICE HELPER
   ═══════════════════════════════════════ */

const getCartItemPrice = (item) => {
  const variant = item?.productSnapshot?.variant
  if (!variant) return 0
  if (variant.discountedPrice != null && variant.discountedPrice > 0) {
    return Number(variant.discountedPrice)
  }
  if (variant.price != null && variant.price > 0) {
    return Number(variant.price)
  }
  return 0
}

const getCartItemOriginalPrice = (item) => {
  const variant = item?.productSnapshot?.variant
  if (!variant) return null
  const dp = variant.discountedPrice != null && variant.discountedPrice > 0
    ? Number(variant.discountedPrice) : null
  const p = variant.price != null && variant.price > 0
    ? Number(variant.price) : null
  if (dp && p && p > dp) return p
  return null
}

/* ═══════════════════════════════════════
   RECOMMENDED PRODUCT CARD
   ═══════════════════════════════════════ */

function RecommendedCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const navigate = useNavigate()
  const price = getProductPrice(product)
  const originalPrice = getOriginalPrice(product)
  const image = getProductImage(product)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-square bg-gray-100">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
            HOT
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product._id)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
        >
          <Heart
            size={14}
            className={isWishlisted ? "fill-red-600 text-red-600" : "text-gray-600"}
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {product.ratingAverage > 0 && (
            <div className="flex items-center gap-1 mr-1">
              <Star size={11} className="fill-red-500 text-red-500" />
              <span className="text-[11px] text-gray-500">{product.ratingAverage}</span>
            </div>
          )}
          <span className="text-sm font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(product)
          }}
          className="w-full mt-3 py-2 bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   CHECKOUT PAGE
   ═══════════════════════════════════════ */

const CheckoutPage = () => {
  const navigate = useNavigate()

  /* ── state ── */
  const [step, setStep] = useState("cart")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingErrors, setShippingErrors] = useState({})

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  })

  /* ── stores ── */
  const {
    cart: cartItems,
    loadCart,
    updateQuantity,
    removeFromCart,
    addToCart,
  } = useCartStore()

  const { user } = useAuthStore()

  const {
    list: allProducts,
    loading: productsLoading,
    loadProducts,
  } = useProductStore()

  const { add: addToWishlist, remove: removeFromWishlist, wishlist } = useWishlistStore()

  /* ── load cart + products ── */
  useEffect(() => {
    loadCart()
    loadProducts({ page: 1, limit: 20 })
  }, [])

  /* ── prefill shipping from user profile ── */
  useEffect(() => {
    if (!user) return

    const defaultAddress =
      user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0]

    const [firstName = "", ...lastParts] =
      (defaultAddress?.fullName || user.name || "").split(" ")
    const lastName = lastParts.join(" ")

    setShippingInfo((prev) => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
      email: prev.email || user.email || "",
      phone: prev.phone || defaultAddress?.phone || user.phone || "",
      address: prev.address || defaultAddress?.addressLine1 || "",
      apartment: prev.apartment || defaultAddress?.addressLine2 || "",
      city: prev.city || defaultAddress?.city || "",
      state: prev.state || defaultAddress?.state || "",
      pincode: prev.pincode || defaultAddress?.pincode || "",
    }))
  }, [user])

  /* ═══════ RECOMMENDED PRODUCTS ═══════ */
  const recommendedProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return []

    // Get IDs already in cart
    const cartProductIds = new Set(
      cartItems.map((item) => item.product?._id || item.productId).filter(Boolean)
    )

    // Filter out cart items, prioritize featured
    const available = allProducts.filter(
      (p) => p._id && !cartProductIds.has(p._id)
    )

    // Sort: featured first, then by rating
    const sorted = [...available].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return (b.ratingAverage || 0) - (a.ratingAverage || 0)
    })

    return sorted.slice(0, 4)
  }, [allProducts, cartItems])

  /* ═══════ CART CALCULATIONS ═══════ */
  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        return sum + getCartItemPrice(item) * (item.quantity || 1)
      }, 0),
    [cartItems]
  )

  const shipping = subtotal > 1000 ? 0 : 99
  const discount = couponDiscount
  const total = Math.max(0, subtotal + shipping - discount)

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  )

  /* ═══════ COUPON ═══════ */
  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setIsApplyingCoupon(true)
    setCouponError("")

    await new Promise((resolve) => setTimeout(resolve, 800))

    const code = couponCode.toUpperCase().trim()

    if (code === "BEAST20") {
      setAppliedCoupon(code)
      setCouponDiscount(Math.round(subtotal * 0.2))
      setCouponCode("")
    } else if (code === "FIRST100") {
      setAppliedCoupon(code)
      setCouponDiscount(100)
      setCouponCode("")
    } else {
      setCouponError("Invalid coupon code. Try BEAST20 or FIRST100")
    }

    setIsApplyingCoupon(false)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  // Recalculate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon === "BEAST20") {
      setCouponDiscount(Math.round(subtotal * 0.2))
    }
  }, [subtotal, appliedCoupon])

  /* ═══════ SHIPPING VALIDATION ═══════ */
  const validateShipping = () => {
    const errors = {}

    if (!shippingInfo.firstName.trim()) errors.firstName = "First name is required"
    if (!shippingInfo.lastName.trim()) errors.lastName = "Last name is required"
    if (!shippingInfo.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      errors.email = "Enter a valid email"
    }
    if (!shippingInfo.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^[+]?\d{10,13}$/.test(shippingInfo.phone.replace(/\s/g, ""))) {
      errors.phone = "Enter a valid phone number"
    }
    if (!shippingInfo.address.trim()) errors.address = "Street address is required"
    if (!shippingInfo.city.trim()) errors.city = "City is required"
    if (!shippingInfo.state) errors.state = "Please select a state"
    if (!shippingInfo.pincode.trim()) {
      errors.pincode = "PIN code is required"
    } else if (!/^\d{6}$/.test(shippingInfo.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit PIN code"
    }

    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (validateShipping()) {
      setStep("payment")
    }
  }

  /* ═══════ PAYMENT ═══════ */
  const handlePayment = async () => {
    try {
      setIsProcessing(true)

      const data = await createPaymentOrder({
        amount: total,
        shippingAddress: shippingInfo,
      })

      if (!data.success) throw new Error("Order creation failed")

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Beast Rise Up",
        description: "Streetwear Purchase",
        order_id: data.order.id,

        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.payment._id,
            })

            window.location.href = `/checkout/success?order_id=${response.razorpay_order_id}`
          } catch (err) {
            console.error("Payment verification failed", err)
            alert("Payment verification failed. Please contact support.")
            setIsProcessing(false)
          }
        },

        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
          contact: shippingInfo.phone,
          email: shippingInfo.email,
        },

        theme: { color: "#dc2626" },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      console.error("Payment error:", err)
      alert("Payment failed. Try again.")
      setIsProcessing(false)
    }
  }

  /* ═══════ ADD RECOMMENDED TO CART ═══════ */
  const handleAddRecommendedToCart = useCallback(
    (product) => {
      const variant = product?.variants?.[0]
      if (!variant) return

      const size = variant.sizes?.[0]
      const color = variant.colors?.[0]
      if (!size || !color) return

      addToCart({
        product,
        productId: product._id,
        sku: variant.sku,
        size,
        colorName: color.name,
        quantity: 1,
      })
    },
    [addToCart]
  )

  /* ═══════ ANIMATIONS ═══════ */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  /* ═══════ FIELD ERROR ═══════ */
  const FieldError = ({ msg }) =>
    msg ? (
      <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {msg}
      </p>
    ) : null

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 sm:gap-8">
              {[
                { key: "cart", label: "Cart", icon: ShoppingBag },
                { key: "shipping", label: "Shipping", icon: Truck },
                { key: "payment", label: "Payment", icon: CreditCard },
              ].map((s, idx) => {
                const stepOrder = ["cart", "shipping", "payment"]
                const isActive = step === s.key
                const isCompleted = stepOrder.indexOf(step) > idx
                const Icon = s.icon

                return (
                  <div key={s.key} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => {
                          // Allow going back
                          if (stepOrder.indexOf(s.key) < stepOrder.indexOf(step)) {
                            setStep(s.key)
                          }
                        }}
                        disabled={stepOrder.indexOf(s.key) >= stepOrder.indexOf(step)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-gray-900 text-white shadow-lg"
                            : isCompleted
                              ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                              : "bg-gray-100 text-gray-400 cursor-default"
                        }`}
                      >
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </button>
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors ${
                          isActive
                            ? "text-gray-900"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 transition-colors ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          /* ═══════ EMPTY CART ═══════ */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="text-gray-300" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              to="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Start Shopping
              <ChevronRight size={18} />
            </Link>

            {/* Show recommendations even for empty cart */}
            {recommendedProducts.length > 0 && (
              <div className="mt-16 text-left max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Popular Products
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <RecommendedCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddRecommendedToCart}
                      onToggleWishlist={(id) =>
                        wishlist.includes(id)
                          ? removeFromWishlist(id)
                          : addToWishlist(id)
                      }
                      isWishlisted={wishlist.includes(product._id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ═══════ CART WITH ITEMS ═══════ */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Main Content ── */}
            <div className="lg:col-span-2">
              {/* ═══════ STEP: CART ═══════ */}
              {step === "cart" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between mb-6"
                  >
                    <h1 className="text-2xl font-bold text-gray-900">
                      Shopping Cart ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </h1>
                    <Link
                      to="/category/all"
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      <ArrowLeft size={16} />
                      <span className="hidden sm:inline">Continue Shopping</span>
                    </Link>
                  </motion.div>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item, idx) => {
                        const itemImage = getCartItemImage(item)
                        const itemPrice = getCartItemPrice(item)
                        const itemOriginalPrice = getCartItemOriginalPrice(item)
                        const title =
                          item.productSnapshot?.title || "Product"
                        const size = item.productSnapshot?.size || "-"
                        const colorName =
                          item.productSnapshot?.color?.name || "-"

                        return (
                          <motion.div
                            key={`${item.product?._id || idx}-${item.productSnapshot?.variant?.sku}-${size}-${colorName}`}
                            variants={itemVariants}
                            layout
                            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                            className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200"
                          >
                            <div className="flex gap-4">
                              {/* Image */}
                              <Link
                                to={`/product/${item.product?._id}`}
                                className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                              >
                                <img
                                  src={itemImage}
                                  alt={title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </Link>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between gap-2">
                                  <Link
                                    to={`/product/${item.product?._id}`}
                                    className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-red-600 transition-colors"
                                  >
                                    {title}
                                  </Link>
                                  <button
                                    onClick={() =>
                                      removeFromCart({
                                        productId: item.product?._id,
                                        sku: item.productSnapshot?.variant?.sku,
                                        size,
                                        colorName,
                                      })
                                    }
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-gray-500">
                                    Size: {size}
                                  </p>
                                  <span className="text-gray-300">|</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm text-gray-500">
                                      Color: {colorName}
                                    </span>
                                    {item.productSnapshot?.color?.hexCode && (
                                      <div
                                        className="w-3.5 h-3.5 rounded-full border border-gray-300"
                                        style={{
                                          backgroundColor:
                                            item.productSnapshot.color.hexCode,
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                                    <button
                                      onClick={() =>
                                        updateQuantity({
                                          productId: item.product?._id,
                                          sku: item.productSnapshot?.variant?.sku,
                                          size,
                                          colorName,
                                          quantity: Math.max(
                                            1,
                                            item.quantity - 1
                                          ),
                                        })
                                      }
                                      disabled={item.quantity <= 1}
                                      className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center font-semibold text-sm">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity({
                                          productId: item.product?._id,
                                          sku: item.productSnapshot?.variant?.sku,
                                          size,
                                          colorName,
                                          quantity: item.quantity + 1,
                                        })
                                      }
                                      className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>

                                  {/* Price */}
                                  <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                      ₹
                                      {(
                                        itemPrice * item.quantity
                                      ).toLocaleString()}
                                    </p>
                                    {itemOriginalPrice && (
                                      <p className="text-sm text-gray-400 line-through">
                                        ₹
                                        {(
                                          itemOriginalPrice * item.quantity
                                        ).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Coupon Section */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-6 bg-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={18} className="text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        Apply Coupon
                      </span>
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Check size={18} className="text-green-600" />
                          <span className="font-semibold text-green-700">
                            {appliedCoupon}
                          </span>
                          <span className="text-green-600 text-sm">
                            – ₹{couponDiscount.toLocaleString()} off
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setCouponError("")
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              applyCoupon()
                            }
                          }}
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApplyingCoupon ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {couponError}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Try: BEAST20 for 20% off or FIRST100 for ₹100 off
                    </p>
                  </motion.div>

                  {/* ═══════ YOU MAY ALSO LIKE (dynamic) ═══════ */}
                  {recommendedProducts.length > 0 && (
                    <motion.div variants={itemVariants} className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          You May Also Like
                        </h2>
                        <Link
                          to="/category/all"
                          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          View All <ChevronRight size={16} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recommendedProducts.map((product) => (
                          <RecommendedCard
                            key={product._id}
                            product={product}
                            onAddToCart={handleAddRecommendedToCart}
                            onToggleWishlist={(id) =>
                              wishlist.includes(id)
                                ? removeFromWishlist(id)
                                : addToWishlist(id)
                            }
                            isWishlisted={wishlist.includes(product._id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ═══════ STEP: SHIPPING ═══════ */}
              {step === "shipping" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 mb-6"
                  >
                    <button
                      onClick={() => setStep("cart")}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Shipping Information
                    </h1>
                  </motion.div>

                  <motion.form
                    variants={itemVariants}
                    onSubmit={handleShippingSubmit}
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.firstName}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                firstName: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                firstName: undefined,
                              }))
                            }}
                            placeholder="John"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.firstName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.firstName} />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.lastName}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                lastName: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                lastName: undefined,
                              }))
                            }}
                            placeholder="Doe"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.lastName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.lastName} />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                email: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                email: undefined,
                              }))
                            }}
                            placeholder="john@example.com"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.email} />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                phone: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                phone: undefined,
                              }))
                            }}
                            placeholder="+91 98765 43210"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.phone
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <Phone
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.phone} />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                address: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                address: undefined,
                              }))
                            }}
                            placeholder="123 Main Street"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.address
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <Home
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.address} />
                      </div>

                      {/* Apartment */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Apartment, suite, etc. (optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.apartment}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                apartment: e.target.value,
                              })
                            }
                            placeholder="Apt 4B"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                          />
                          <Building
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => {
                              setShippingInfo({
                                ...shippingInfo,
                                city: e.target.value,
                              })
                              setShippingErrors((se) => ({
                                ...se,
                                city: undefined,
                              }))
                            }}
                            placeholder="Mumbai"
                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              shippingErrors.city
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                            }`}
                          />
                          <MapPin
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <FieldError msg={shippingErrors.city} />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) => {
                            setShippingInfo({
                              ...shippingInfo,
                              state: e.target.value,
                            })
                            setShippingErrors((se) => ({
                              ...se,
                              state: undefined,
                            }))
                          }}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                            shippingErrors.state
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                              : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                          }`}
                        >
                          <option value="">Select State</option>
                          {[
                            "Andhra Pradesh",
                            "Arunachal Pradesh",
                            "Assam",
                            "Bihar",
                            "Chhattisgarh",
                            "Delhi",
                            "Goa",
                            "Gujarat",
                            "Haryana",
                            "Himachal Pradesh",
                            "Jharkhand",
                            "Karnataka",
                            "Kerala",
                            "Madhya Pradesh",
                            "Maharashtra",
                            "Manipur",
                            "Meghalaya",
                            "Mizoram",
                            "Nagaland",
                            "Odisha",
                            "Punjab",
                            "Rajasthan",
                            "Sikkim",
                            "Tamil Nadu",
                            "Telangana",
                            "Tripura",
                            "Uttar Pradesh",
                            "Uttarakhand",
                            "West Bengal",
                          ].map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <FieldError msg={shippingErrors.state} />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={shippingInfo.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "")
                            setShippingInfo({
                              ...shippingInfo,
                              pincode: val,
                            })
                            setShippingErrors((se) => ({
                              ...se,
                              pincode: undefined,
                            }))
                          }}
                          placeholder="400001"
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            shippingErrors.pincode
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                              : "border-gray-200 focus:border-red-500 focus:ring-red-500/10"
                          }`}
                        />
                        <FieldError msg={shippingErrors.pincode} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Continue to Payment
                      <ChevronRight size={18} />
                    </button>
                  </motion.form>
                </motion.div>
              )}

              {/* ═══════ STEP: PAYMENT ═══════ */}
              {step === "payment" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 mb-6"
                  >
                    <button
                      onClick={() => setStep("shipping")}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
                  </motion.div>

                  {/* Shipping Address Summary */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Shipping Address
                      </h3>
                      <button
                        onClick={() => setStep("shipping")}
                        className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="font-medium text-gray-900">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p>{shippingInfo.address}</p>
                      {shippingInfo.apartment && (
                        <p>{shippingInfo.apartment}</p>
                      )}
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} –{" "}
                        {shippingInfo.pincode}
                      </p>
                      <p>{shippingInfo.phone}</p>
                      <p className="text-gray-400">{shippingInfo.email}</p>
                    </div>
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Pay with Razorpay
                        </h3>
                        <p className="text-sm text-gray-500">
                          UPI, Cards, Wallets, Net Banking
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {["UPI", "Cards", "Wallets", "Net Banking"].map(
                        (method) => (
                          <span
                            key={method}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
                          >
                            {method}
                          </span>
                        )
                      )}
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ₹{total.toLocaleString()}
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                      <Shield size={14} />
                      <span>
                        Secured by Razorpay | 256-bit SSL Encryption
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* ═══════ ORDER SUMMARY SIDEBAR ═══════ */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Items Preview */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => {
                    const itemImage = getCartItemImage(item)
                    const itemPrice = getCartItemPrice(item)
                    const title =
                      item.productSnapshot?.title || "Product"
                    const size = item.productSnapshot?.size || "-"
                    const colorName =
                      item.productSnapshot?.color?.name || ""

                    return (
                      <div
                        key={`summary-${item.product?._id || idx}-${item.productSnapshot?.variant?.sku}-${size}`}
                        className="flex gap-3"
                      >
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={itemImage}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {size}
                            {colorName ? ` · ${colorName}` : ""} · Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 shrink-0">
                          ₹{(itemPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-green-600 font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Discount ({appliedCoupon})
                      </span>
                      <span className="text-green-600 font-medium">
                        –₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {step === "cart" && (
                  <button
                    onClick={() => setStep("shipping")}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} />
                  </button>
                )}

                {/* Free shipping progress */}
                {shipping > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700 font-medium">
                      Add ₹{(1000 - subtotal).toLocaleString()} more for{" "}
                      <span className="font-bold">FREE shipping!</span>
                    </p>
                    <div className="mt-2 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (subtotal / 2000) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  {[
                    {
                      icon: Truck,
                      text: "Free shipping on orders above ₹2,000",
                    },
                    { icon: Shield, text: "100% Secure Payment" },
                    { icon: Tag, text: "Easy 7-day returns" },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-gray-500"
                    >
                      <badge.icon size={16} className="text-gray-400 shrink-0" />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutPage