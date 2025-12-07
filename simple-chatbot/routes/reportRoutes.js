const express = require('express');
const router = express.Router();
const {
    submitReport,
    getMyReports,
    getAllReports,
    updateReportStatus,
    getReportStats,
    reportValidation
} = require('../controllers/reportController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/reports/submit
// @desc    Submit scam report
// @access  Private
router.post('/submit', authMiddleware, reportValidation, submitReport);

// @route   GET /api/reports/my-reports
// @desc    Get user's reports
// @access  Private
router.get('/my-reports', authMiddleware, getMyReports);

// @route   GET /api/reports/all
// @desc    Get all reports (with optional status filter)
// @access  Admin
router.get('/all', authMiddleware, adminMiddleware, getAllReports);

// @route   PUT /api/reports/:reportId
// @desc    Update report status
// @access  Admin
router.put('/:reportId', authMiddleware, adminMiddleware, updateReportStatus);

// @route   GET /api/reports/stats
// @desc    Get report statistics
// @access  Admin
router.get('/stats', authMiddleware, adminMiddleware, getReportStats);

module.exports = router;
