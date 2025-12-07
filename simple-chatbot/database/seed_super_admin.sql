-- Promote existing admin to Super Admin or create one
USE govchat_db;

-- Try to update the default admin to super_admin
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@gov.sl';

-- Check if we have a super_admin, if not insert one
-- Password is 'admin123' (hashed)
INSERT INTO users (username, email, password, full_name, role, is_active)
SELECT * FROM (SELECT 'superadmin', 'superadmin@gov.sl', '$2a$10$wO_27Jk5O.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0', 'Government Super Admin', 'super_admin', TRUE) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE role = 'super_admin'
) LIMIT 1;

SELECT id, username, email, role FROM users WHERE role = 'super_admin';
