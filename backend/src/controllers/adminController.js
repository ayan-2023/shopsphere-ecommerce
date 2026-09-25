const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

// Get admin dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await userModel.getCustomerCount();
    const monthlyStats = await orderModel.getMonthlyStats();
    const customerStats = await userModel.getMonthlyCustomerStats();

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        totalCustomers,

        currentMonthRevenue: Number(
          monthlyStats.currentMonthRevenue || 0
        ),

        previousMonthRevenue: Number(
          monthlyStats.previousMonthRevenue || 0
        ),

        currentMonthOrders: Number(
          monthlyStats.currentMonthOrders || 0
        ),

        previousMonthOrders: Number(
          monthlyStats.previousMonthOrders || 0
        ),
        currentMonthCustomers: customerStats.currentMonthCustomers,
        previousMonthCustomers: customerStats.previousMonthCustomers,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardStats,
};