const express = require('express');
const router = express.Router();
const { getApprovedReviews } = require('../controllers/reviewController');

router.route('/').get(getApprovedReviews);

module.exports = router;
