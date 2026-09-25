const reviewModel = require('../models/reviewModel');

// Create review
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      productId,
      orderId,
      rating,
      review,
    } = req.body;

    // Validate required fields
    if (!productId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product, order and rating are required',
      });
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number between 1 and 5',
      });
    }

    // Validate review text length
    if (review && review.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Review cannot exceed 1000 characters',
      });
    }

    const newReview = await reviewModel.createReview({
      productId: Number(productId),
      userId,
      orderId: Number(orderId),
      rating: numericRating,
      review: review?.trim() || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Create Review Error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit review',
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const reviews = await reviewModel.getProductReviews(productId);

    const rating = await reviewModel.getProductRating(productId);

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        rating,
      },
    });
  } catch (error) {
    console.error('Get Product Reviews Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product reviews',
    });
  }
};

// Delete own review
const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const deleted = await reviewModel.deleteReview(
      reviewId,
      userId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not allowed to delete it',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete Review Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};