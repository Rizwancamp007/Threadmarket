const express = require('express');
const router = express.Router();
const { validatePromoCode } = require('../controllers/promoController');

router.route('/validate').post(validatePromoCode);

module.exports = router;
