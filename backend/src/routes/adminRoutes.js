const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
} = require('../controllers/adminController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

// Admin authentication
router.use(protect);
router.use(adminOnly);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;