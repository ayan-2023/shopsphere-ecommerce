// const orderModel = require('../models/orderModel');

// // @desc    Create a new order from cart
// // @route   POST /api/orders
// // @access  Private
// const createOrder = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { shippingAddress } = req.body;

//     const order = await orderModel.createOrder({
//       userId,
//       shippingAddress: shippingAddress || 'Standard Shipping Address',
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: order,
//     });
//   } catch (error) {
//     if (
//       error.message.includes('empty cart') ||
//       error.message.includes('Insufficient stock')
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     return next(error);
//   }
// };

// // @desc    Get logged in user orders
// // @route   GET /api/orders
// // @access  Private
// const getOrders = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const orders = await orderModel.getUserOrders(userId);

//     return res.status(200).json({
//       success: true,
//       message: 'Orders fetched successfully',
//       data: orders,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     // Admins can view any order; standard users view only their own
//     const searchUserId = req.user.role === 'admin' ? null : userId;
//     const order = await orderModel.getOrderById(id, searchUserId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Order fetched successfully',
//       data: order,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// module.exports = {
//   createOrder,
//   getOrders,
//   getOrderById,
// };



const orderModel = require('../models/orderModel');

// @desc    Create a new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Basic validation
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email and phone are required',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    const order = await orderModel.createOrder({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    if (
      error.message.includes('empty cart') ||
      error.message.includes('Insufficient stock')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await orderModel.getUserOrders(userId);

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Admin can view any order.
    // Normal user can view only their own order.
    const searchUserId =
      req.user.role === 'admin' ? null : userId;

    const order = await orderModel.getOrderById(
      id,
      searchUserId
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};