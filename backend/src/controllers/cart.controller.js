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
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(req.user._id);

    // check if product already exists -> increase quantity instead
    const existingItem = user.cartItems.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({
        product: productId,
        quantity,
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
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    const user = await User.findById(req.user._id);

    const item = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
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
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

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