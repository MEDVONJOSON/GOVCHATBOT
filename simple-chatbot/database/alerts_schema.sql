-- Real-time Alerts Feature Database Schema
USE govchat_db;

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category ENUM('emergency', 'government_notices', 'cybersecurity', 'public_safety', 'general_updates') NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
    issued_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
);

-- User Alert Subscriptions Table
CREATE TABLE IF NOT EXISTS user_alert_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    
    -- Category subscriptions
    emergency_enabled BOOLEAN DEFAULT TRUE,
    government_notices_enabled BOOLEAN DEFAULT TRUE,
    cybersecurity_enabled BOOLEAN DEFAULT TRUE,
    public_safety_enabled BOOLEAN DEFAULT TRUE,
    general_updates_enabled BOOLEAN DEFAULT FALSE,
    
    -- Notification methods
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT TRUE,
    inapp_enabled BOOLEAN DEFAULT TRUE,
    
    -- Contact information
    phone_number VARCHAR(20),
    email VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subscription (user_id),
    INDEX idx_user_id (user_id)
);

-- Insert sample alerts for testing
INSERT INTO alerts (title, category, message, severity, issued_by) VALUES
('National Security Alert', 'emergency', 'Avoid the central area due to ongoing police operations. Stay indoors and follow official instructions.', 'critical', 'Office of National Security'),
('MoHS Health Advisory', 'public_safety', 'A health warning has been issued regarding an outbreak of waterborne diseases in the Western Area. Boil all drinking water.', 'high', 'Ministry of Health'),
('Cybersecurity Warning', 'cybersecurity', 'New phishing scam targeting mobile money users. Do not share your PIN or OTP with anyone claiming to be from your bank.', 'high', 'National Cyber Security Centre'),
('Public Holiday Announcement', 'government_notices', 'Monday, December 9th is declared a public holiday in observance of National Heroes Day.', 'low', 'Office of the President'),
('Road Closure Notice', 'public_safety', 'Wilkinson Road will be closed for maintenance from Dec 10-15. Use alternative routes.', 'medium', 'Sierra Leone Roads Authority');

SELECT 'Alerts database schema created successfully!' AS message;
