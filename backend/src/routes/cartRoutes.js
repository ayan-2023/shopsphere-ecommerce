const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All cart routes require authentication

router
  .route('/')
  .get(getCart)
  .post(addToCart);

router
  .route('/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
