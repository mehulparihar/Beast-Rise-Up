"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  Plus,
  Search,
  Pencil,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  AlertCircle,
  Check,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetAllProducts,
  adminUpdateProduct,
  toggleFeaturedProduct,
} from "../../api/product.api"

/* ──────────────────────── constants ──────────────────────── */

const predefinedColors = [
  { name: "Black", hexCode: "#000000" },
  { name: "White", hexCode: "#FFFFFF" },
  { name: "Red", hexCode: "#EF4444" },
  { name: "Blue", hexCode: "#3B82F6" },
  { name: "Navy", hexCode: "#1E3A5F" },
  { name: "Green", hexCode: "#22C55E" },
  { name: "Yellow", hexCode: "#EAB308" },
  { name: "Orange", hexCode: "#F97316" },
  { name: "Purple", hexCode: "#A855F7" },
  { name: "Pink", hexCode: "#EC4899" },
  { name: "Gray", hexCode: "#6B7280" },
  { name: "Brown", hexCode: "#92400E" },
  { name: "Beige", hexCode: "#D4C5A9" },
  { name: "Maroon", hexCode: "#7F1D1D" },
  { name: "Teal", hexCode: "#14B8A6" },
  { name: "Olive", hexCode: "#65A30D" },
  { name: "Charcoal", hexCode: "#374151" },
  { name: "Coral", hexCode: "#FB7185" },
  { name: "Sky Blue", hexCode: "#38BDF8" },
  { name: "Lavender", hexCode: "#C4B5FD" },
]

const categories = ["Hoodies", "T-Shirts", "Pants", "Shoes", "Accessories"]

const subCategoryOptions = [
  { label: "T-Shirts", value: "t-shirts" },
  { label: "Hoodies", value: "hoodies" },
  { label: "Sweatshirts", value: "sweatshirts" },
  { label: "Pants", value: "pants" },
  { label: "Shorts", value: "shorts" },
  { label: "Jackets", value: "jackets" },
  { label: "Tanks", value: "tanks" },
  { label: "Leggings", value: "leggings" },
  { label: "Sports Bras", value: "sports-bras" },
  { label: "Hats", value: "hats" },
  { label: "Bags", value: "bags" },
  { label: "Caps", value: "caps" },
  { label: "Socks", value: "socks" },
  { label: "Belts", value: "belts" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Watches", value: "watches" },
  { label: "Sneakers", value: "sneakers" },
  { label: "Boots", value: "boots" },
  { label: "Slides", value: "slides" },
]

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package, active: true },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
]

/* ──────────────────────── helpers ──────────────────────── */

let _variantCounter = 0
const emptyVariant = () => ({
  id: `new-${Date.now()}-${++_variantCounter}`,
  sku: "",
  price: "",
  discountedPrice: "",
  sizes: [],
  colors: [],
  stockBySizeColor: [],
})

const emptyProduct = () => ({
  id: `new-${Date.now()}`,
  title: "",
  slug: "",
  description: "",
  category: "",
  subCategory: "",
  brand: "",
  variants: [emptyVariant()],
  tags: [],
  defaultImage: "",
  features: [],
  details: { material: "", fit: "", care: "", origin: "" },
  isActive: true,
})

const getSubCategoryLabel = (value) => {
  if (!value) return "-"
  const found = subCategoryOptions.find((sc) => sc.value === value)
  return found ? found.label : value
}

/* ──────────────────────── component ──────────────────────── */

export default function ProductsManagement() {
  /* sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* data */
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [subCategoryFilter, setSubCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  /* modals */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  /* pagination / dropdowns */
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const itemsPerPage = 8

  /* form */
  const [formData, setFormData] = useState(emptyProduct())
  const [imageFiles, setImageFiles] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  /* color picker */
  const [colorPickerOpen, setColorPickerOpen] = useState(null)
  const [customColorName, setCustomColorName] = useState("")
  const [customColorHex, setCustomColorHex] = useState("#000000")
  const colorPickerRef = useRef(null)

  /* ──── close all dropdowns helper ──── */
  const closeAllDropdowns = (except) => {
    if (except !== "category") setCategoryDropdownOpen(false)
    if (except !== "subCategory") setSubCategoryDropdownOpen(false)
    if (except !== "status") setStatusDropdownOpen(false)
  }

  /* ──── close color picker on outside click ──── */
  useEffect(() => {
    const handler = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setColorPickerOpen(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ──── load products ──── */
  useEffect(() => {
    ;(async () => {
      const res = await adminGetAllProducts()
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.products)
          ? res.products
          : Array.isArray(res?.data)
            ? res.data
            : []
      setProducts(list)
    })()
  }, [])

  /* ──── derived helpers ──── */
  const priceRange = (p) => {
    const prices = (p.variants || [])
      .map((v) =>
        v.price !== "" && v.price !== null && v.price !== undefined
          ? Number(v.price)
          : null,
      )
      .filter((x) => x !== null && x > 0)
    if (!prices.length) return "-"
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max
      ? `₹${min.toFixed(2)}`
      : `₹${min.toFixed(2)} – ₹${max.toFixed(2)}`
  }

  const totalStock = (p) =>
    (p.variants || []).reduce(
      (sum, v) =>
        sum +
        (v.stockBySizeColor || []).reduce(
          (s2, r) => s2 + (Number(r.stock) || 0),
          0,
        ),
      0,
    )

  const getStatusLabel = (p) => (p.isActive ? "Active" : "Inactive")

  const getProductImage = (product) => {
    const img = product?.variants?.[0]?.colors?.[0]?.images?.[0]
    if (!img) return "/placeholder.svg"
    if (typeof img === "string") return img
    return img.url || img.secure_url || "/placeholder.svg"
  }

  /* ──── filtering / pagination ──── */
  const filtered = products.filter((prod) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      prod.title?.toLowerCase().includes(q) ||
      prod.brand?.toLowerCase().includes(q)
    const matchesCategory =
      categoryFilter === "all" || prod.category === categoryFilter
    const matchesSubCategory =
      subCategoryFilter === "all" || prod.subCategory === subCategoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (prod.isActive ? "Active" : "Inactive") === statusFilter
    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, subCategoryFilter, statusFilter])

  /* ═══════════════ VALIDATION ═══════════════ */

  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) errors.title = "Product title is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.category) errors.category = "Please select a category"

    if (!formData.variants || formData.variants.length === 0) {
      errors.variants = "At least one variant is required"
    } else {
      const variantErrors = []
      formData.variants.forEach((v, i) => {
        const vErr = {}
        if (
          v.price === "" ||
          v.price === null ||
          v.price === undefined ||
          Number(v.price) <= 0
        ) {
          vErr.price = "Price is required and must be greater than 0"
        }
        if (
          v.discountedPrice !== "" &&
          v.discountedPrice !== null &&
          v.discountedPrice !== undefined &&
          Number(v.discountedPrice) >= Number(v.price)
        ) {
          vErr.discountedPrice = "Discounted price must be less than price"
        }
        if (!v.sizes || v.sizes.length === 0) {
          vErr.sizes = "Add at least one size"
        }
        if (!v.colors || v.colors.length === 0) {
          vErr.colors = "Add at least one color"
        }
        if (Object.keys(vErr).length) variantErrors[i] = vErr
      })
      if (variantErrors.some(Boolean)) errors.variantDetails = variantErrors
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /* ═══════════════ CRUD ═══════════════ */

  const resetForm = () => {
    setFormData(emptyProduct())
    setImageFiles({})
    setFormErrors({})
    setFormSubmitted(false)
    setSelectedProduct(null)
    setColorPickerOpen(null)
    setCustomColorName("")
    setCustomColorHex("#000000")
  }

  const openAdd = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEdit = (prod) => {
    resetForm()
    setSelectedProduct(prod)
    setFormData(JSON.parse(JSON.stringify(prod)))
    setIsEditModalOpen(true)
  }

  const closeModal = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    resetForm()
  }

  const saveNewProduct = async () => {
    setFormSubmitted(true)
    if (!validateForm()) return

    try {
      const res = await adminCreateProduct(formData, imageFiles)
      const saved = { ...res, id: res._id || res.id }
      setProducts((p) => [saved, ...p])
      closeModal()
    } catch {
      alert("Failed to create product")
    }
  }

  const saveEditedProduct = async () => {
    setFormSubmitted(true)
    if (!validateForm()) return
    if (!selectedProduct) return

    try {
      const res = await adminUpdateProduct(
        selectedProduct._id,
        formData,
        imageFiles,
      )
      const updated = { ...res, id: res._id || res.id }
      setProducts((p) =>
        p.map((x) => (x._id === selectedProduct._id ? updated : x)),
      )
      closeModal()
    } catch {
      alert("Failed to update product")
    }
  }

  const confirmDelete = (prod) => {
    setSelectedProduct(prod)
    setIsDeleteDialogOpen(true)
  }

  const doDelete = async () => {
    if (!selectedProduct) return
    try {
      await adminDeleteProduct(selectedProduct._id)
      setProducts((p) => p.filter((x) => x._id !== selectedProduct._id))
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch {
      alert("Failed to delete product")
    }
  }

  const toggleFeatured = async (product) => {
    const nextValue = !product.isFeatured
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, isFeatured: nextValue } : p,
      ),
    )
    try {
      await toggleFeaturedProduct(product._id)
    } catch {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, isFeatured: product.isFeatured }
            : p,
        ),
      )
      alert("Failed to update featured status")
    }
  }

  /* ═══════════════ VARIANT HELPERS ═══════════════ */

  const addVariant = () =>
    setFormData((f) => ({
      ...f,
      variants: [...(f.variants || []), emptyVariant()],
    }))

  const removeVariant = (variantId) =>
    setFormData((f) => ({
      ...f,
      variants: (f.variants || []).filter((v) => v.id !== variantId),
    }))

  const updateVariant = (variantId, patch) =>
    setFormData((f) => ({
      ...f,
      variants: (f.variants || []).map((v) =>
        v.id === variantId ? { ...v, ...patch } : v,
      ),
    }))

  const addColorToVariant = (variantId, color) =>
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId
          ? { ...v, colors: [...(v.colors || []), color] }
          : v,
      ),
    }))

  const removeColorFromVariant = (variantId, colorIndex) =>
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              colors: (v.colors || []).filter((_, i) => i !== colorIndex),
            }
          : v,
      ),
    }))

  const addStockRow = (variantId, row) =>
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              stockBySizeColor: [...(v.stockBySizeColor || []), row],
            }
          : v,
      ),
    }))

  const removeStockRow = (variantId, rowIndex) =>
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              stockBySizeColor: (v.stockBySizeColor || []).filter(
                (_, i) => i !== rowIndex,
              ),
            }
          : v,
      ),
    }))

  const removeExistingImage = (variantId, colorIndex, imgIndex) =>
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) => {
        if (v.id !== variantId) return v
        const colors = (v.colors || []).map((col, ci) => {
          if (ci !== colorIndex) return col
          const imgs = Array.isArray(col.images) ? [...col.images] : []
          imgs.splice(imgIndex, 1)
          return { ...col, images: imgs }
        })
        return { ...v, colors }
      }),
    }))

  const removeLocalFile = (fieldName) => {
    setImageFiles((prev) => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
    setFormData((f) => ({
      ...f,
      variants: (f.variants || []).map((v) => ({
        ...v,
        colors: (v.colors || []).map((col) => {
          if (!Array.isArray(col.imageFields)) return col
          return {
            ...col,
            imageFields: col.imageFields.filter((fn) => fn !== fieldName),
          }
        }),
      })),
    }))
  }

  /* ═══════════════ tiny error label ═══════════════ */

  const FieldError = ({ msg }) =>
    msg ? (
      <p className="flex items-center gap-1 mt-1 text-xs text-red-400">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {msg}
      </p>
    ) : null

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* ── sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="font-black text-lg">B</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">BEAST</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  link.active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
                <img
                  src="/admin-avatar.png"
                  alt="Admin"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">
                  admin@beastrise.com
                </p>
              </div>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── overlay for mobile sidebar ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── main ── */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Products</h1>
                <p className="text-sm text-gray-500">
                  Manage products with variants
                </p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ── filters ── */}
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-3 flex-wrap">
              {/* search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* category dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns("category")
                    setCategoryDropdownOpen(!categoryDropdownOpen)
                  }}
                  className="w-full sm:w-[160px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm truncate">
                    {categoryFilter === "all"
                      ? "All Categories"
                      : categoryFilter}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setCategoryFilter("all")
                        setCategoryDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                        categoryFilter === "all" ? "text-red-400" : ""
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat)
                          setCategoryDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                          categoryFilter === cat ? "text-red-400" : ""
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ══════ SUB CATEGORY FILTER DROPDOWN ══════ */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns("subCategory")
                    setSubCategoryDropdownOpen(!subCategoryDropdownOpen)
                  }}
                  className="w-full sm:w-[160px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm truncate">
                    {subCategoryFilter === "all"
                      ? "All Types"
                      : getSubCategoryLabel(subCategoryFilter)}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${
                      subCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {subCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSubCategoryFilter("all")
                        setSubCategoryDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                        subCategoryFilter === "all" ? "text-red-400" : ""
                      }`}
                    >
                      All Types
                    </button>
                    {subCategoryOptions.map((sc) => (
                      <button
                        key={sc.value}
                        onClick={() => {
                          setSubCategoryFilter(sc.value)
                          setSubCategoryDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                          subCategoryFilter === sc.value ? "text-red-400" : ""
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* status dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns("status")
                    setStatusDropdownOpen(!statusDropdownOpen)
                  }}
                  className="w-full sm:w-[140px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">
                    {statusFilter === "all" ? "All Status" : statusFilter}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${
                      statusDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                    {["all", "Active", "Inactive"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s)
                          setStatusDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                          statusFilter === s ? "text-red-400" : ""
                        }`}
                      >
                        {s === "all" ? "All Status" : s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* active filter count */}
              {(categoryFilter !== "all" ||
                subCategoryFilter !== "all" ||
                statusFilter !== "all" ||
                searchQuery.trim()) && (
                <button
                  onClick={() => {
                    setCategoryFilter("all")
                    setSubCategoryFilter("all")
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ── table ── */}
          <div className="bg-[#111111] border border-white/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      "Product",
                      "Category",
                      "Type",
                      "Brand",
                      "Variants",
                      "Price",
                      "Stock",
                      "Status",
                      "Featured",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`p-4 text-sm font-medium text-gray-500 whitespace-nowrap ${
                          h === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-12 text-center">
                          <div className="text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No products found</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Try adjusting your filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((product) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getProductImage(product)}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover bg-white/5"
                              />
                              <div className="min-w-0">
                                <p className="font-medium truncate max-w-[200px]">
                                  {product.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                  {product.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400">
                            {product.category || "-"}
                          </td>
                          {/* ══════ SUB CATEGORY COLUMN ══════ */}
                          <td className="p-4">
                            {product.subCategory ? (
                              <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-blue-500/15 text-blue-400 whitespace-nowrap">
                                {getSubCategoryLabel(product.subCategory)}
                              </span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-400">
                            {product.brand || "-"}
                          </td>
                          <td className="p-4 text-gray-400">
                            {(product.variants || []).length}
                          </td>
                          <td className="p-4 font-medium">
                            {priceRange(product)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`${
                                totalStock(product) === 0
                                  ? "text-red-400"
                                  : totalStock(product) < 10
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                              }`}
                            >
                              {totalStock(product)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                product.isActive
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {getStatusLabel(product)}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleFeatured(product)}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                product.isFeatured
                                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                  : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                              }`}
                            >
                              {product.isFeatured ? "Featured" : "Normal"}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(product)}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDelete(product)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filtered.length,
                  )}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
                  {filtered.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => {
                    // Show max 5 page buttons with ellipsis
                    const page = i + 1
                    if (
                      totalPages <= 7 ||
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-red-600 hover:bg-red-700"
                              : "border border-white/20 bg-transparent hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="text-gray-500 text-sm px-1"
                        >
                          …
                        </span>
                      )
                    }
                    return null
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════ */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">
                {isAddModalOpen ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* global error banner */}
            {formSubmitted && Object.keys(formErrors).length > 0 && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  Please fix the highlighted errors below before saving.
                </div>
              </div>
            )}

            {/* body */}
            <div className="p-6 space-y-5">
              {/* row 1 – title, slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      if (formSubmitted)
                        setFormErrors((fe) => ({
                          ...fe,
                          title: undefined,
                        }))
                    }}
                    placeholder="e.g. Urban Streetwear Hoodie"
                    className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                      formErrors.title
                        ? "border-red-500"
                        : "border-white/10 focus:border-red-500"
                    }`}
                  />
                  <FieldError msg={formErrors.title} />
                </div>
                <div>
                  <label className="text-sm text-gray-400">
                    Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData({ ...formData, slug: e.target.value })
                      if (formSubmitted)
                        setFormErrors((fe) => ({
                          ...fe,
                          slug: undefined,
                        }))
                    }}
                    placeholder="urban-streetwear-hoodie"
                    className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                      formErrors.slug
                        ? "border-red-500"
                        : "border-white/10 focus:border-red-500"
                    }`}
                  />
                  <FieldError msg={formErrors.slug} />
                </div>
              </div>

              {/* row 2 – category, subCategory, brand (3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="text-sm text-gray-400">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                      if (formSubmitted)
                        setFormErrors((fe) => ({
                          ...fe,
                          category: undefined,
                        }))
                    }}
                    className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white focus:outline-none appearance-none transition-colors ${
                      formErrors.category
                        ? "border-red-500"
                        : "border-white/10 focus:border-red-500"
                    }`}
                  >
                    <option className="bg-[#1a1a1a]" value="">
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="bg-[#1a1a1a] text-white"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                  <FieldError msg={formErrors.category} />
                </div>

                {/* ══════ SUB CATEGORY FORM FIELD ══════ */}
                <div>
                  <label className="text-sm text-gray-400">
                    Sub Category / Type
                  </label>
                  <select
                    value={formData.subCategory || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategory: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 appearance-none transition-colors"
                  >
                    <option className="bg-[#1a1a1a]" value="">
                      Select type (optional)
                    </option>
                    {subCategoryOptions.map((sc) => (
                      <option
                        key={sc.value}
                        value={sc.value}
                        className="bg-[#1a1a1a] text-white"
                      >
                        {sc.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Used for filtering on the shop page
                  </p>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm text-gray-400">Brand</label>
                  <input
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="e.g. Beast"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* default image */}
              <div>
                <label className="text-sm text-gray-400">Default Image</label>
                <div className="flex items-center gap-3 mt-1">
                  <img
                    src={formData.defaultImage || "/placeholder.svg"}
                    className="w-24 h-24 rounded-lg object-cover bg-white/5"
                    alt=""
                  />
                  <div className="space-y-2 flex-1">
                    <input
                      placeholder="Image URL"
                      value={formData.defaultImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultImage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer text-sm">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setFormData((f) => ({
                            ...f,
                            defaultImage: URL.createObjectURL(file),
                          }))
                          setImageFiles((prev) => ({
                            ...prev,
                            defaultImage: file,
                          }))
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* description */}
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Product description…"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              {/* ══════════ VARIANTS ══════════ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Variants <span className="text-red-400">*</span>
                  </h3>
                  <button
                    onClick={addVariant}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Variant
                  </button>
                </div>

                <FieldError msg={formErrors.variants} />

                {(formData.variants || []).map((v, vIndex) => {
                  const vErr =
                    formErrors.variantDetails?.[vIndex] || {}

                  return (
                    <div
                      key={v._id || v.id}
                      className={`bg-[#0b0b0b] border rounded-xl p-4 space-y-4 ${
                        Object.keys(vErr).length
                          ? "border-red-500/40"
                          : "border-white/5"
                      }`}
                    >
                      {/* variant header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          Variant {vIndex + 1}
                        </span>
                        {(formData.variants || []).length > 1 && (
                          <button
                            onClick={() => removeVariant(v.id)}
                            className="text-red-400 hover:text-red-500 text-xs transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* sku / price / discounted */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">
                            SKU
                          </label>
                          <input
                            placeholder="e.g. HOOD-BLK-001"
                            value={v.sku}
                            onChange={(e) =>
                              updateVariant(v.id, {
                                sku: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Price (₹){" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter price"
                            value={v.price}
                            onChange={(e) => {
                              const raw = e.target.value
                              updateVariant(v.id, {
                                price: raw === "" ? "" : Number(raw),
                              })
                              if (formSubmitted) {
                                setFormErrors((fe) => {
                                  const next = { ...fe }
                                  if (next.variantDetails?.[vIndex])
                                    delete next.variantDetails[vIndex]
                                      .price
                                  return next
                                })
                              }
                            }}
                            className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                              vErr.price
                                ? "border-red-500"
                                : "border-white/10 focus:border-red-500"
                            }`}
                          />
                          <FieldError msg={vErr.price} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Discounted Price (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Optional"
                            value={v.discountedPrice}
                            onChange={(e) => {
                              const raw = e.target.value
                              updateVariant(v.id, {
                                discountedPrice:
                                  raw === "" ? "" : Number(raw),
                              })
                            }}
                            className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                              vErr.discountedPrice
                                ? "border-red-500"
                                : "border-white/10 focus:border-red-500"
                            }`}
                          />
                          <FieldError msg={vErr.discountedPrice} />
                        </div>
                      </div>

                      {/* sizes */}
                      <div>
                        <label className="text-xs text-gray-500">
                          Sizes <span className="text-red-400">*</span>{" "}
                          <span className="text-gray-600">
                            (comma separated)
                          </span>
                        </label>
                        <input
                          defaultValue={(v.sizes || []).join(", ")}
                          placeholder="S, M, L, XL, XXL"
                          onBlur={(e) => {
                            const sizes = e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                            updateVariant(v.id, { sizes })
                            if (formSubmitted && sizes.length) {
                              setFormErrors((fe) => {
                                const next = { ...fe }
                                if (next.variantDetails?.[vIndex])
                                  delete next.variantDetails[vIndex].sizes
                                return next
                              })
                            }
                          }}
                          className={`w-full px-3 py-2 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                            vErr.sizes
                              ? "border-red-500"
                              : "border-white/10 focus:border-red-500"
                          }`}
                        />
                        <FieldError msg={vErr.sizes} />
                        {(v.sizes || []).length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {v.sizes.map((size, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ══════ COLORS ══════ */}
                      <div>
                        <label className="text-xs text-gray-500">
                          Colors <span className="text-red-400">*</span>
                        </label>
                        <FieldError msg={vErr.colors} />

                        <div className="space-y-3 mt-2">
                          {(v.colors || []).map((c, cIndex) => (
                            <div
                              key={cIndex}
                              className="bg-white/[0.03] border border-white/10 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0"
                                    style={{
                                      backgroundColor:
                                        c.hexCode || "#666",
                                    }}
                                  />
                                  <span className="text-sm font-medium">
                                    {c.name}
                                  </span>
                                  <span className="text-[11px] text-gray-500 font-mono">
                                    {c.hexCode}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    removeColorFromVariant(
                                      v.id,
                                      cIndex,
                                    )
                                  }
                                  className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex gap-2 items-center flex-wrap">
                                {(c.images || []).map(
                                  (img, imgIdx) => {
                                    const src =
                                      typeof img === "string"
                                        ? img
                                        : img?.url ||
                                          img?.secure_url ||
                                          img
                                    return (
                                      <div
                                        key={imgIdx}
                                        className="relative group"
                                      >
                                        <img
                                          src={src}
                                          className="w-14 h-14 rounded-lg object-cover bg-white/5"
                                          alt=""
                                        />
                                        <button
                                          onClick={() =>
                                            removeExistingImage(
                                              v.id,
                                              cIndex,
                                              imgIdx,
                                            )
                                          }
                                          className="absolute -top-1.5 -right-1.5 bg-black/80 border border-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3 text-red-400" />
                                        </button>
                                      </div>
                                    )
                                  },
                                )}

                                {Object.entries(imageFiles)
                                  .filter(([field]) =>
                                    field.startsWith(
                                      `v${v.id}_c${cIndex}_`,
                                    ),
                                  )
                                  .map(([field, file]) => {
                                    const previewUrl =
                                      URL.createObjectURL(file)
                                    return (
                                      <div
                                        key={field}
                                        className="relative group"
                                      >
                                        <img
                                          src={previewUrl}
                                          className="w-14 h-14 rounded-lg object-cover bg-white/5"
                                          alt=""
                                        />
                                        <button
                                          onClick={() =>
                                            removeLocalFile(field)
                                          }
                                          className="absolute -top-1.5 -right-1.5 bg-black/80 border border-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3 text-red-400" />
                                        </button>
                                      </div>
                                    )
                                  })}

                                <label className="w-14 h-14 rounded-lg border-2 border-dashed border-white/10 hover:border-white/30 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                  <Upload className="w-4 h-4 text-gray-500" />
                                  <span className="text-[9px] text-gray-500 mt-0.5">
                                    Add
                                  </span>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                      const files = Array.from(
                                        e.target.files,
                                      )
                                      if (!files.length) return
                                      const fieldNames = files.map(
                                        (_, i) =>
                                          `v${v.id}_c${cIndex}_img${Date.now()}_${i}`,
                                      )
                                      updateVariant(v.id, {
                                        colors: v.colors.map(
                                          (col, ci) =>
                                            ci === cIndex
                                              ? {
                                                  ...col,
                                                  imageFields: [
                                                    ...(col.imageFields ||
                                                      []),
                                                    ...fieldNames,
                                                  ],
                                                }
                                              : col,
                                        ),
                                      })
                                      setImageFiles((prev) => {
                                        const next = { ...prev }
                                        fieldNames.forEach(
                                          (f, i) => {
                                            next[f] = files[i]
                                          },
                                        )
                                        return next
                                      })
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* color picker */}
                        <div
                          className="relative mt-2"
                          ref={
                            colorPickerOpen === v.id
                              ? colorPickerRef
                              : undefined
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setColorPickerOpen(
                                colorPickerOpen === v.id
                                  ? null
                                  : v.id,
                              )
                            }
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed text-sm transition-colors ${
                              vErr.colors
                                ? "border-red-500/60 text-red-400"
                                : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                            }`}
                          >
                            <Plus className="w-3 h-3" /> Add Color
                          </button>

                          {colorPickerOpen === v.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute z-40 top-full left-0 mt-2 w-[340px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl"
                            >
                              <div className="p-4">
                                <p className="text-xs font-medium text-gray-400 mb-3">
                                  Select a Color
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                  {predefinedColors.map((pc) => {
                                    const alreadyAdded = (
                                      v.colors || []
                                    ).some(
                                      (c) =>
                                        c.name.toLowerCase() ===
                                        pc.name.toLowerCase(),
                                    )
                                    return (
                                      <button
                                        key={pc.name}
                                        type="button"
                                        disabled={alreadyAdded}
                                        onClick={() => {
                                          addColorToVariant(v.id, {
                                            name: pc.name,
                                            hexCode: pc.hexCode,
                                            images: [],
                                          })
                                          setColorPickerOpen(null)
                                          if (formSubmitted) {
                                            setFormErrors((fe) => {
                                              const next = {
                                                ...fe,
                                              }
                                              if (
                                                next
                                                  .variantDetails?.[
                                                  vIndex
                                                ]
                                              )
                                                delete next
                                                  .variantDetails[
                                                  vIndex
                                                ].colors
                                              return next
                                            })
                                          }
                                        }}
                                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                                          alreadyAdded
                                            ? "opacity-25 cursor-not-allowed"
                                            : "hover:bg-white/5 cursor-pointer"
                                        }`}
                                        title={
                                          alreadyAdded
                                            ? "Already added"
                                            : pc.name
                                        }
                                      >
                                        <div className="relative">
                                          <div
                                            className="w-8 h-8 rounded-full border-2 border-white/20"
                                            style={{
                                              backgroundColor:
                                                pc.hexCode,
                                            }}
                                          />
                                          {alreadyAdded && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <Check className="w-4 h-4 text-white drop-shadow-lg" />
                                            </div>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 leading-none">
                                          {pc.name}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              <div className="border-t border-white/10 p-4">
                                <p className="text-xs font-medium text-gray-400 mb-2">
                                  Custom Color
                                </p>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={customColorHex}
                                    onChange={(e) =>
                                      setCustomColorHex(
                                        e.target.value,
                                      )
                                    }
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10 p-0.5"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Color name"
                                    value={customColorName}
                                    onChange={(e) =>
                                      setCustomColorName(
                                        e.target.value,
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault()
                                        if (
                                          !customColorName.trim()
                                        )
                                          return
                                        addColorToVariant(v.id, {
                                          name: customColorName.trim(),
                                          hexCode: customColorHex,
                                          images: [],
                                        })
                                        setCustomColorName("")
                                        setCustomColorHex(
                                          "#000000",
                                        )
                                        setColorPickerOpen(null)
                                      }
                                    }}
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!customColorName.trim())
                                        return
                                      addColorToVariant(v.id, {
                                        name: customColorName.trim(),
                                        hexCode: customColorHex,
                                        images: [],
                                      })
                                      setCustomColorName("")
                                      setCustomColorHex("#000000")
                                      setColorPickerOpen(null)
                                      if (formSubmitted) {
                                        setFormErrors((fe) => {
                                          const next = { ...fe }
                                          if (
                                            next
                                              .variantDetails?.[
                                              vIndex
                                            ]
                                          )
                                            delete next
                                              .variantDetails[
                                              vIndex
                                            ].colors
                                          return next
                                        })
                                      }
                                    }}
                                    disabled={
                                      !customColorName.trim()
                                    }
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* stock rows */}
                      <div>
                        <label className="text-xs text-gray-500">
                          Stock by Size &amp; Color
                        </label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <input
                            placeholder="Size"
                            id={`stock-size-${v.id}`}
                            className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500"
                          />
                          <input
                            placeholder="Color name"
                            id={`stock-color-${v.id}`}
                            className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500"
                          />
                          <div className="flex gap-2">
                            <input
                              placeholder="Qty"
                              type="number"
                              min="0"
                              id={`stock-qty-${v.id}`}
                              className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const sizeEl =
                                  document.getElementById(
                                    `stock-size-${v.id}`,
                                  )
                                const colorEl =
                                  document.getElementById(
                                    `stock-color-${v.id}`,
                                  )
                                const qtyEl =
                                  document.getElementById(
                                    `stock-qty-${v.id}`,
                                  )
                                const size = sizeEl.value.trim()
                                const colorName =
                                  colorEl.value.trim()
                                const stock = Number(
                                  qtyEl.value || 0,
                                )
                                if (!size || !colorName) return
                                addStockRow(v.id, {
                                  size,
                                  colorName,
                                  stock,
                                })
                                sizeEl.value = ""
                                colorEl.value = ""
                                qtyEl.value = ""
                              }}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-sm shrink-0 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {(v.stockBySizeColor || []).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {v.stockBySizeColor.map((r, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 px-3 py-2 bg-white/5 rounded-lg"
                              >
                                <div className="text-sm text-gray-300">
                                  {r.size} · {r.colorName}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium">
                                    {r.stock}
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeStockRow(v.id, i)
                                    }
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* tags & features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">
                    Tags{" "}
                    <span className="text-gray-600">
                      (comma separated, blur to add)
                    </span>
                  </label>
                  <input
                    defaultValue=""
                    placeholder="streetwear, urban, hoodie"
                    onBlur={(e) => {
                      const raw = e.target.value.trim()
                      if (!raw) return
                      setFormData((f) => ({
                        ...f,
                        tags: [
                          ...(f.tags || []),
                          ...raw
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        ],
                      }))
                      e.target.value = ""
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  />
                  {(formData.tags || []).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.tags.map((t, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-sm"
                        >
                          {t}
                          <button
                            onClick={() =>
                              setFormData((f) => ({
                                ...f,
                                tags: f.tags.filter(
                                  (_, idx) => idx !== i,
                                ),
                              }))
                            }
                            className="text-gray-500 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Features{" "}
                    <span className="text-gray-600">
                      (press Enter to add)
                    </span>
                  </label>
                  <input
                    placeholder="e.g. Breathable fabric"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const val = e.target.value.trim()
                        if (!val) return
                        setFormData((f) => ({
                          ...f,
                          features: [...(f.features || []), val],
                        }))
                        e.target.value = ""
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  />
                  {(formData.features || []).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.features.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-sm"
                        >
                          {f}
                          <button
                            onClick={() =>
                              setFormData((fd) => ({
                                ...fd,
                                features: fd.features.filter(
                                  (_, idx) => idx !== i,
                                ),
                              }))
                            }
                            className="text-gray-500 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={
                  isAddModalOpen ? saveNewProduct : saveEditedProduct
                }
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {isAddModalOpen ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ DELETE DIALOG ═══════════════ */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Delete Product</h2>
              <p className="text-gray-400">
                Are you sure you want to delete &quot;
                {selectedProduct?.title}&quot;? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedProduct(null)
                }}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}