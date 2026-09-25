const orderModel = require('../models/orderModel');

// @desc    Get all customer orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order status',
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const updatedOrder = await orderModel.updateOrderStatus(
      id,
      status
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};