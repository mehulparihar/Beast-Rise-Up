import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (err) {
    console.error("Create Coupon Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      coupons,
    });
  } catch (err) {
    console.error("Get Coupons Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Coupon deleted",
    });
  } catch (err) {
    console.error("Delete Coupon Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon" });
    }

    if (coupon.expiry < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum amount required is ₹${coupon.minAmount}`,
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // Discount Calculation
    let discount =
      coupon.discountType === "percentage"
        ? (totalAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    // Apply max cap
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return res.json({
      success: true,
      coupon,
      discount,
      finalAmount: totalAmount - discount,
    });
  } catch (err) {
    console.error("Validate Coupon Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
