import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },

        discountType: {
            type: String,
            enum: ["percentage", "flat"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
        },

        minAmount: {
            type: Number,
            default: 0,
        },

        maxDiscount: {
            type: Number,
            default: null,
        },

        expiry: {
            type: Date,
            required: true,
        },

        usageLimit: {
            type: Number,
            default: null,
        },

        usedCount: {
            type: Number,
            default: 0,
        },

        perUserLimit: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;