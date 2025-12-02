import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hexCode: String,
  images: [String], // cloudinary urls
});

const variantSchema = new mongoose.Schema({
  sku: String,
  sizes: [String], // e.g. ["S","M","L"]
  colors: [colorSchema],
  price: Number,
  discountedPrice: Number,
  stockBySizeColor: [
    {
      size: String,
      colorName: String,
      stock: { type: Number, default: 0 },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    category: { type: String, index: true },
    subCategory: { type: String, index: true },
    brand: String,
    variants: [variantSchema], // multiple variants possible
    tags: [String],
    defaultImage: String,
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// text index for search on title + description + tags + brand
productSchema.index({ title: "text", description: "text", tags: "text", brand: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;