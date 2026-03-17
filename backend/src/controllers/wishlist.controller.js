import User from "../models/user.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

   
    if (user.wishlist.includes(productId)) {
      return res.json({
        success: true,
        message: "Already in wishlist",
        wishlist: user.wishlist,
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });

  } catch (err) {
    console.error("Wishlist Add Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });

  } catch (err) {
    console.error("Wishlist Remove Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist");

    return res.json({
      success: true,
      wishlist: user.wishlist,
    });

  } catch (err) {
    console.error("Wishlist Fetch Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};