const db = require('../database/db-config');
const { body, validationResult } = require('express-validator');

// Validation middleware
const reportValidation = [
    body('reportType').isIn([
        'phishing', 'fraud', 'misinformation', 'other',
        'fake_lottery', 'identity_theft', 'mobile_money_fraud',
        'romance_scam', 'social_media_impersonation'
    ]).withMessage('Invalid report type'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('evidenceUrl').optional().isURL().withMessage('Invalid URL'),
    body('scammerPhone').optional().trim(),
    body('scammerAccount').optional().trim(),
    body('platform').optional().trim(),
    body('incidentDate').optional().isISO8601().withMessage('Invalid date'),
    body('isAnonymous').optional().isBoolean(),
    body('reporterName').optional().trim(),
    body('reporterContact').optional().trim()
];

// Submit scam report
const submitReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            reportType, description, evidenceUrl,
            scammerPhone, scammerAccount, platform, incidentDate,
            isAnonymous, reporterName, reporterContact
        } = req.body;
        const userId = req.user.userId;

        // Generate unique Case Reference ID
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const caseReferenceId = `REF-${year}-${randomNum}`;

        const [result] = await db.query(
            `INSERT INTO scam_reports (
                user_id, report_type, description, evidence_url, 
                case_reference_id, scammer_phone, scammer_account, 
                platform, incident_date, is_anonymous, 
                reporter_name, reporter_contact, status, priority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, reportType, description, evidenceUrl || null,
                caseReferenceId, scammerPhone || null, scammerAccount || null,
                platform || null, incidentDate || null, isAnonymous || false,
                reporterName || null, reporterContact || null, 'pending', 'medium'
            ]
        );

        res.status(201).json({
            message: 'Report submitted successfully',
            reportId: result.insertId,
            caseReferenceId: caseReferenceId
        });
    } catch (error) {
        console.error('Submit report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's reports
const getMyReports = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [reports] = await db.query(
            'SELECT * FROM scam_reports WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({ reports });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all reports (Admin only)
const getAllReports = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
            SELECT sr.*, u.full_name, u.email 
            FROM scam_reports sr 
            LEFT JOIN users u ON sr.user_id = u.id
        `;

        if (status) {
            query += ' WHERE sr.status = ?';
            const [reports] = await db.query(query + ' ORDER BY sr.created_at DESC', [status]);
            return res.json({ reports });
        }

        const [reports] = await db.query(query + ' ORDER BY sr.created_at DESC');
        res.json({ reports });
    } catch (error) {
        console.error('Get all reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update report status (Admin only)
const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, priority } = req.body;

        await db.query(
            'UPDATE scam_reports SET status = ?, priority = ? WHERE id = ?',
            [status, priority, reportId]
        );

        res.json({ message: 'Report updated successfully' });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get report statistics
const getReportStats = async (req, res) => {
    try {
        const [pending] = await db.query('SELECT COUNT(*) as count FROM scam_reports WHERE status = "pending"');
        const [investigating] = await db.query('SELECT COUNT(*) as count FROM scam_reports WHERE status = "investigating"');
        const [resolved] = await db.query('SELECT COUNT(*) as count FROM scam_reports WHERE status = "resolved"');
        const [total] = await db.query('SELECT COUNT(*) as count FROM scam_reports');

        res.json({
            pending: pending[0].count,
            investigating: investigating[0].count,
            resolved: resolved[0].count,
            total: total[0].count
        });
    } catch (error) {
        console.error('Get report stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getAllReports,
    updateReportStatus,
    getReportStats,
    reportValidation
};
