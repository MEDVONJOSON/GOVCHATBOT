const db = require('../database/db-config');

// Save chat message
const saveChatMessage = async (req, res) => {
    try {
        const { message, sender, sessionId } = req.body;
        const userId = req.user ? req.user.userId : null;

        await db.query(
            'INSERT INTO chat_history (user_id, message, sender, session_id) VALUES (?, ?, ?, ?)',
            [userId, message, sender, sessionId]
        );

        res.json({ message: 'Chat saved successfully' });
    } catch (error) {
        console.error('Save chat error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's chat history
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 50 } = req.query;

        const [messages] = await db.query(
            'SELECT * FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
            [userId, parseInt(limit)]
        );

        res.json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get chat statistics
const getChatStats = async (req, res) => {
    try {
        const [totalChats] = await db.query('SELECT COUNT(*) as count FROM chat_history');
        const [totalSessions] = await db.query('SELECT COUNT(DISTINCT session_id) as count FROM chat_history');
        const [todayChats] = await db.query('SELECT COUNT(*) as count FROM chat_history WHERE DATE(timestamp) = CURDATE()');

        res.json({
            totalChats: totalChats[0].count,
            totalSessions: totalSessions[0].count,
            todayChats: todayChats[0].count
        });
    } catch (error) {
        console.error('Get chat stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all chat history (Admin)
const getAllChats = async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        const [messages] = await db.query(
            `SELECT ch.*, u.full_name, u.email 
             FROM chat_history ch 
             LEFT JOIN users u ON ch.user_id = u.id 
             ORDER BY ch.timestamp DESC 
             LIMIT ?`,
            [parseInt(limit)]
        );

        res.json({ messages });
    } catch (error) {
        console.error('Get all chats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    saveChatMessage,
    getChatHistory,
    getChatStats,
    getAllChats
};
