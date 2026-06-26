const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, adminOnly, getUsers);

router.route('/:id')
  .delete(protect, adminOnly, deleteUser);

router.route('/:id/role')
  .put(protect, adminOnly, updateUserRole);

module.exports = router;
