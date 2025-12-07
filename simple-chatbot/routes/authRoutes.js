const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, registerValidation, loginValidation } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
