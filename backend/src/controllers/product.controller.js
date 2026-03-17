import redis from "../config/redis.js";
import Product from "../models/product.model.js";
import { uploadBufferToCloudinary, destroyImage, deleteFromCloudinary} from "../services/cloudinaryService.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).lean();
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        console.log("Error in getProductById controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }


        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // store in redis for future quick access

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
  
  try {
    const payload = req.body

    // 🔥 PARSE JSON FIELDS
    payload.variants = payload.variants ? JSON.parse(payload.variants) : []
    payload.tags = payload.tags ? JSON.parse(payload.tags) : []
    payload.features = payload.features ? JSON.parse(payload.features) : []

    if (!payload.slug) {
      payload.slug = slugify(
        payload.title || Date.now().toString(),
        { lower: true, strict: true }
      )
    }

    // Upload files to Cloudinary
    const fileMap = await uploadFiles(
      req.files || [],
      `products/${payload.slug}`
    )

    // Map uploaded images to variants/colors
    if (Array.isArray(payload.variants)) {
      for (const variant of payload.variants) {
        if (Array.isArray(variant.colors)) {
          for (const color of variant.colors) {
            const imgs = []

            for (const field of color.imageFields || []) {
              if (fileMap[field]) imgs.push(fileMap[field])
            }

            color.images = imgs
            delete color.imageFields
          }
        }

        const agg = computeVariantAgg(variant)
        variant.minPrice = agg.minPrice
        variant.maxPrice = agg.maxPrice
        variant.totalStock = agg.totalStock || 0
      }
    }

    // Default image fallback
    if (!payload.defaultImage) {
      const firstImg =
        payload.variants?.[0]?.colors?.[0]?.images?.[0]
      if (firstImg) payload.defaultImage = firstImg
    }

    payload.createdBy = req.user?._id

    const created = await Product.create(payload)
    res.status(201).json(created)

  } catch (error) {
    console.error("Error in createProduct controller:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
   
    // 🔥 PARSE JSON FIELDS (CRITICAL)
    payload.variants = payload.variants ? JSON.parse(payload.variants) : []
    payload.tags = payload.tags ? JSON.parse(payload.tags) : []
    payload.features = payload.features ? JSON.parse(payload.features) : []

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const slug = payload.slug || product.slug || id

    // Upload new files
    const fileMap = await uploadFiles(
      req.files || [],
      `products/${slug}`
    )

    // Handle variants / colors
    for (const variant of payload.variants) {
      for (const color of variant.colors || []) {

        // 🔥 DELETE removed images
        if (Array.isArray(color.removedImages)) {
          for (const publicId of color.removedImages) {
            await deleteFromCloudinary(publicId)
          }
        }

        // 🔥 ADD new uploaded images
        const newImages = []
        for (const field of color.imageFields || []) {
          if (fileMap[field]) newImages.push(fileMap[field])
        }

        // 🔥 MERGE old + new
        color.images = [
          ...(Array.isArray(color.images) ? color.images : []),
          ...newImages,
        ]

        delete color.imageFields
        delete color.removedImages
      }

      const agg = computeVariantAgg(variant)
      variant.minPrice = agg.minPrice
      variant.maxPrice = agg.maxPrice
      variant.totalStock = agg.totalStock || 0
    }

    // 🔥 DEFAULT IMAGE FIX
    if (!payload.defaultImage) {
      payload.defaultImage =
        payload.variants?.[0]?.colors?.[0]?.images?.[0]?.url || ""
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    )

    res.json(updated)

  } catch (error) {
    console.error("Error in updateProduct controller:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // collect public_ids
        const publicIds = [];

        if (product.defaultImage && product.defaultImage.public_id) publicIds.push(product.defaultImage.public_id);


        if (Array.isArray(product.variants)) {
            for (const variant of product.variants) {
                if (Array.isArray(variant.colors)) {
                    for (const color of variant.colors) {
                        if (Array.isArray(color.images)) {
                            for (const img of color.images) {
                                if (img && img.public_id) publicIds.push(img.public_id);
                            }
                        }
                    }
                }
            }
        }

        // attempt deletion on cloudinary in parallel (but limit if huge)
        await Promise.all(publicIds.map((pid) => destroyImage(pid)));

        await product.deleteOne();
        res.json({ message: "Product and images deleted" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {

        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update cache function");
    }
}

const uploadFiles = async (files = [], folder = "products") => {
    const map = {};
    for (const file of files) {
        const pub = `${Date.now()}-${file.originalname.split(".")[0]}`;
        const res = await uploadBufferToCloudinary(file.buffer, { folder, public_id: pub });
        map[file.fieldname] = { url: res.secure_url, public_id: res.public_id };
    }
    return map;
};


const computeVariantAgg = (variant) => {
    const prices = [];
    let totalStock = 0;
    if (Array.isArray(variant.colors)) {
        for (const color of variant.colors) {
            if (Array.isArray(color.images)) {
                // nop
            }
        }
    }
    if (variant.price) prices.push(Number(variant.price));
    if (variant.discountedPrice) prices.push(Number(variant.discountedPrice));
    // if more sizes/colors have separate stock, assume variant.totalStock provided else 0
    if (variant.totalStock) totalStock = variant.totalStock;


    return {
        minPrice: prices.length ? Math.min(...prices) : variant.price || null,
        maxPrice: prices.length ? Math.max(...prices) : variant.price || null,
        totalStock,
    };
};

