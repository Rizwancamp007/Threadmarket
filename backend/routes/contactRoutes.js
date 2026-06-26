const express = require('express');
const router = express.Router();
const { submitContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

module.exports = router;
