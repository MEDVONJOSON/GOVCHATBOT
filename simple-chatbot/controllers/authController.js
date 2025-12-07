const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/db-config');

// Validation middleware
const registerValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Register new user
const register = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, phone, password } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, phone || null, passwordHash, 'user']
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertId, email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.insertId,
                fullName,
                email,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, email, phone, role, created_at, last_login FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: users[0] });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    registerValidation,
    loginValidation
};
