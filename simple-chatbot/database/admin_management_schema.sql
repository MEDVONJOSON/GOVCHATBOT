-- Admin Management System - Role Hierarchy Update
USE govchat_db;

-- Update users table to support role hierarchy
ALTER TABLE users 
MODIFY COLUMN role ENUM('user', 'admin', 'super_admin') DEFAULT 'user';

-- Add last_password_change column for security tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_by INT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add foreign key for created_by (who created this admin)
ALTER TABLE users
ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_user_id INT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);

SELECT 'Admin management schema updated successfully!' AS message;
