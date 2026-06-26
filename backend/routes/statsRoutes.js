const express = require('express');
const router = express.Router();
const { getPublicStats, getAdminDashboardStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/public').get(getPublicStats);
router.route('/admin').get(protect, adminOnly, getAdminDashboardStats);

module.exports = router;
