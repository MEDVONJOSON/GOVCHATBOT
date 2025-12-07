const db = require('../database/db-config');
const { body, validationResult } = require('express-validator');

// Get recent alerts
const getAlerts = async (req, res) => {
    try {
        const { category, limit = 20 } = req.query;

        let query = 'SELECT * FROM alerts WHERE is_active = TRUE';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const [alerts] = await db.query(query, params);

        res.json({ alerts });
    } catch (error) {
        console.error('Get alerts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's alert subscriptions
const getSubscriptions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [subscriptions] = await db.query(
            'SELECT * FROM user_alert_subscriptions WHERE user_id = ?',
            [userId]
        );

        if (subscriptions.length === 0) {
            // Return default subscriptions
            return res.json({
                subscriptions: {
                    emergency_enabled: true,
                    government_notices_enabled: true,
                    cybersecurity_enabled: true,
                    public_safety_enabled: true,
                    general_updates_enabled: false,
                    whatsapp_enabled: false,
                    sms_enabled: false,
                    email_enabled: true,
                    inapp_enabled: true,
                    phone_number: null,
                    email: req.user.email || null
                }
            });
        }

        res.json({ subscriptions: subscriptions[0] });
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user's alert subscriptions
const updateSubscriptions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            emergency_enabled, government_notices_enabled, cybersecurity_enabled,
            public_safety_enabled, general_updates_enabled,
            whatsapp_enabled, sms_enabled, email_enabled, inapp_enabled,
            phone_number, email
        } = req.body;

        // Check if subscription exists
        const [existing] = await db.query(
            'SELECT id FROM user_alert_subscriptions WHERE user_id = ?',
            [userId]
        );

        if (existing.length > 0) {
            // Update existing
            await db.query(
                `UPDATE user_alert_subscriptions SET
                emergency_enabled = ?, government_notices_enabled = ?, cybersecurity_enabled = ?,
                public_safety_enabled = ?, general_updates_enabled = ?,
                whatsapp_enabled = ?, sms_enabled = ?, email_enabled = ?, inapp_enabled = ?,
                phone_number = ?, email = ?
                WHERE user_id = ?`,
                [
                    emergency_enabled, government_notices_enabled, cybersecurity_enabled,
                    public_safety_enabled, general_updates_enabled,
                    whatsapp_enabled, sms_enabled, email_enabled, inapp_enabled,
                    phone_number, email, userId
                ]
            );
        } else {
            // Insert new
            await db.query(
                `INSERT INTO user_alert_subscriptions (
                    user_id, emergency_enabled, government_notices_enabled, cybersecurity_enabled,
                    public_safety_enabled, general_updates_enabled,
                    whatsapp_enabled, sms_enabled, email_enabled, inapp_enabled,
                    phone_number, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, emergency_enabled, government_notices_enabled, cybersecurity_enabled,
                    public_safety_enabled, general_updates_enabled,
                    whatsapp_enabled, sms_enabled, email_enabled, inapp_enabled,
                    phone_number, email
                ]
            );
        }

        res.json({ message: 'Subscriptions updated successfully' });
    } catch (error) {
        console.error('Update subscriptions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send alert (Admin only)
const sendAlert = async (req, res) => {
    try {
        const { title, category, message, severity, issued_by } = req.body;

        const [result] = await db.query(
            'INSERT INTO alerts (title, category, message, severity, issued_by) VALUES (?, ?, ?, ?, ?)',
            [title, category, message, severity, issued_by]
        );

        // TODO: Trigger notifications to subscribed users
        // This would call the notificationService to send via WhatsApp/SMS/Email

        res.status(201).json({
            message: 'Alert created successfully',
            alertId: result.insertId
        });
    } catch (error) {
        console.error('Send alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single alert details
const getAlertDetails = async (req, res) => {
    try {
        const { alertId } = req.params;

        const [alerts] = await db.query(
            'SELECT * FROM alerts WHERE id = ?',
            [alertId]
        );

        if (alerts.length === 0) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ alert: alerts[0] });
    } catch (error) {
        console.error('Get alert details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAlerts,
    getSubscriptions,
    updateSubscriptions,
    sendAlert,
    getAlertDetails
};
