-- TECW SQLite Database Schema
-- Simple, single-file database for Truth Engine & Cyber Watchdog

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verification_id TEXT UNIQUE NOT NULL,
    user_phone TEXT NOT NULL,
    content_type TEXT NOT NULL, -- text, image, audio, video
    content_text TEXT,
    media_url TEXT,
    verdict TEXT NOT NULL, -- TRUE, FALSE, MISLEADING, UNVERIFIED
    confidence REAL NOT NULL, -- 0.0 to 1.0
    reasoning TEXT, -- JSON array of reasons
    matched_sources TEXT, -- JSON array of sources
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_phone) REFERENCES users(phone)
);

CREATE INDEX idx_verifications_verdict ON verifications(verdict);
CREATE INDEX idx_verifications_confidence ON verifications(confidence);
CREATE INDEX idx_verifications_created ON verifications(created_at);
CREATE INDEX idx_verifications_user ON verifications(user_phone);

-- Cases (scam reports) table
CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT UNIQUE NOT NULL,
    victim_phone TEXT NOT NULL,
    incident_type TEXT NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    financial_loss_amount INTEGER DEFAULT 0,
    status TEXT DEFAULT 'open', -- open, investigating, closed
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_type ON cases(incident_type);
CREATE INDEX idx_cases_victim ON cases(victim_phone);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_id TEXT UNIQUE NOT NULL,
    case_id TEXT NOT NULL,
    type TEXT NOT NULL, -- image, audio, document, text
    url TEXT,
    description TEXT,
    hash TEXT, -- SHA-256 for chain of custody
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

-- Moderation queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verification_id TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    priority TEXT DEFAULT 'normal', -- urgent, normal, low
    status TEXT DEFAULT 'pending', -- pending, reviewed, escalated
    assigned_moderator TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    FOREIGN KEY (verification_id) REFERENCES verifications(verification_id)
);

CREATE INDEX idx_moderation_status ON moderation_queue(status);
CREATE INDEX idx_moderation_priority ON moderation_queue(priority);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_metrics_time ON system_metrics(recorded_at);

-- Insert sample data for testing
INSERT OR IGNORE INTO users (phone, language) VALUES 
    ('23276123456', 'en'),
    ('23277234567', 'krio'),
    ('23278345678', 'en');

INSERT OR IGNORE INTO verifications (verification_id, user_phone, content_type, content_text, verdict, confidence, reasoning, matched_sources) VALUES
    ('VER-20250615-001', '23276123456', 'text', 'Government giving Le500,000 to all citizens', 'FALSE', 0.92, '["No official announcement", "Similar scam debunked by BBC"]', '[{"url": "https://statehouse.gov.sl", "title": "State House"}]'),
    ('VER-20250615-002', '23277234567', 'text', 'President Bio attended UN General Assembly', 'TRUE', 0.95, '["Confirmed by State House", "UN attendance records match"]', '[{"url": "https://un.org", "title": "UN Official"}]'),
    ('VER-20250615-003', '23278345678', 'text', 'New education policy starting next year', 'UNVERIFIED', 0.45, '["No official source found yet", "Too early to confirm"]', '[]');

INSERT OR IGNORE INTO cases (case_id, victim_phone, incident_type, incident_date, description, financial_loss_amount, status) VALUES
    ('SL-20250615-001', '23276123456', 'mobile_money_fraud', '2025-06-14', 'Fake Orange Money SMS', 500000, 'open'),
    ('SL-20250615-002', '23277234567', 'phishing_link', '2025-06-13', 'Suspicious bank link received', 0, 'investigating');

INSERT OR IGNORE INTO system_metrics (metric_name, metric_value) VALUES
    ('total_verifications', 1245),
    ('total_reports', 87),
    ('avg_response_time', 12.5),
    ('precision_rate', 0.91);
