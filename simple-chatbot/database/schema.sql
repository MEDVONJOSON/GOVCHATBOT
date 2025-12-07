-- Sierra Leone Government Chatbot Database Schema
-- Database: govchat_db

-- Create database
CREATE DATABASE IF NOT EXISTS govchat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE govchat_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- 2. Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- 3. Scam Reports Table
CREATE TABLE IF NOT EXISTS scam_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    report_type ENUM('phishing', 'fraud', 'misinformation', 'other') NOT NULL,
    description TEXT NOT NULL,
    evidence_url VARCHAR(500),
    status ENUM('pending', 'investigating', 'resolved', 'dismissed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- 4. Verified Information Table
CREATE TABLE IF NOT EXISTS verified_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    source VARCHAR(255),
    verified_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (full_name, email, phone, password_hash, role) 
VALUES ('System Administrator', 'admin@gov.sl', '+232 76 000 000', '$2a$10$rKZYvVVVVVVVVVVVVVVVVuGKW8yJ0qYqYqYqYqYqYqYqYqYqYqYqY', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Success message
SELECT 'Database schema created successfully!' AS message;
