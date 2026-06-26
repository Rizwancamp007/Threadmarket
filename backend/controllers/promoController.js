const PromoCode = require('../models/PromoCode');

// @desc    Validate a promo code
// @route   POST /api/v1/promo/validate
// @access  Public
const validatePromoCode = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Please provide a promo code' });
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ message: 'Invalid or inactive promo code' });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    if (promo.minOrderValue && cartTotal < promo.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value of Rs. ${promo.minOrderValue} required` });
    }

    res.json({
      _id: promo._id,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      message: 'Promo code applied successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error validating promo code' });
  }
};

module.exports = {
  validatePromoCode
};
