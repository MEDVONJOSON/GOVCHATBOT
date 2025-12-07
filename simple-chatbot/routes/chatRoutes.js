const express = require('express');
const router = express.Router();
const { saveChatMessage, getChatHistory, getChatStats, getAllChats } = require('../controllers/chatController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/chat/save
// @desc    Save chat message
// @access  Private (optional - can work without auth)
router.post('/save', saveChatMessage);

// @route   GET /api/chat/history
// @desc    Get user's chat history
// @access  Private
router.get('/history', authMiddleware, getChatHistory);

// @route   GET /api/chat/all
// @desc    Get all chat history for admin
// @access  Admin
router.get('/all', authMiddleware, adminMiddleware, getAllChats);

// @route   GET /api/chat/stats
// @desc    Get chat statistics
// @access  Admin
router.get('/stats', authMiddleware, adminMiddleware, getChatStats);

module.exports = router;
