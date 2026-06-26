const Bundle = require('../models/Bundle');

// @desc    Get active bundles
// @route   GET /api/v1/bundles
// @access  Public
const getActiveBundles = async (req, res) => {
  try {
    const bundles = await Bundle.find({ isActive: true })
      .populate('products', 'name slug price discountedPrice images')
      .lean();
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching bundles' });
  }
};

module.exports = {
  getActiveBundles
};
