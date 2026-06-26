const express = require('express');
const router = express.Router();
const { getActiveBanners, getAdminBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getActiveBanners)
  .post(protect, adminOnly, createBanner);

router.route('/admin').get(protect, adminOnly, getAdminBanners);

router.route('/:id')
  .put(protect, adminOnly, updateBanner)
  .delete(protect, adminOnly, deleteBanner);

module.exports = router;
