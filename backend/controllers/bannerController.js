const Banner = require('../models/Banner');

// @desc    Get active banners
// @route   GET /api/v1/banners
// @access  Public
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching banners' });
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/v1/banners/admin
// @access  Private/Admin
const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching banners' });
  }
};

// @desc    Create a banner
// @route   POST /api/v1/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, sortOrder, isActive } = req.body;
    const banner = await Banner.create({ title, subtitle, image, link, sortOrder, isActive });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/v1/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      banner.title = req.body.title !== undefined ? req.body.title : banner.title;
      banner.subtitle = req.body.subtitle !== undefined ? req.body.subtitle : banner.subtitle;
      banner.image = req.body.image || banner.image;
      banner.link = req.body.link !== undefined ? req.body.link : banner.link;
      banner.sortOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : banner.sortOrder;
      banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/v1/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await Banner.deleteOne({ _id: banner._id });
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getActiveBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner
};
