"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import useCartStore from "../../stores/useCartStore"
import useAuthStore from "../../stores/useAuthStore"
import { createPaymentOrder, verifyPayment } from "../../api/payment.api"




// Sample cart items
const initialCartItems = [
  {
    id: "1",
    name: "Beast Mode Oversized Tee",
    price: 1499,
    originalPrice: 1999,
    quantity: 2,
    size: "L",
    color: "Black",
    image: "/black-streetwear-oversized-tshirt.jpg",
  },
  {
    id: "2",
    name: "Rise Up Cargo Joggers",
    price: 2499,
    quantity: 1,
    size: "M",
    color: "Olive",
    image: "/olive-cargo-joggers-streetwear.jpg",
  },
  {
    id: "3",
    name: "Flame Logo Hoodie",
    price: 2999,
    originalPrice: 3499,
    quantity: 1,
    size: "XL",
    color: "Red",
    image: "/red-hoodie-streetwear-flames.jpg",
  },
]

const recommendedProducts = [
  {
    id: "r1",
    name: "Street King Snapback",
    price: 999,
    originalPrice: 1299,
    image: "/black-snapback-cap-streetwear.jpg",
  },
  {
    id: "r2",
    name: "Beast Chain Necklace",
    price: 799,
    image: "/gold-chain-necklace-streetwear.jpg",
  },
  {
    id: "r3",
    name: "Rise Up Crew Socks",
    price: 399,
    originalPrice: 499,
    image: "/black-crew-socks-streetwear-pack.jpg",
  },
  {
    id: "r4",
    name: "Flame Logo Belt",
    price: 1199,
    image: "/black-leather-belt-flame-buckle.jpg",
  },
]



const CheckoutPage = () => {
  // const [cartItems, setCartItems] = useState(initialCartItems)
  const [step, setStep] = useState("cart")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
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

  const {
    cart: cartItems,
    loadCart,
    updateQuantity,
    removeFromCart,
  } = useCartStore();


  const { user, fetchProfile } = useAuthStore();

  // const updateQuantity = (id, delta) => {
  //   setCartItems((items) =>
  //     items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
  //   )
  // }

  // const removeItem = (id) => {
  //   setCartItems((items) => items.filter((item) => item.id !== id))
  // }

  useEffect(() => {
    loadCart();
    // fetchProfile();
  }, []);

  console.log(user);

  useEffect(() => {
    if (!user || !user.addresses?.length) return;

    const defaultAddress =
      user.addresses.find(addr => addr.isDefault) || user.addresses[0];

    if (!defaultAddress) return;

    const [firstName = "", lastName = ""] =
      defaultAddress.fullName?.split(" ") || [];

    setShippingInfo(prev => ({
      ...prev,
      firstName,
      lastName,
      phone: defaultAddress.phone || "",
      address: defaultAddress.addressLine1 || "",
      apartment: defaultAddress.addressLine2 || "",
      city: defaultAddress.city || "",
      state: defaultAddress.state || "",
      email: user.email || "",
      pincode: defaultAddress.pincode || "",
    }));
  }, [user]);


  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productSnapshot?.variant?.discountedPrice || 0
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal > 2000 ? 0 : 99
  const discount = couponDiscount
  const total = subtotal + shipping - discount

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setIsApplyingCoupon(true)
    setCouponError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (couponCode.toUpperCase() === "BEAST20") {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponDiscount(Math.round(subtotal * 0.2))
      setCouponCode("")
    } else if (couponCode.toUpperCase() === "FIRST100") {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponDiscount(100)
      setCouponCode("")
    } else {
      setCouponError("Invalid coupon code")
    }

    setIsApplyingCoupon(false)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const data = await createPaymentOrder({
        amount: total,
        shippingAddress: shippingInfo,
      });



      if (!data.success) throw new Error("Order creation failed");

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
            });

            window.location.href =
              `/checkout/success?order_id=${response.razorpay_order_id}`;
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification failed. Please contact support.");
            setIsProcessing(false);
          }

        },

        prefill: {
          name: shippingInfo.firstName + " " + shippingInfo.lastName,
          contact: shippingInfo.phone,
          email: shippingInfo.email,
        },

        theme: {
          color: "#dc2626",
        },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again.");
      setIsProcessing(false);
    }
  }

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
  console.log(cartItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 sm:gap-8">
              {[
                { key: "cart", label: "Cart", icon: ShoppingBag },
                { key: "shipping", label: "Shipping", icon: Truck },
                { key: "payment", label: "Payment", icon: CreditCard },
              ].map((s, idx) => {
                const isActive = step === s.key
                const isCompleted = ["cart", "shipping", "payment"].indexOf(step) > idx
                const Icon = s.icon

                return (
                  <div key={s.key} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isActive
                          ? "bg-gray-900 text-white shadow-lg"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors ${isActive ? "text-gray-900" : isCompleted ? "text-green-600" : "text-gray-400"
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 transition-colors ${isCompleted ? "bg-green-500" : "bg-gray-200"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="text-gray-300" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link
              to="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Start Shopping
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "cart" && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
                    <Link
                      to="/category/all"
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      <ArrowLeft size={16} />
                      <span className="hidden sm:inline">Continue Shopping</span>
                    </Link>
                  </motion.div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item?.productSnapshot.title}
                        variants={itemVariants}
                        layout
                        className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200"
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={item.productSnapshot.defaultImage || "/placeholder.svg"}
                              alt={item.productSnapshot.title}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                                {item.productSnapshot.title}
                              </h3>
                              <button
                                onClick={() => removeFromCart({
                                  productId: item.product._id,
                                  sku: item.productSnapshot.variant.sku,
                                  size: item.productSnapshot.size,
                                  colorName: item.productSnapshot.color.name,
                                })}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Size: {item.productSnapshot.size} | Color: {item.productSnapshot.color.name}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      {
                                        productId: item.product._id,
                                        sku: item.productSnapshot.variant.sku,
                                        size: item.productSnapshot.size,
                                        colorName: item.productSnapshot.color.name,
                                        quantity: Math.max(1, item.quantity - 1),
                                      }
                                    )
                                  }
                                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      {
                                        productId: item.product._id,
                                        sku: item.productSnapshot.variant.sku,
                                        size: item.productSnapshot.size,
                                        colorName: item.productSnapshot.color.name,
                                        quantity: item.quantity + 1,
                                      }
                                    )
                                  }
                                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  ₹{(item.productSnapshot.variant.discountedPrice * item.quantity).toLocaleString()}
                                </p>
                                {item.originalPrice && (
                                  <p className="text-sm text-gray-400 line-through">
                                    ₹{(item.originalPrice * item.quantity).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <motion.div variants={itemVariants} className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={18} className="text-gray-600" />
                      <span className="font-semibold text-gray-900">Apply Coupon</span>
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Check size={18} className="text-green-600" />
                          <span className="font-semibold text-green-700">{appliedCoupon}</span>
                          <span className="text-green-600 text-sm">- ₹{couponDiscount} off</span>
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
                            setCouponCode(e.target.value)
                            setCouponError("")
                          }}
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApplyingCoupon ? <Loader2 size={18} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                    )}
                    {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                    <p className="text-xs text-gray-400 mt-3">Try: BEAST20 for 20% off or FIRST100 for ₹100 off</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">You May Also Like</h2>
                      <Link
                        to="/"
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        View All <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {recommendedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer"
                        >
                          <div className="relative aspect-square bg-gray-100">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                              <Heart size={16} className="text-gray-600" />
                            </button>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button className="w-full mt-3 py-2 bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                              Add to Cart
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === "shipping" && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setStep("cart")}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Shipping Information</h1>
                  </motion.div>

                  <motion.form
                    variants={itemVariants}
                    onSubmit={handleShippingSubmit}
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                            placeholder="John"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                            placeholder="Doe"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            placeholder="123 Main Street"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <Home size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
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
                            onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })}
                            placeholder="Apt 4B"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                          />
                          <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                            placeholder="Mumbai"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                            required
                          />
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                        <input
                          type="text"
                          value={shippingInfo.pincode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                          placeholder="400001"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                          required
                        />
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

              {step === "payment" && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setStep("shipping")}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
                  </motion.div>

                  {/* Shipping Address Summary */}
                  <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Shipping Address</h3>
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
                      {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                      </p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pay with Razorpay</h3>
                        <p className="text-sm text-gray-500">UPI, Cards, Wallets, Net Banking</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {["UPI", "Cards", "Wallets", "Net Banking"].map((method) => (
                        <span
                          key={method}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
                        >
                          {method}
                        </span>
                      ))}
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
                      <span>Secured by Razorpay | 256-bit SSL Encryption</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items Preview */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productSnapshot.title} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.productSnapshot.defaultImage || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.productSnapshot.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.productSnapshot.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(
                          item.productSnapshot.variant.discountedPrice *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900 font-medium"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedCoupon})</span>
                      <span className="text-green-600 font-medium">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-black text-gray-900">₹{total.toLocaleString()}</span>
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

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  {[
                    { icon: Truck, text: "Free shipping on orders above ₹2000" },
                    { icon: Shield, text: "100% Secure Payment" },
                    { icon: Tag, text: "Easy 7-day returns" },
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-500">
                      <badge.icon size={16} className="text-gray-400" />
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