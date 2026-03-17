"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Pencil,
  Trash2,
  IndianRupee,
  Plus,
  X,
  ChevronDown,
} from "lucide-react"
import { Link } from "react-router-dom"
import { analytics } from "../../api/analytics.api"
import useAuthStore from "../../stores/useAuthStore"
import api from "../../api/axios"
import { deleteCustomer, getAllCustomers, getCustomersOrderAgg, updateCustomer } from "../../api/auth.api"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users, active: true },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
]

// interface CustomerOrder {
//   id: string
//   date: string
//   total: number
//   status: "Completed" | "Processing" | "Shipped" | "Cancelled"
//   items: number
// }

// interface Customer {
//   id: string
//   name: string
//   email: string
//   phone: string
//   avatar: string
//   status: "Active" | "Inactive" | "VIP"
//   address: {
//     street: string
//     city: string
//     state: string
//     zip: string
//     country: string
//   }
//   totalOrders: number
//   totalSpent: number
//   joinedAt: string
//   lastOrderAt: string
//   orders: CustomerOrder[]
// }

const initialCustomers = [
  {
    id: "1",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/marcus-chen.jpg",
    status: "VIP",
    address: {
      street: "123 Main Street, Apt 4B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
    },
    totalOrders: 15,
    totalSpent: 2450.0,
    joinedAt: "2023-06-15",
    lastOrderAt: "2024-01-15",
    orders: [
      { id: "ORD-7352", date: "2024-01-15", total: 307.0, status: "Completed", items: 3 },
      { id: "ORD-7290", date: "2024-01-02", total: 159.0, status: "Completed", items: 1 },
      { id: "ORD-7180", date: "2023-12-20", total: 245.0, status: "Completed", items: 2 },
    ],
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "/sarah-wilson-portrait.png",
    status: "Active",
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    totalOrders: 8,
    totalSpent: 892.0,
    joinedAt: "2023-09-20",
    lastOrderAt: "2024-01-16",
    orders: [
      { id: "ORD-7351", date: "2024-01-16", total: 147.0, status: "Processing", items: 3 },
      { id: "ORD-7200", date: "2023-12-28", total: 89.0, status: "Completed", items: 1 },
    ],
  },
  {
    id: "3",
    name: "James Rodriguez",
    email: "james.r@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "/james-rodriguez.jpg",
    status: "Active",
    address: {
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    totalOrders: 5,
    totalSpent: 567.0,
    joinedAt: "2023-11-05",
    lastOrderAt: "2024-01-14",
    orders: [{ id: "ORD-7350", date: "2024-01-14", total: 159.0, status: "Shipped", items: 3 }],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "/emily-davis.jpg",
    status: "Active",
    address: {
      street: "321 Elm Street",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "United States",
    },
    totalOrders: 3,
    totalSpent: 318.0,
    joinedAt: "2023-12-10",
    lastOrderAt: "2024-01-17",
    orders: [{ id: "ORD-7349", date: "2024-01-17", total: 159.0, status: "Processing", items: 1 }],
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.b@email.com",
    phone: "+1 (555) 567-8901",
    avatar: "/michael-brown.jpg",
    status: "Inactive",
    address: {
      street: "654 Maple Drive",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "United States",
    },
    totalOrders: 2,
    totalSpent: 378.0,
    joinedAt: "2023-10-25",
    lastOrderAt: "2024-01-13",
    orders: [{ id: "ORD-7348", date: "2024-01-13", total: 378.0, status: "Cancelled", items: 2 }],
  },
  {
    id: "6",
    name: "Jessica Lee",
    email: "jessica.lee@email.com",
    phone: "+1 (555) 678-9012",
    avatar: "/jessica-lee.jpg",
    status: "VIP",
    address: {
      street: "987 Cedar Lane",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "United States",
    },
    totalOrders: 22,
    totalSpent: 3890.0,
    joinedAt: "2023-03-10",
    lastOrderAt: "2024-01-10",
    orders: [
      { id: "ORD-7347", date: "2024-01-10", total: 133.0, status: "Completed", items: 3 },
      { id: "ORD-7300", date: "2024-01-05", total: 249.0, status: "Completed", items: 1 },
      { id: "ORD-7250", date: "2023-12-22", total: 456.0, status: "Completed", items: 4 },
    ],
  },
]

const CustomersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [formStatusDropdownOpen, setFormStatusDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5
  const { user, fetchProfile } = useAuthStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  })
  const { signup } = useAuthStore();

  // normalize backend user -> UI shape
  const normalize = (u, ordersAggMap = {}) => {
    const stats = ordersAggMap[u._id] || { totalOrders: 0, totalSpent: 0 }
    const defaultAddr = (u.addresses || []).find(a => a.isDefault) || u.addresses?.[0] || null

    return {
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || "-",
      status: stats.totalSpent >= 5000 ? "VIP" : stats.totalOrders > 0 ? "Active" : "Inactive",
      avatar: u.avatar || "",
      address: {
        street: defaultAddr?.addressLine1 || "-",
        city: defaultAddr?.city || "-",
        state: defaultAddr?.state || "-",
        zip: defaultAddr?.pincode || "-",
        country: defaultAddr?.country || "India",
      },
      totalOrders: stats.totalOrders,
      totalSpent: stats.totalSpent,
      joinedAt: u.createdAt,
      orders: [], // will be filled when fetching details
    }
  }

  // const fetchCustomers = async () => {
  //   try {
  //     setLoading(true)
  //     // 1) get users (customer list)
  //     const usersRes = await api.get("auth/admin/customers") // backend: returns array of users
  //     const users = usersRes.data.customers || usersRes.data || []

  //     // 2) aggregate orders stats for these users (server may already return totals; if not, fetch)
  //     // try to use endpoint that already returns totals; if not, fallback to server-side aggregation
  //     // Here we assume API returns totals embedded; if not, call /admin/customers-with-stats or do separate call.
  //     const ordersAggRes = await api.post("/admin/customers/orders-agg", { userIds: users.map(u => u._id) })
  //     const ordersAgg = ordersAggRes.data || []
  //     const ordersMap = {}
  //     ordersAgg.forEach(o => { ordersMap[o._id] = { totalOrders: o.totalOrders || 0, totalSpent: o.totalSpent || 0 } })

  //     const normalized = users.map(u => normalize(u, ordersMap))
  //     setCustomers(normalized)
  //   } catch (err) {
  //     console.error("fetchCustomers error:", err)
  //     // fallback: if API doesn't provide ordersAgg endpoint, map users without stats
  //     try {
  //       const usersRes = await api.get("/admin/customers")
  //       setCustomers((usersRes.data.customers || usersRes.data || []).map(u => normalize(u)))
  //     } catch (e) { console.error(e) }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchCustomers()
  // }, [])

  useEffect(() => {
    const loadCustomers = async () => {
      const { customers } = await getAllCustomers();

      const agg = await getCustomersOrderAgg({
        userIds: customers.map(c => c._id),
      });

      const aggMap = {};
      agg.forEach(a => {
        aggMap[a._id] = a;
      });

      const merged = customers.map(c => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: "Active", // map later if needed
        address: c.addresses?.[0]
          ? {
            street: c.addresses[0].addressLine1,
            city: c.addresses[0].city,
            state: c.addresses[0].state,
            zip: c.addresses[0].pincode,
            country: c.addresses[0].country,
          }
          : {},
        totalOrders: aggMap[c._id]?.totalOrders || 0,
        totalSpent: aggMap[c._id]?.totalSpent || 0,
        joinedAt: c.createdAt,
        orders: [],
      }));

      setCustomers(merged);
    };

    loadCustomers();
  }, []);


  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400"
      case "Inactive":
        return "bg-gray-500/20 text-gray-400"
      case "VIP":
        return "bg-yellow-500/20 text-yellow-400"
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400"
      case "Processing":
        return "bg-blue-500/20 text-blue-400"
      case "Shipped":
        return "bg-purple-500/20 text-purple-400"
      case "Cancelled":
        return "bg-red-500/20 text-red-400"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer)
    setActiveTab("details")
    setIsDetailModalOpen(true)
  }

  const openEditModal = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      street: customer.address.street,
      city: customer.address.city,
      state: customer.address.state,
      zip: customer.address.zip,
      country: customer.address.country,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleAddCustomer = async () => {
    try {
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: "Temp@123456", // admin-created
        phone: formData.phone,
      });
     
      setCustomers(prev => [
        {
          id: res._id,
          name: res.name,
          email: res.email,
          phone: res.phone,
          status: "Active",
          address: {},
          totalOrders: 0,
          totalSpent: 0,
          joinedAt: res.createdAt,
          orders: [],
        },
        ...prev,
      ]);

      setIsAddModalOpen(false);
      resetForm();
    } catch (e) {
      alert("Failed to create customer");
    }
  }

  const handleEditCustomer = async () => {

    try {
      await updateCustomer(selectedCustomer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedCustomer.id
            ? { ...c, ...formData }
            : c
        )
      );

      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      resetForm()
    } catch {
      alert("Update failed");
    }
  }

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomer.id);
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch {
      alert("Delete failed");
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "Active").length
  const vipCustomers = customers.filter((c) => c.status === "VIP").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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
                <h1 className="text-xl font-bold">Customers</h1>
                <p className="text-sm text-gray-500">Manage your customer base</p>
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
              Add Customer
            </button>
          </div>
        </header>

        {/* Customers Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Customers", value: totalCustomers, icon: Users, color: "text-white" },
              { label: "Active", value: activeCustomers, icon: Users, color: "text-green-400" },
              { label: "VIP Members", value: vipCustomers, icon: Users, color: "text-yellow-400" },
              {
                label: "Total Revenue",
                value: `₹${totalRevenue.toLocaleString()}`,
                icon: IndianRupee,
                color: "text-red-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111111] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-gray-500" />
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
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
                    {["Active", "Inactive", "VIP"].map((status) => (
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

          {/* Customers Table */}
          <div className="bg-[#111111] border border-white/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Orders</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Total Spent</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Joined</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedCustomers.map((customer) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-medium">
                              {customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{customer.totalOrders}</td>
                        <td className="p-4 font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                        <td className="p-4 text-gray-400 text-sm">{formatDate(customer.joinedAt)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => viewCustomerDetails(customer)}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(customer)}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteDialog(customer)}
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
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
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
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
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

      {/* Customer Details Modal */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setSelectedCustomer(null)
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "details" ? "text-white border-b-2 border-red-500" : "text-gray-400 hover:text-white"
                  }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "orders" ? "text-white border-b-2 border-red-500" : "text-gray-400 hover:text-white"
                  }`}
              >
                Orders ({selectedCustomer.orders.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === "details" ? (
                <div className="space-y-6">
                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold">
                      {selectedCustomer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCustomer.status)}`}
                      >
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <ShoppingBag className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <p className="text-xl font-bold">{selectedCustomer.totalOrders}</p>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <IndianRupee className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <p className="text-xl font-bold">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Spent</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <p className="text-xl font-bold">{formatDate(selectedCustomer.joinedAt)}</p>
                      <p className="text-xs text-gray-500">Joined</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        {selectedCustomer.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        {selectedCustomer.phone}
                      </div>
                      <div className="flex items-start gap-2 text-gray-400">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <div>
                          <p>{selectedCustomer.address.street}</p>
                          <p>
                            {selectedCustomer.address.city}, {selectedCustomer.address.state}{" "}
                            {selectedCustomer.address.zip}
                          </p>
                          <p>{selectedCustomer.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCustomer.orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No orders yet</p>
                  ) : (
                    selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="font-medium">#{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.date)} · {order.items} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${getOrderStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{isAddModalOpen ? "Add New Customer" : "Edit Customer"}</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedCustomer(null)
                  resetForm()
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
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
                        {(["Active", "Inactive", "VIP"]).map((status) => (
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
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Street Address</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Enter street address"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="ZIP"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedCustomer(null)
                  resetForm()
                }}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={isAddModalOpen ? handleAddCustomer : handleEditCustomer}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {isAddModalOpen ? "Add Customer" : "Save Changes"}
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
              <h2 className="text-xl font-bold mb-2">Delete Customer</h2>
              <p className="text-gray-400">
                Are you sure you want to delete "{selectedCustomer?.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedCustomer(null)
                }}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
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

export default CustomersManagement