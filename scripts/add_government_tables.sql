-- Government-specific tables for TECW system

-- Broadcasts table for emergency alerts
CREATE TABLE IF NOT EXISTS broadcasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broadcast_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  channels TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  recipients_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_created ON broadcasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcasts_urgency ON broadcasts(urgency);

-- Threats table for threat intelligence
CREATE TABLE IF NOT EXISTS threats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  threat_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  first_seen TEXT NOT NULL,
  last_seen TEXT,
  victim_count INTEGER DEFAULT 0,
  financial_loss INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_regions TEXT,
  indicators TEXT,
  mitigation TEXT
);

CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_status ON threats(status);
CREATE INDEX IF NOT EXISTS idx_threats_first_seen ON threats(first_seen DESC);

-- Legal cases table for prosecution tracking
CREATE TABLE IF NOT EXISTS legal_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id TEXT UNIQUE NOT NULL,
  suspect_name TEXT,
  charges TEXT NOT NULL,
  amount_involved INTEGER,
  victim_count INTEGER,
  status TEXT NOT NULL,
  court TEXT,
  next_hearing TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  evidence_ids TEXT
);

CREATE INDEX IF NOT EXISTS idx_legal_cases_status ON legal_cases(status);
CREATE INDEX IF NOT EXISTS idx_legal_cases_created ON legal_cases(created_at DESC);

-- Agency coordination table
CREATE TABLE IF NOT EXISTS agency_coordination (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coordination_id TEXT UNIQUE NOT NULL,
  case_id TEXT NOT NULL,
  agencies TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE INDEX IF NOT EXISTS idx_coordination_case ON agency_coordination(case_id);
CREATE INDEX IF NOT EXISTS idx_coordination_status ON agency_coordination(status);

-- Official statements table
CREATE TABLE IF NOT EXISTS official_statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  statement_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TEXT NOT NULL,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  related_verification_id TEXT,
  status TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_statements_published ON official_statements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_statements_category ON official_statements(category);

-- Insert sample data for threats
INSERT OR IGNORE INTO threats (threat_id, type, severity, first_seen, victim_count, financial_loss, status, description, affected_regions) VALUES
('THR-2025-0089', 'MOBILE_MONEY_FRAUD', 'CRITICAL', '2025-01-14', 1240, 248000000, 'ACTIVE', 'Fake Orange Money SMS claiming account suspension', '["Western Area Urban", "Western Area Rural"]'),
('THR-2025-0076', 'GOVERNMENT_IMPERSONATION', 'HIGH', '2025-01-10', 890, 156000000, 'CONTAINED', 'Scammers claiming to be from State House offering jobs', '["Nationwide"]'),
('THR-2025-0065', 'HEALTH_MISINFORMATION', 'HIGH', '2025-01-08', 3200, 0, 'ACTIVE', 'False claims about Ebola outbreak in Freetown', '["Western Area"]');

-- Insert sample legal cases
INSERT OR IGNORE INTO legal_cases (case_id, suspect_name, charges, amount_involved, victim_count, status, court, next_hearing, created_at, updated_at) VALUES
('LEGAL-2025-0034', 'John Doe (alias)', 'Cyber Fraud, Impersonation', 45000000, 67, 'PROSECUTION', 'High Court Freetown', '2025-02-10', '2025-01-05', '2025-01-15'),
('LEGAL-2025-0028', 'Jane Smith (alias)', 'Mobile Money Fraud', 23000000, 34, 'INVESTIGATION', 'N/A', 'N/A', '2025-01-10', '2025-01-15');

-- Insert sample official statements
INSERT OR IGNORE INTO official_statements (statement_id, title, content, category, published_at, author, views, status) VALUES
('STMT-2025-0012', 'False Ebola Claims Debunked', 'The Ministry of Health confirms no Ebola outbreak in Freetown. Citizens should ignore false messages circulating on social media.', 'Health', '2025-01-15', 'Ministry of Health', 45000, 'PUBLISHED'),
('STMT-2025-0011', 'Mobile Money Fraud Alert', 'Citizens should ignore messages claiming government cash handouts. No such program exists. Report suspicious messages to TECW.', 'Financial', '2025-01-14', 'Bank of Sierra Leone', 67000, 'PUBLISHED');
