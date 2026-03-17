import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();

    const getDateRange = (days) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    /* -------------------- KPIs -------------------- */

    // Total Revenue (paid orders only)
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "CANCELLED" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Customers
    const totalCustomers = await User.countDocuments({ role: "customer" });

    /* -------------------- Revenue Overview -------------------- */

    const revenueOverview = async (days) =>
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: getDateRange(days) },
            status: { $ne: "CANCELLED" },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

    const revenue7Days = await revenueOverview(7);
    const revenue30Days = await revenueOverview(30);
    const revenue90Days = await revenueOverview(90);

    /* -------------------- Sales by Category -------------------- */

    const salesByCategory = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.productSnapshot.variant.discountedPrice",
              ],
            },
          },
        },
      },
      { $project: { _id: 0, category: "$_id", revenue: 1 } },
    ]);

    /* -------------------- Recent Orders -------------------- */

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("totalAmount status createdAt");

    /* -------------------- Top Products -------------------- */

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          unitsSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.productSnapshot.variant.discountedPrice",
              ],
            },
          },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          name: "$product.title",
          unitsSold: 1,
          revenue: 1,
        },
      },
    ]);

    /* -------------------- Top Customers -------------------- */

    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          email: "$user.email",
          orders: 1,
          totalSpent: 1,
          joined: "$user.createdAt",
        },
      },
    ]);

    /* -------------------- RESPONSE -------------------- */

    res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          pageViews: null, // plug GA / analytics later
        },

        revenueOverview: {
          days7: revenue7Days,
          days30: revenue30Days,
          days90: revenue90Days,
        },

        salesByCategory,
        recentOrders,
        topProducts,
        topCustomers,
      },
    });
  } catch (err) {
    console.error("Dashboard Analytics Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
