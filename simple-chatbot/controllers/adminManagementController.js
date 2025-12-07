const db = require('../database/db-config');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Middleware to check if user is super admin
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
    next();
};

// Log admin activity
const logActivity = async (adminId, action, targetUserId = null, details = null, ipAddress = null) => {
    try {
        await db.query(
            'INSERT INTO admin_activity_log (admin_id, action, target_user_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [adminId, action, targetUserId, details, ipAddress]
        );
    } catch (error) {
        console.error('Activity log error:', error);
    }
};

// Create new admin (Super Admin only)
const createAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, fullName, role } = req.body;

        // Only super_admin can create admins
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Only Super Admin can create new admins' });
        }

        // Check if user already exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin
        const [result] = await db.query(
            `INSERT INTO users (username, email, password, full_name, role, created_by, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
            [username, email, hashedPassword, fullName, role || 'admin', req.user.userId]
        );

        // Log activity
        await logActivity(
            req.user.userId,
            'CREATE_ADMIN',
            result.insertId,
            `Created new ${role || 'admin'}: ${username}`,
            req.ip
        );

        res.status(201).json({
            message: 'Admin created successfully',
            adminId: result.insertId
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update admin profile
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, username } = req.body;

        // Users can update their own profile, or super_admin can update anyone
        if (req.user.userId !== parseInt(userId) && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if email/username is already taken by another user
        const [existing] = await db.query(
            'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?',
            [email, username, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email or username already in use' });
        }

        await db.query(
            'UPDATE users SET full_name = ?, email = ?, username = ? WHERE id = ?',
            [fullName, email, username, userId]
        );

        await logActivity(
            req.user.userId,
            'UPDATE_PROFILE',
            userId,
            `Updated profile for user ID: ${userId}`,
            req.ip
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Users can change their own password, or super_admin can change anyone's
        const isSelf = req.user.userId === parseInt(userId);
        const isSuperAdminAction = req.user.role === 'super_admin';

        if (!isSelf && !isSuperAdminAction) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If changing own password, verify current password
        if (isSelf) {
            const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isValid = await bcrypt.compare(currentPassword, users[0].password);
            if (!isValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE users SET password = ?, last_password_change = NOW() WHERE id = ?',
            [hashedPassword, userId]
        );

        await logActivity(
            req.user.userId,
            'CHANGE_PASSWORD',
            userId,
            isSelf ? 'Changed own password' : `Reset password for user ID: ${userId}`,
            req.ip
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user or admin (Super Admin only for admins)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get target user info
        const [users] = await db.query('SELECT role, username FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const targetUser = users[0];

        // Prevent deleting super_admin
        if (targetUser.role === 'super_admin') {
            return res.status(403).json({ message: 'Cannot delete Super Admin account' });
        }

        // Only super_admin can delete admins
        if (targetUser.role === 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Only Super Admin can delete admin accounts' });
        }

        // Prevent self-deletion
        if (req.user.userId === parseInt(userId)) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        await logActivity(
            req.user.userId,
            'DELETE_USER',
            userId,
            `Deleted ${targetUser.role}: ${targetUser.username}`,
            req.ip
        );

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all admins (Super Admin only)
const getAllAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            `SELECT id, username, email, full_name, role, is_active, created_at, last_password_change
             FROM users 
             WHERE role IN ('admin', 'super_admin')
             ORDER BY role DESC, created_at DESC`
        );

        res.json({ admins });
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get activity log
const getActivityLog = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const [logs] = await db.query(
            `SELECT l.*, u.username as admin_username, t.username as target_username
             FROM admin_activity_log l
             LEFT JOIN users u ON l.admin_id = u.id
             LEFT JOIN users t ON l.target_user_id = t.id
             ORDER BY l.created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        res.json({ logs });
    } catch (error) {
        console.error('Get activity log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Validation rules
const createAdminValidation = [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('role').optional().isIn(['admin', 'super_admin']).withMessage('Invalid role')
];

const changePasswordValidation = [
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

module.exports = {
    isSuperAdmin,
    createAdmin,
    createAdminValidation,
    updateProfile,
    changePassword,
    changePasswordValidation,
    deleteUser,
    getAllAdmins,
    getActivityLog
};
