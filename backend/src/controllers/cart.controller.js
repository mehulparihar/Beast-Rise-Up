import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cartItems.product");

    return res.json({
      success: true,
      cart: user.cartItems,
    });
  } catch (err) {
    console.error("Get Cart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product,
      productId,
      sku,
      size,
      colorName,
      quantity = 1, } = req.body;

    if (!productId || !sku || !size || !colorName) {
      return res.status(400).json({
        success: false,
        message: "productId, sku, size, colorName are required",
      });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find(v => v.sku === sku);
    if (!variant) {
      return res.status(400).json({ success: false, message: "Invalid SKU" });
    }

    const color = variant.colors.find(c => c.name === colorName);
    if (!color) {
      return res.status(400).json({ success: false, message: "Invalid color" });
    }

    const user = await User.findById(req.user._id);

    // same product + same variant + same size + same color
    const existingItem = user.cartItems.find(item =>
      item.product.toString() === productId &&
      item.productSnapshot.variant.sku === sku &&
      item.productSnapshot.size === size &&
      item.productSnapshot.color.name === colorName
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({
        product: product._id,
        quantity,

        productSnapshot: {
          title: product.title,
          slug: product.slug,
          defaultImage: product.defaultImage,
          brand: product.brand,
          category: product.category,

          variant: {
            sku: variant.sku,
            price: variant.price,
            discountedPrice: variant.discountedPrice,
          },

          size,

          color: {
            name: color.name,
            hexCode: color.hexCode,
          },
        },
      });
    }

    await user.save();

    return res.json({
      success: true,
      message: "Added to cart",
      cart: user.cartItems,
    });
  } catch (err) {
    console.error("Add To Cart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { productId, sku, size, colorName, quantity } = req.body;

    if (!productId || !sku || !size || !colorName || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "productId, sku, size, colorName and quantity are required",
      });
    }

    const user = await User.findById(req.user._id);

    const itemIndex = user.cartItems.findIndex((item) =>
      item.product.toString() === productId &&
      item.productSnapshot.variant.sku === sku &&
      item.productSnapshot.size === size &&
      item.productSnapshot.color.name === colorName
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // remove item if quantity <= 0
    if (quantity <= 0) {
      user.cartItems.splice(itemIndex, 1);
    } else {
      user.cartItems[itemIndex].quantity = quantity;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Cart updated",
      cart: user.cartItems,
    });

  } catch (err) {
    console.error("Update Cart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeCartItem = async (req, res) => {
 
  try {
    const { productId, sku, size, colorName } = req.body;


    if (!productId || !sku || !size || !colorName) {
      return res.status(400).json({
        success: false,
        message: "productId, sku, size, colorName are required",
      });
    }

    const user = await User.findById(req.user._id);

    const initialLength = user.cartItems.length;

    user.cartItems = user.cartItems.filter((item) => {
      return !(
        item.product.toString() === productId &&
        item.productSnapshot.variant.sku === sku &&
        item.productSnapshot.size === size &&
        item.productSnapshot.color.name === colorName
      );
    });

    if (user.cartItems.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await user.save();

    return res.json({
      success: true,
      message: "Item removed from cart",
      cart: user.cartItems,
    });
  } catch (err) {
    console.error("Remove Cart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cartItems = [];
    await user.save();

    return res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (err) {
    console.error("Clear Cart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};