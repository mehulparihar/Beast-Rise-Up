"use client"

import React, { useState, useMemo, useEffect } from "react"
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
} from "lucide-react"
import { Link } from "react-router-dom"
import { adminCreateProduct, adminDeleteProduct, adminGetAllProducts, adminUpdateProduct, toggleFeaturedProduct } from "../../api/product.api"

// --- Helpers / model shapes ---
const emptyVariant = () => ({
  id: Date.now().toString(),
  sku: "",
  price: 0,
  discountedPrice: null,
  sizes: [],
  colors: [], // { name, hexCode, images: [] }
  stockBySizeColor: [], // { size, colorName, stock }
})

const emptyProduct = () => ({
  id: Date.now().toString(),
  title: "",
  slug: "",
  description: "",
  category: "",
  subCategory: "",
  brand: "",
  variants: [emptyVariant()],
  tags: [],
  defaultImage: "/placeholder.svg",
  features: [],
  details: { material: "", fit: "", care: "", origin: "" },
  isActive: true,
})

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package, active: true },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
]

const categories = ["Hoodies", "T-Shirts", "Pants", "Shoes", "Accessories"]

export default function ProductsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [imageFiles, setImageFiles] = useState({})

  const itemsPerPage = 8

  const [formData, setFormData] = useState(emptyProduct())

  // --- Derived helpers ---
  const priceRange = (p) => {
    const prices = (p.variants || []).map((v) => (v.price ? Number(v.price) : null)).filter(Boolean)
    if (!prices.length) return "-"
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₹${min.toFixed(2)}` : `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`
  }

  const totalStock = (p) => {
    return (p.variants || []).reduce((sum, v) => {
      const s = (v.stockBySizeColor || []).reduce((s2, r) => s2 + (Number(r.stock) || 0), 0)
      return sum + s
    }, 0)
  }

  useEffect(() => {
    const load = async () => {
      const res = await adminGetAllProducts()

      // 🔒 HARD GUARANTEE: products is always an array
      const list =
        Array.isArray(res) ? res :
          Array.isArray(res?.products) ? res.products :
            Array.isArray(res?.data) ? res.data :
              []

      setProducts(list)
    }

    load()


  }, []);



  // --- Filtering / pagination ---
  const filtered = products.filter((prod) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = !q || prod.title.toLowerCase().includes(q) || prod.brand?.toLowerCase().includes(q)
    const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter
    const matchesStatus = statusFilter === "all" || (prod.isActive ? "Active" : "Inactive") === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // --- CRUD handlers (local state) ---
  const openAdd = () => {
    setFormData(emptyProduct())
    setIsAddModalOpen(true)
  }

  const openEdit = (prod) => {
    // deep clone minimal
    setSelectedProduct(prod)
    setFormData(JSON.parse(JSON.stringify(prod)))
    setIsEditModalOpen(true)
  }

  const getProductImage = (product) => {
  // 1. explicit default image
  // if (product?.defaultImage) return product.defaultImage;

  // 2. first variant → first color → first image
  const img = product?.variants?.[0]?.colors?.[0]?.images?.[0];
  if (!img) return "/placeholder.svg";

  // support string or cloudinary object
  if (typeof img === "string") return img;
  return img.url || img.secure_url || "/placeholder.svg";
};

  const saveNewProduct = async () => {
    try {
      const res = await adminCreateProduct(formData, imageFiles)

      const saved = {
        ...res,
        id: res._id || res.id,
      }

      // optimistic insert
      setProducts(p => [saved, ...p])

      setIsAddModalOpen(false)
      setFormData(emptyProduct())
      setImageFiles({})
    } catch (e) {
      alert("Failed to create product")
    }

  }

  const toggleFeatured = async (product) => {
    const nextValue = !product.isFeatured

    // Optimistic UI update
    setProducts(prev =>
      prev.map(p =>
        p._id === product._id ? { ...p, isFeatured: nextValue } : p
      )
    )

    try {
      await toggleFeaturedProduct(product._id)
    } catch (e) {
      // rollback on failure
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, isFeatured: product.isFeatured } : p
        )
      )
      alert("Failed to update featured status")
    }
  }

  // remove an existing image (Cloudinary url / object) from a color locally
  const removeExistingImage = (variantId, colorIndex, imgIndex) => {
    setFormData(f => ({
      ...f,
      variants: f.variants.map(v => {
        if (v.id !== variantId) return v
        const colors = (v.colors || []).map((col, ci) => {
          if (ci !== colorIndex) return col
          const imgs = Array.isArray(col.images) ? [...col.images] : []
          imgs.splice(imgIndex, 1)
          return { ...col, images: imgs }
        })
        return { ...v, colors }
      })
    }))
  }

  // remove local (not uploaded yet) file by its fieldName
  const removeLocalFile = (fieldName) => {
    setImageFiles(prev => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })

    // also remove imageFields reference from the color(s) (so it won't be sent)
    setFormData(f => ({
      ...f,
      variants: (f.variants || []).map(v => ({
        ...v,
        colors: (v.colors || []).map(col => {
          if (!Array.isArray(col.imageFields)) return col
          const filteredFields = col.imageFields.filter(fn => fn !== fieldName)
          return { ...col, imageFields: filteredFields }
        })
      }))
    }))
  }

  const saveEditedProduct = async () => {
    if (!selectedProduct) return

    try {
      const res = await adminUpdateProduct(selectedProduct._id, formData, imageFiles)

      const updated = {
        ...res,
        id: res._id || res.id,
      }

      setProducts(p =>
        p.map(x => (x._id === selectedProduct._id ? updated : x))
      )

      setIsEditModalOpen(false)
      setSelectedProduct(null)
    } catch (e) {
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

      // optimistic remove
      setProducts(p => p.filter(x => x._id !== selectedProduct._id))

      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (e) {
      alert("Failed to delete product")
    }
  }

  // --- Variant helpers ---
  const addVariant = () => {
    setFormData((f) => ({ ...f, variants: [...(f.variants || []), emptyVariant()] }))
  }

  const removeVariant = (variantId) => {
    setFormData((f) => ({ ...f, variants: (f.variants || []).filter((v) => v.id !== variantId) }))
  }

  const updateVariant = (variantId, patch) => {
    setFormData((f) => ({
      ...f,
      variants: (f.variants || []).map((v) => (v.id === variantId ? { ...v, ...patch } : v)),
    }))
  }

  // sizes, colors, stock rows
  const addSizeToVariant = (variantId, size) => {
    if (!size) return
    updateVariant(variantId, (v) => {
      // handled below simpler: patch with sizes
    })
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId && !v.sizes.includes(size) ? { ...v, sizes: [...v.sizes, size] } : v,
      ),
    }))
  }

  const removeSizeFromVariant = (variantId, size) => {
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) => (v.id === variantId ? { ...v, sizes: v.sizes.filter((s) => s !== size) } : v)),
    }))
  }

  const addColorToVariant = (variantId, color) => {
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.id === variantId ? { ...v, colors: [...(v.colors || []), color] } : v,
      ),
    }))
  }

  const addStockRow = (variantId, row) => {
    setFormData((f) => ({
      ...f,
      variants: f.variants.map((v) => (v.id === variantId ? { ...v, stockBySizeColor: [...(v.stockBySizeColor || []), row] } : v)),
    }))
  }

  // tags, features helpers
  const addTag = (tag) => {
    if (!tag) return
    setFormData((f) => ({ ...f, tags: [...(f.tags || []), tag] }))
  }

  const removeTag = (tag) => setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const addFeature = (feat) => {
    if (!feat) return
    setFormData((f) => ({ ...f, features: [...(f.features || []), feat] }))
  }

  const removeFeature = (feat) => setFormData((f) => ({ ...f, features: f.features.filter((x) => x !== feat) }))

  // --- small UI bits ---
  const getStatusLabel = (p) => (p.isActive ? "Active" : "Inactive")

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar omitted for brevity, reuse your previous sidebar markup */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${link.active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                <img src="/admin-avatar.png" alt="Admin" width={40} height={40} className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@beastrise.com</p>
              </div>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

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
                <p className="text-sm text-gray-500">Manage products with variants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full sm:w-[180px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setCategoryFilter("all")
                        setCategoryDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
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
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full sm:w-[150px] flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setStatusFilter("all")
                        setStatusDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                    >
                      All Status
                    </button>
                    {[
                      "Active",
                      "Inactive",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status)
                          setStatusDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Brand</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Variants</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Featured</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={getProductImage(product) || "/placeholder.svg"} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                            <div>
                              <p className="font-medium">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400">{product.category}</td>
                        <td className="p-4 text-gray-400">{product.brand || "-"}</td>
                        <td className="p-4 text-gray-400">{(product.variants || []).length}</td>
                        <td className="p-4 font-medium">{priceRange(product)}</td>
                        <td className="p-4">{totalStock(product)}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                            {getStatusLabel(product)}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleFeatured(product)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${product.isFeatured
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                              }`}
                          >
                            {product.isFeatured ? "Featured" : "Normal"}
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => confirmDelete(product)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-red-600 hover:bg-red-700" : "border border-white/20 bg-transparent hover:bg-white/10"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal (shared) */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{isAddModalOpen ? "Add New Product" : "Edit Product"}</h2>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setSelectedProduct(null); setFormData(emptyProduct()); }} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Slug</label>
                  <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Brand</label>
                  <input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Default image</label>
                <div className="flex items-center gap-3">
                  <img src={formData.defaultImage || "/placeholder.svg"} className="w-24 h-24 rounded-lg object-cover bg-white/5" />
                  <div>
                    <input placeholder="image url" value={formData.defaultImage} onChange={(e) => setFormData({ ...formData, defaultImage: e.target.value })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                    <label className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded border border-white/20 hover:bg-white/5 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files)

                          const fieldNames = files.map((_, i) => `v${vIndex}_c${cIndex}_img${i}`)

                          // save mapping for backend
                          updateVariant(v.id, {
                            colors: v.colors.map((c, ci) =>
                              ci === cIndex
                                ? { ...c, imageFields: fieldNames }
                                : c
                            )
                          })

                          // store actual files
                          setImageFiles(prev => {
                            const next = { ...prev }
                            fieldNames.forEach((f, i) => {
                              next[f] = files[i]
                            })
                            return next
                          })
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
              </div>

              {/* Variants manager */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Variants</h3>
                  <button onClick={addVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-600 hover:bg-red-700">Add Variant</button>
                </div>

                {(formData.variants || []).map((v, idx) => (
                  <div key={v._id || v.id} className="bg-[#0b0b0b] border border-white/5 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                          <input type="number" placeholder="Price" value={v.price} onChange={(e) => updateVariant(v.id, { price: Number(e.target.value) })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                          <input type="number" placeholder="Discounted Price" value={v.discountedPrice || ""} onChange={(e) => updateVariant(v.id, { discountedPrice: e.target.value ? Number(e.target.value) : null })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                        </div>

                        {/* sizes */}
                        <div className="mt-3">
                          <label className="text-sm text-gray-400">Sizes (comma separated)</label>
                          <input value={(v.sizes || []).join(",")} onChange={(e) => updateVariant(v.id, { sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                        </div>

                        {/* colors */}
                        <div className="mt-3">
                          <label className="text-sm text-gray-400">Colors (name|hex comma separated) example: Red|#ff0000,Black|#000</label>
                          <input defaultValue="" onBlur={(e) => {
                            const raw = e.target.value.trim()
                            if (!raw) return
                            const colors = raw.split(",").map(c => {
                              const [name, hex] = c.split("|").map(x => x?.trim())
                              return { name: name || "", hexCode: hex || "", images: [] }
                            })
                            updateVariant(v.id, { colors })
                            e.target.value = ""
                          }} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(v.colors || []).map((c, cIndex) => (
                              <div key={cIndex} className="flex items-center gap-2 mt-2">
                                <div className="px-2 py-1 bg-white/5 rounded text-sm">
                                  {c.name} {c.hexCode ? `(${c.hexCode})` : ""}
                                </div>

                                {/* existing images from backend (could be array of strings or objects) */}
                                <div className="flex gap-2 items-center">
                                  {(c.images || []).map((img, imgIdx) => {
                                    // support { url, public_id } or string
                                    const src = typeof img === "string" ? img : img?.url || img?.secure_url || img
                                    return (
                                      <div key={imgIdx} className="relative">
                                        <img src={src} className="w-12 h-12 rounded object-cover bg-white/5" />
                                        <button
                                          onClick={() => removeExistingImage(v.id, cIndex, imgIdx)}
                                          className="absolute -top-2 -right-2 bg-black/60 rounded-full p-1 text-xs"
                                          title="Remove image"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    )
                                  })}

                                  {/* local previews for files not uploaded yet (imageFiles) */}
                                  {Object.entries(imageFiles)
                                    .filter(([field]) => field.startsWith(`v${v.id}_c${cIndex}_`))
                                    .map(([field, file]) => {
                                      const previewUrl = URL.createObjectURL(file)
                                      return (
                                        <div key={field} className="relative">
                                          <img src={previewUrl} className="w-12 h-12 rounded object-cover bg-white/5" />
                                          <button
                                            onClick={() => removeLocalFile(field)}
                                            className="absolute -top-2 -right-2 bg-black/60 rounded-full p-1 text-xs"
                                            title="Remove (local)"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      )
                                    })}
                                </div>

                                {/* upload input for this color */}
                                <label className="inline-flex items-center gap-2 px-2 py-1 rounded border border-white/20 hover:bg-white/5 cursor-pointer text-xs ml-2">
                                  <Upload className="w-3 h-3" />
                                  Images
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files)
                                      if (!files.length) return

                                      // create unique field names using variant id (v.id) and color index
                                      const fieldNames = files.map((_, i) => `v${v.id}_c${cIndex}_img${Date.now()}_${i}`)

                                      // attach imageFields to this color object
                                      updateVariant(v.id, {
                                        colors: v.colors.map((col, ci) =>
                                          ci === cIndex ? { ...col, imageFields: [...(col.imageFields || []), ...fieldNames] } : col
                                        ),
                                      })

                                      // store File objects in imageFiles state
                                      setImageFiles(prev => {
                                        const next = { ...prev }
                                        fieldNames.forEach((f, i) => {
                                          next[f] = files[i]
                                        })
                                        return next
                                      })
                                    }}
                                  />
                                </label>
                              </div>

                            ))}
                          </div>
                        </div>

                        {/* stock rows */}
                        <div className="mt-3">
                          <label className="text-sm text-gray-400">Stock rows (size, color, stock)</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input placeholder="Size" id={`stock-size-${v.id}`} className="px-2 py-1 bg-white/5 border border-white/10 rounded" />
                            <input placeholder="Color name" id={`stock-color-${v.id}`} className="px-2 py-1 bg-white/5 border border-white/10 rounded" />
                            <div className="flex gap-2">
                              <input placeholder="Stock" type="number" id={`stock-qty-${v.id}`} className="px-2 py-1 bg-white/5 border border-white/10 rounded w-full" />
                              <button onClick={() => {
                                const size = document.getElementById(`stock-size-${v.id}`).value.trim()
                                const colorName = document.getElementById(`stock-color-${v.id}`).value.trim()
                                const stock = Number(document.getElementById(`stock-qty-${v.id}`).value || 0)
                                if (!size || !colorName) return
                                addStockRow(v.id, { size, colorName, stock })
                                document.getElementById(`stock-size-${v.id}`).value = ""
                                document.getElementById(`stock-color-${v.id}`).value = ""
                                document.getElementById(`stock-qty-${v.id}`).value = ""
                              }} className="px-2 py-1 rounded bg-green-600">Add</button>
                            </div>
                          </div>

                          <div className="mt-2">
                            {(v.stockBySizeColor || []).map((r, i) => (
                              <div key={i} className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded mt-2">
                                <div className="text-sm">{r.size} · {r.colorName}</div>
                                <div className="text-sm">{r.stock}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div>
                        <button onClick={() => removeVariant(v.id)} className="text-red-400 hover:text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* tags & features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Tags (comma separated)</label>
                  <input defaultValue="" onBlur={(e) => { const raw = e.target.value.trim(); if (!raw) return; setFormData(f => ({ ...f, tags: [...(f.tags || []), ...raw.split(',').map(t => t.trim()).filter(Boolean)] })); e.target.value = '' }} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                  <div className="flex gap-2 mt-2 flex-wrap">{(formData.tags || []).map((t, i) => (<div key={i} className="px-2 py-1 bg-white/5 rounded">{t}</div>))}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Features (press enter after typing)</label>
                  <input onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = e.target.value.trim(); if (!v) return; setFormData(f => ({ ...f, features: [...(f.features || []), v] })); e.target.value = '' } }} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" />
                  <div className="flex gap-2 mt-2 flex-wrap">{(formData.features || []).map((f, i) => (<div key={i} className="px-2 py-1 bg-white/5 rounded">{f}</div>))}</div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setSelectedProduct(null); setFormData(emptyProduct()); }} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium">Cancel</button>
              <button onClick={isAddModalOpen ? saveNewProduct : saveEditedProduct} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium">{isAddModalOpen ? 'Add Product' : 'Save Changes'}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Delete Product</h2>
              <p className="text-gray-400">Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button onClick={() => { setIsDeleteDialogOpen(false); setSelectedProduct(null); }} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
