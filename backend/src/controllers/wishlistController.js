const wishlistModel = require('../models/wishlistModel');

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const numericProductId = Number(productId);

    if (
      !Number.isInteger(numericProductId) ||
      numericProductId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const wishlistItem = await wishlistModel.addToWishlist(
      userId,
      numericProductId
    );

    return res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    console.error('Add Wishlist Error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to add product to wishlist',
    });
  }
};

// GET USER WISHLIST
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistModel.getUserWishlist(userId);

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error('Get Wishlist Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
    });
  }
};

// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const removed = await wishlistModel.removeFromWishlist(
      userId,
      productId
    );

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Product is not in your wishlist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    console.error('Remove Wishlist Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
    });
  }
};

// CHECK WISHLIST STATUS
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const isWishlisted = await wishlistModel.isInWishlist(
      userId,
      productId
    );

    return res.status(200).json({
      success: true,
      data: {
        isWishlisted,
      },
    });
  } catch (error) {
    console.error('Check Wishlist Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status',
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
};