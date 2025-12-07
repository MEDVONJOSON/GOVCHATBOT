-- TECW Database Schema for MySQL
-- Truth Engine & Cyber Watchdog - Sierra Leone
-- Optimized with indexes, partitioning, and full-text search

-- Set UTF-8 for multilingual support (English, Krio, Temne, Mende)
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Database creation
CREATE DATABASE IF NOT EXISTS tecw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tecw_db;

-- 1. Users table (admin/moderator/analyst)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator', 'analyst') NOT NULL DEFAULT 'analyst',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Verifications table (WhatsApp message verification records)
CREATE TABLE verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    whatsapp_user_id VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    verdict ENUM('TRUE', 'FALSE', 'MISLEADING', 'UNVERIFIED', 'OUTDATED') NOT NULL,
    confidence DECIMAL(4,3) NOT NULL CHECK (confidence >= 0.000 AND confidence <= 1.000),
    reasoning JSON,
    evidence_hash VARCHAR(64) NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Indexes for performance
    INDEX idx_whatsapp_user (whatsapp_user_id),
    INDEX idx_verdict (verdict),
    INDEX idx_confidence (confidence),
    INDEX idx_processed_at (processed_at),
    -- Full-text search on message content
    FULLTEXT INDEX ft_message_content (message_content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Scam reports table
CREATE TABLE scam_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    category ENUM('mobile_money_fraud', 'fake_bank_message', 'impersonation_scam', 
                  'fake_job_lottery', 'advance_fee_fraud', 'phishing_link', 
                  'sim_swap_fraud', 'other') NOT NULL,
    risk_score INT CHECK (risk_score >= 0 AND risk_score <= 100),
    description TEXT NOT NULL,
    evidence_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open', 'investigating', 'closed', 'dismissed') NOT NULL DEFAULT 'open',
    -- Indexes
    INDEX idx_case_id (case_id),
    INDEX idx_category (category),
    INDEX idx_risk_score (risk_score),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    -- Full-text search on description
    FULLTEXT INDEX ft_description (description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Moderation queue table
CREATE TABLE moderation_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verification_id INT NOT NULL,
    assigned_to INT,
    status ENUM('pending', 'in_progress', 'completed', 'escalated') NOT NULL DEFAULT 'pending',
    reviewer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    -- Indexes
    INDEX idx_verification_id (verification_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (verification_id) REFERENCES verifications(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. System metrics table (for dashboard analytics)
CREATE TABLE system_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Indexes
    INDEX idx_metric_name (metric_name),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Attachments table (media files from WhatsApp)
CREATE TABLE attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verification_id INT NOT NULL,
    media_type ENUM('image', 'audio', 'video', 'document') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_kb INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Indexes
    INDEX idx_verification_id (verification_id),
    INDEX idx_media_type (media_type),
    INDEX idx_uploaded_at (uploaded_at),
    FOREIGN KEY (verification_id) REFERENCES verifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. User sessions table (for admin/moderator login)
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. API logs table (request logging for monitoring)
-- Partitioned by timestamp for better performance
CREATE TABLE api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(200) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Indexes
    INDEX idx_endpoint (endpoint),
    INDEX idx_ip (ip),
    INDEX idx_status_code (status_code),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    PARTITION p_2025_01 VALUES LESS THAN (UNIX_TIMESTAMP('2025-02-01')),
    PARTITION p_2025_02 VALUES LESS THAN (UNIX_TIMESTAMP('2025-03-01')),
    PARTITION p_2025_03 VALUES LESS THAN (UNIX_TIMESTAMP('2025-04-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- 9. Rate limits table (prevent abuse)
CREATE TABLE rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(100) NOT NULL,
    counter INT NOT NULL DEFAULT 1,
    last_reset_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Indexes
    UNIQUE INDEX idx_user_unique (user),
    INDEX idx_last_reset (last_reset_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Audit log table (chain of custody, compliance)
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - change in production!)
INSERT INTO users (username, email, password_hash, role, status) VALUES
('admin', 'admin@tecw.sl', '$2b$10$YourHashedPasswordHere', 'admin', 'active'),
('moderator1', 'mod1@tecw.sl', '$2b$10$YourHashedPasswordHere', 'moderator', 'active'),
('analyst1', 'analyst@tecw.sl', '$2b$10$YourHashedPasswordHere', 'analyst', 'active');

-- Insert sample system metrics
INSERT INTO system_metrics (metric_name, metric_value) VALUES
('total_verifications', 0),
('total_reports', 0),
('active_users', 0),
('queue_depth', 0),
('accuracy_rate', 92.4),
('avg_response_time', 18.3);

-- Insert sample verifications for testing
INSERT INTO verifications (whatsapp_user_id, message_content, verdict, confidence, reasoning, evidence_hash, processed_at) VALUES
('+23276123456', 'Government giving Le500,000 to all citizens', 'FALSE', 0.920, 
 '["No official government announcement found", "Similar scam debunked by BBC News"]',
 'a3f5b8c9d1e2f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', NOW()),
('+23277987654', 'President Bio attended UN General Assembly', 'TRUE', 0.950,
 '["Confirmed by State House press release", "Multiple credible news sources"]',
 'b4g6c9d2e3f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', NOW()),
('+23278555444', 'Ebola outbreak in Freetown', 'FALSE', 0.880,
 '["No announcement from Ministry of Health", "WHO reports no cases since 2016"]',
 'c5h7d0e4f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', NOW());

-- Create views for common queries
CREATE VIEW v_pending_moderation AS
SELECT 
    mq.id,
    mq.verification_id,
    v.message_content,
    v.verdict,
    v.confidence,
    mq.status,
    mq.created_at,
    u.username as assigned_moderator
FROM moderation_queue mq
JOIN verifications v ON mq.verification_id = v.id
LEFT JOIN users u ON mq.assigned_to = u.id
WHERE mq.status IN ('pending', 'in_progress')
ORDER BY mq.created_at ASC;

CREATE VIEW v_recent_reports AS
SELECT 
    sr.case_id,
    sr.category,
    sr.risk_score,
    sr.status,
    sr.created_at,
    COUNT(a.id) as attachment_count
FROM scam_reports sr
LEFT JOIN attachments a ON a.verification_id = sr.id
GROUP BY sr.id
ORDER BY sr.created_at DESC
LIMIT 100;

-- Create stored procedure for updating metrics
DELIMITER //
CREATE PROCEDURE update_system_metrics()
BEGIN
    -- Update total verifications
    UPDATE system_metrics 
    SET metric_value = (SELECT COUNT(*) FROM verifications)
    WHERE metric_name = 'total_verifications';
    
    -- Update total reports
    UPDATE system_metrics 
    SET metric_value = (SELECT COUNT(*) FROM scam_reports)
    WHERE metric_name = 'total_reports';
    
    -- Update queue depth
    UPDATE system_metrics 
    SET metric_value = (SELECT COUNT(*) FROM moderation_queue WHERE status = 'pending')
    WHERE metric_name = 'queue_depth';
    
    -- Update active users (unique WhatsApp users in last 24 hours)
    UPDATE system_metrics 
    SET metric_value = (
        SELECT COUNT(DISTINCT whatsapp_user_id) 
        FROM verifications 
        WHERE processed_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    )
    WHERE metric_name = 'active_users';
END //
DELIMITER ;

-- Grant privileges (adjust for production)
-- GRANT ALL PRIVILEGES ON tecw_db.* TO 'tecw_user'@'localhost' IDENTIFIED BY 'secure_password';
-- FLUSH PRIVILEGES;

-- Optimization notes:
-- 1. All tables use InnoDB for ACID compliance and foreign key support
-- 2. Indexes created on frequently queried columns (verdict, confidence, case_id)
-- 3. Full-text indexes on message_content and description for search
-- 4. api_logs table partitioned by month for efficient pruning
-- 5. UTF-8mb4 for multilingual support (Krio, English, Temne, Mende)
-- 6. JSON columns for flexible metadata storage
-- 7. Views for common dashboard queries
-- 8. Stored procedure for batch metric updates
