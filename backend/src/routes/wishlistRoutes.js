const express = require('express');
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware');

// Get current user's wishlist
router.get('/', protect, getWishlist);

// Check whether a product is in current user's wishlist
router.get('/check/:productId', protect, checkWishlist);

// Add product to wishlist
router.post('/', protect, addToWishlist);

// Remove product from wishlist
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;