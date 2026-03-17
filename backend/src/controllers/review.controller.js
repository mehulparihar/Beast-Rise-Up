import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: stats[0].ratingAverage,
      ratingCount: stats[0].ratingCount,
    });
  } else {
    // No reviews remain
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await updateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });
  } catch (err) {
    console.error("Create Review Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId });

    return res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    await updateProductRating(review.product);

    return res.json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (err) {
    console.error("Update Review Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await updateProductRating(review.product);

    return res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (err) {
    console.error("Delete Review Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
