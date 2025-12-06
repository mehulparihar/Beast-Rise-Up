"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
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

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package, active: true },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

const categories = ["Hoodies", "T-Shirts", "Pants", "Shoes", "Accessories"]



const initialProducts = [
  {
    id: "1",
    name: "Beast Mode Hoodie",
    category: "Hoodies",
    price: 129.0,
    stock: 45,
    status: "Active",
    image: "/black-hoodie-streetwear.png",
    description: "Premium heavyweight hoodie with Beast Mode print",
    sku: "BM-HOD-001",
  },
  {
    id: "2",
    name: "Rise Up Tee",
    category: "T-Shirts",
    price: 49.0,
    stock: 120,
    status: "Active",
    image: "/black-tshirt-streetwear.jpg",
    description: "Classic fit cotton tee with Rise Up graphic",
    sku: "RU-TEE-001",
  },
  {
    id: "3",
    name: "Urban Joggers",
    category: "Pants",
    price: 89.0,
    stock: 0,
    status: "Out of Stock",
    image: "/black-joggers-streetwear.jpg",
    description: "Comfortable joggers with tapered fit",
    sku: "UJ-PNT-001",
  },
  {
    id: "4",
    name: "Street Cap",
    category: "Accessories",
    price: 35.0,
    stock: 89,
    status: "Active",
    image: "/black-cap-streetwear.jpg",
    description: "Snapback cap with embroidered Beast logo",
    sku: "SC-ACC-001",
  },
  {
    id: "5",
    name: "Beast Sneakers",
    category: "Shoes",
    price: 159.0,
    stock: 23,
    status: "Active",
    image: "/black-sneakers-streetwear.jpg",
    description: "High-top sneakers with premium leather",
    sku: "BS-SHO-001",
  },
  {
    id: "6",
    name: "Limited Edition Jacket",
    category: "Hoodies",
    price: 249.0,
    stock: 5,
    status: "Draft",
    image: "/black-jacket-streetwear.png",
    description: "Exclusive limited edition bomber jacket",
    sku: "LE-JAK-001",
  },
]

const ProductsManagement = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState(initialProducts)
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
  const [formCategoryDropdownOpen, setFormCategoryDropdownOpen] = useState(false)
  const [formStatusDropdownOpen, setFormStatusDropdownOpen] = useState(false)
  const itemsPerPage = 5

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    sku: "",
    image: "/diverse-products-still-life.png",
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active",
      description: "",
      sku: "",
      image: "/diverse-products-still-life.png",
    })
  }

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      status: formData.status,
      description: formData.description,
      sku: formData.sku,
      image: formData.image,
    }
    setProducts([newProduct, ...products])
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditProduct = () => {
    if (!selectedProduct) return
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: formData.name,
            category: formData.category,
            price: Number.parseFloat(formData.price),
            stock: Number.parseInt(formData.stock),
            status: formData.status,
            description: formData.description,
            sku: formData.sku,
            image: formData.image,
          }
        : p,
    )
    setProducts(updatedProducts)
    setIsEditModalOpen(false)
    setSelectedProduct(null)
    resetForm()
  }

  const handleDeleteProduct = () => {
    if (!selectedProduct) return
    setProducts(products.filter((p) => p.id !== selectedProduct.id))
    setIsDeleteDialogOpen(false)
    setSelectedProduct(null)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      description: product.description,
      sku: product.sku,
      image: product.image,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
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
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  link.active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
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

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
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
                <p className="text-sm text-gray-500">Manage your product inventory</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm()
                setIsAddModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        {/* Products Content */}
        <div className="p-6 space-y-6">
          {/* Filters */}
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
              {/* Category Filter Dropdown */}
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
              {/* Status Filter Dropdown */}
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
                    {["Active", "Draft", "Out of Stock"].map((status) => (
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

          {/* Products Table */}
          <div className="bg-[#111111] border border-white/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-white/5"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400">{product.category}</td>
                        <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`${
                              product.stock === 0
                                ? "text-red-400"
                                : product.stock < 10
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.status === "Active"
                                ? "bg-green-500/20 text-green-400"
                                : product.status === "Draft"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteDialog(product)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors"
                            >
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

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? "bg-red-600 hover:bg-red-700"
                        : "border border-white/20 bg-transparent hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{isAddModalOpen ? "Add New Product" : "Edit Product"}</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedProduct(null)
                  resetForm()
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFormCategoryDropdownOpen(!formCategoryDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm">{formData.category || "Select category"}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {formCategoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat })
                              setFormCategoryDropdownOpen(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFormStatusDropdownOpen(!formStatusDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm">{formData.status}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {formStatusDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-20">
                        {(["Active", "Draft", "Out of Stock"]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, status })
                              setFormStatusDropdownOpen(false)
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Product Image</label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Product"
                    className="w-20 h-20 rounded-lg object-cover bg-white/5"
                  />
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedProduct(null)
                  resetForm()
                }}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={isAddModalOpen ? handleAddProduct : handleEditProduct}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {isAddModalOpen ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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
                onClick={handleDeleteProduct}
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

export default ProductsManagement