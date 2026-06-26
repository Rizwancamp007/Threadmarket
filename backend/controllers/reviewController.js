const Review = require('../models/Review');

// @desc    Get approved reviews with optional images filter
// @route   GET /api/v1/reviews
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const hasImage = req.query.hasImage === 'true';

    const query = { isApproved: true };
    if (hasImage) {
      query['images.0'] = { $exists: true }; // Must have at least one image
    }

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching reviews' });
  }
};

module.exports = {
  getApprovedReviews
};
