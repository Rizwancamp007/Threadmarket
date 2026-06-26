const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  trackOrderByToken,
  updateOrderStatus,
  getOrders,
  markOrderAsPaid
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Note: addOrderItems can be public or private depending on if user is logged in
// In a real app, you might have optional auth middleware, but here we'll just skip it for public checkout
// To attach req.user if present, we could use a non-blocking auth middleware.
// For now, we'll make it public.
router.route('/')
  .post(addOrderItems)
  .get(protect, adminOnly, getOrders);
router.route('/track/:token').get(trackOrderByToken);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);
router.route('/:id/pay').put(protect, adminOnly, markOrderAsPaid);

module.exports = router;
