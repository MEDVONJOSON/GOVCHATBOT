const db = require('../database/db-config');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, email, phone, role, created_at, last_login, is_active FROM users ORDER BY created_at DESC'
        );
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const [totalAdmins] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
        const [activeUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
        const [recentUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');

        res.json({
            totalUsers: totalUsers[0].count,
            totalAdmins: totalAdmins[0].count,
            activeUsers: activeUsers[0].count,
            recentUsers: recentUsers[0].count
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Suspend/Activate user
const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        await db.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive, userId]);

        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Don't allow deleting yourself
        if (parseInt(userId) === req.user.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserStats,
    toggleUserStatus,
    deleteUser
};
