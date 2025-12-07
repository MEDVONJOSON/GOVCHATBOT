USE govchat_db;

-- Update admin password with proper bcrypt hash for 'admin123'
UPDATE users 
SET password_hash = '$2b$10$tNmBQFs1rZMj83XourHaVOtYlqCjNLgN91hDcQOM/pCj65u3Nq/LG' 
WHERE email = 'admin@gov.sl';

-- If admin doesn't exist, create it
INSERT INTO users (full_name, email, phone, password_hash, role) 
VALUES ('System Administrator', 'admin@gov.sl', '+232 76 000 000', '$2b$10$tNmBQFs1rZMj83XourHaVOtYlqCjNLgN91hDcQOM/pCj65u3Nq/LG', 'admin')
ON DUPLICATE KEY UPDATE password_hash = '$2b$10$tNmBQFs1rZMj83XourHaVOtYlqCjNLgN91hDcQOM/pCj65u3Nq/LG';

SELECT 'Admin account updated successfully!' AS message;
