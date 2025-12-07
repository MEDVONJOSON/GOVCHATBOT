-- Update scam_reports table for enhanced Report Scam feature
USE govchat_db;

-- Add new columns
ALTER TABLE scam_reports
ADD COLUMN IF NOT EXISTS case_reference_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS scammer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS scammer_account VARCHAR(255),
ADD COLUMN IF NOT EXISTS platform VARCHAR(100),
ADD COLUMN IF NOT EXISTS incident_date DATE,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reporter_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS reporter_contact VARCHAR(255);

-- Modify report_type ENUM to include new categories
ALTER TABLE scam_reports
MODIFY COLUMN report_type ENUM(
    'phishing',
    'fraud',
    'misinformation',
    'other',
    'fake_lottery',
    'identity_theft',
    'mobile_money_fraud',
    'romance_scam',
    'social_media_impersonation'
) NOT NULL;

-- Add index for case_reference_id
CREATE INDEX IF NOT EXISTS idx_case_reference ON scam_reports(case_reference_id);

SELECT 'Scam reports table updated successfully!' AS message;
