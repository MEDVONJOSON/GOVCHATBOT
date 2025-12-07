-- TECW Database Schema for Supabase (PostgreSQL)
-- Simple, clean, and easy to work with

-- 1. Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Verifications table
CREATE TABLE verifications (
  id BIGSERIAL PRIMARY KEY,
  verification_id VARCHAR(50) UNIQUE NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  message_text TEXT,
  message_type VARCHAR(20),
  verdict VARCHAR(20),
  confidence DECIMAL(3,2),
  reasoning JSONB,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_verdict (verdict),
  INDEX idx_user_phone (user_phone),
  INDEX idx_created_at (created_at)
);

-- 3. Reports (Scam reports)
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  case_id VARCHAR(50) UNIQUE NOT NULL,
  victim_phone VARCHAR(20) NOT NULL,
  incident_type VARCHAR(50),
  description TEXT,
  amount_lost BIGINT,
  evidence JSONB,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_status (status),
  INDEX idx_incident_type (incident_type)
);

-- 4. Moderation queue
CREATE TABLE moderation_queue (
  id BIGSERIAL PRIMARY KEY,
  verification_id VARCHAR(50) NOT NULL,
  user_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  assigned_to VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_status (status)
);

-- 5. System metrics (simple stats)
CREATE TABLE system_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_name VARCHAR(50) NOT NULL,
  metric_value BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial metrics
INSERT INTO system_metrics (metric_name, metric_value) VALUES
  ('total_verifications', 0),
  ('total_reports', 0),
  ('total_users', 0),
  ('verifications_today', 0),
  ('reports_today', 0);
