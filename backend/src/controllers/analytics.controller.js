import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";




export const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Total Sales
    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Orders by Status
    const ordersByStatusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = {};
    ordersByStatusAgg.forEach(item => ordersByStatus[item._id] = item.count);

    // 4. Revenue Over Time (Last 30 days)
    const revenueOverTimeAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: new Date(new Date() - 30*24*60*60*1000) } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" }
      } },
      { $sort: { _id: 1 } }
    ]);

    // 5. Top Selling Products
    const topProductsAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", quantitySold: { $sum: "$items.quantity" } } },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 0, productName: "$product.title", quantitySold: 1 } }
    ]);

    // 6. Top Customers
    const topCustomersAgg = await Order.aggregate([
      { $group: { _id: "$user", totalSpent: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, name: "$user.name", email: "$user.email", totalSpent: 1, orderCount: 1 } }
    ]);

    // 7. Coupon Usage
    const couponUsageAgg = await Order.aggregate([
      { $match: { coupon: { $ne: null } } },
      { $group: { _id: "$coupon", usageCount: { $sum: 1 } } },
      { $lookup: { from: "coupons", localField: "_id", foreignField: "_id", as: "coupon" } },
      { $unwind: "$coupon" },
      { $project: { _id: 0, code: "$coupon.code", usageCount: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        ordersByStatus,
        revenueOverTime: revenueOverTimeAgg,
        topProducts: topProductsAgg,
        topCustomers: topCustomersAgg,
        couponUsage: couponUsageAgg,
      }
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};