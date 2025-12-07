const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection
require('./database/db-config');

// Import AI Helper
const { processMessage, verifyMessage } = require('./utils/aiHelper');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const chatRoutes = require('./routes/chatRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminManagementRoutes = require('./routes/adminManagementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Ngrok/Heroku
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For Meta/Twilio webhooks

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/management', adminManagementRoutes); // Admin Management Route
app.use('/api/reports', reportRoutes);
app.use('/api/chat-history', chatRoutes);
app.use('/api/whatsapp', whatsappRoutes); // Meta WhatsApp Route
app.use('/api/alerts', alertRoutes); // Alerts Route

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.originalname, mimetype: req.file.mimetype });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message, mode } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        console.log(`📩 Received message [${mode || 'chat'}]:`, message);
        const botResponse = await processMessage(message, mode || 'chat');
        console.log('🤖 Bot response:', botResponse);

        if (!botResponse || botResponse.trim() === '') {
            console.error('⚠️ Empty response from AI');
            return res.json({
                message: "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment.",
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            message: botResponse,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error('❌ Error processing message:', e);
        res.json({
            message: "I'm experiencing technical difficulties. Please try again later.",
            timestamp: new Date().toISOString()
        });
    }
});

// Verify endpoint
app.post('/api/verify', async (req, res) => {
    const { message, image } = req.body;

    if (!message && !image) {
        return res.status(400).json({ error: 'Message or image is required' });
    }

    try {
        console.log('🔍 Verifying message:', message);
        if (image) console.log('🖼️ With image:', image);

        const verificationResult = await verifyMessage(message || "Check the authenticity of this image.", image);
        console.log('✅ Verification result:', verificationResult);

        res.json(verificationResult);
    } catch (e) {
        console.error('❌ Error verifying message:', e);
        res.status(500).json({
            status: "unverified",
            color: "yellow",
            message: "System error during verification.",
            official_source: null
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`📱 WhatsApp endpoint: http://localhost:${PORT}/api/whatsapp`);
});
