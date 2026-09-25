const express = require('express');
const router = express.Router();

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a product
router.get(
  '/product/:productId',
  getProductReviews
);

// Create review
// Login required
router.post(
  '/',
  protect,
  createReview
);

// Delete own review
// Login required
router.delete(
  '/:id',
  protect,
  deleteReview
);

module.exports = router;