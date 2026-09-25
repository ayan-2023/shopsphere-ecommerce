const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getCartWithItems(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: cart,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId',
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const cart = await cartModel.addItem({
      userId,
      productId: Number(productId),
      quantity: Number(quantity),
    });

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity to update',
      });
    }

    const cart = await cartModel.updateItemQuantity({
      userId,
      productId: Number(productId),
      quantity: Number(quantity),
    });

    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await cartModel.removeItem({
      userId,
      productId: Number(productId),
    });

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
