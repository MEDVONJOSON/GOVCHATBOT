const express = require('express');
const router = express.Router();
const { getAllUsers, getUserStats, toggleUserStatus, deleteUser } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Admin
router.get('/users/stats', getUserStats);

// @route   PUT /api/admin/users/:userId/status
// @desc    Toggle user active status
// @access  Admin
router.put('/users/:userId/status', toggleUserStatus);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user
// @access  Admin
router.delete('/users/:userId', deleteUser);

module.exports = router;
