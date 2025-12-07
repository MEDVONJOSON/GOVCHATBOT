-- TECW Database Schema for PostgreSQL
-- Truth Engine & Cyber Watchdog - Sierra Leone

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    country_code VARCHAR(5) DEFAULT '+232',
    language VARCHAR(10) DEFAULT 'en',
    consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_active ON users(last_active);

-- Verifications table
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    verification_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    content_type VARCHAR(20) NOT NULL, -- text, image, audio, video
    content_text TEXT,
    content_url TEXT,
    verdict VARCHAR(20) NOT NULL, -- TRUE, FALSE, MISLEADING, UNVERIFIED
    confidence DECIMAL(3,2) NOT NULL,
    reasoning JSONB,
    matched_sources JSONB,
    forensics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER,
    review_timestamp TIMESTAMP,
    review_notes TEXT
);

CREATE INDEX idx_verifications_user ON verifications(user_id);
CREATE INDEX idx_verifications_verdict ON verifications(verdict);
CREATE INDEX idx_verifications_created ON verifications(created_at DESC);

-- Cases/Reports table
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    incident_type VARCHAR(50) NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    financial_loss BOOLEAN DEFAULT FALSE,
    amount_le BIGINT,
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open', -- open, investigating, closed
    assigned_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE INDEX idx_cases_user ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_type ON cases(incident_type);

-- Suspects table
CREATE TABLE suspects (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id),
    phone_number VARCHAR(20),
    role VARCHAR(50),
    notes TEXT
);

-- Evidence table
CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id),
    verification_id INTEGER REFERENCES verifications(id),
    evidence_type VARCHAR(20), -- image, audio, text, document
    file_url TEXT,
    file_hash VARCHAR(64) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chain_of_custody JSONB
);

CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_evidence_hash ON evidence(file_hash);

-- Moderation queue table
CREATE TABLE moderation_queue (
    id SERIAL PRIMARY KEY,
    verification_id INTEGER REFERENCES verifications(id),
    priority VARCHAR(20) DEFAULT 'normal', -- urgent, normal, low
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
    assigned_to INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimed_at TIMESTAMP,
    completed_at TIMESTAMP,
    sla_target TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_moderation_status ON moderation_queue(status);
CREATE INDEX idx_moderation_priority ON moderation_queue(priority, created_at);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Rate limiting table
CREATE TABLE rate_limits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP NOT NULL,
    window_end TIMESTAMP NOT NULL,
    blocked_until TIMESTAMP
);

CREATE INDEX idx_ratelimit_user_action ON rate_limits(user_id, action_type);

-- System metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    metric_labels JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_name_time ON metrics(metric_name, recorded_at DESC);

-- Insert sample data for testing
INSERT INTO users (phone_number, language, consent_given, consent_timestamp) VALUES
('+23276123456', 'en', TRUE, NOW()),
('+23277987654', 'krio', TRUE, NOW()),
('+23278555444', 'en', TRUE, NOW());
