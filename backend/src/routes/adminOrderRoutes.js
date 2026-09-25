const express = require('express');

const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminOrderController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

// All admin order routes require:
// 1. Valid JWT
// 2. Admin role
router.use(protect);
router.use(adminOnly);

// GET /api/admin/orders
router.get('/', getAllOrders);

// PUT /api/admin/orders/:id/status
router.put('/:id/status', updateOrderStatus);

module.exports = router;