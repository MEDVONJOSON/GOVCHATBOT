const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    getAlerts,
    getSubscriptions,
    updateSubscriptions,
    sendAlert,
    getAlertDetails
} = require('../controllers/alertController');

// Public routes
router.get('/', getAlerts);
router.get('/:alertId', getAlertDetails);

// Protected routes (require authentication)
router.get('/subscriptions/me', authMiddleware, getSubscriptions);
router.post('/subscriptions', authMiddleware, updateSubscriptions);

// Admin routes
router.post('/send', authMiddleware, adminMiddleware, sendAlert);

module.exports = router;
