# TECW MySQL Database Setup Guide

## Quick Start with Docker

1. **Start all services** (MySQL + PHPMyAdmin + Backend):
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Access PHPMyAdmin**:
   - URL: http://localhost:8080
   - Username: `tecw_user`
   - Password: `tecw_password`
   - Database: `tecw_db`

3. **Access Backend API**:
   - URL: http://localhost:3001
   - Health check: http://localhost:3001/api/stats

## Manual Setup (Without Docker)

### 1. Install MySQL
\`\`\`bash
# Ubuntu/Debian
sudo apt-get install mysql-server

# macOS
brew install mysql
\`\`\`

### 2. Create Database and User
\`\`\`bash
mysql -u root -p
\`\`\`

\`\`\`sql
CREATE DATABASE tecw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tecw_user'@'localhost' IDENTIFIED BY 'tecw_password';
GRANT ALL PRIVILEGES ON tecw_db.* TO 'tecw_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
\`\`\`

### 3. Import Schema
\`\`\`bash
mysql -u tecw_user -p tecw_db < scripts/mysql_schema.sql
\`\`\`

### 4. Configure Backend
\`\`\`bash
cp .env.example .env
# Edit .env with your MySQL credentials
\`\`\`

### 5. Install Dependencies and Start Backend
\`\`\`bash
npm install
npm install mysql2
npm run backend
\`\`\`

## Database Optimization Features

### Indexes
- **Verdict & Confidence**: Fast filtering of verification results
- **Case ID**: Quick case lookups
- **Timestamps**: Efficient time-range queries
- **Full-text Search**: Search message content and descriptions

### Partitioning
- **api_logs table**: Partitioned by month for efficient data pruning
- Automatically manages old logs without performance impact

### Multilingual Support
- UTF-8mb4 character set supports English, Krio, Temne, Mende, Arabic, emojis
- All text fields properly configured for international characters

### Performance Features
- InnoDB engine for ACID compliance
- Connection pooling (10 connections)
- Prepared statements to prevent SQL injection
- Indexed foreign keys for join performance

## Accessing PHPMyAdmin

1. Navigate to http://localhost:8080
2. Login credentials:
   - Server: `mysql`
   - Username: `tecw_user`
   - Password: `tecw_password`

3. Features available:
   - Browse all tables and data
   - Run SQL queries
   - Export data (CSV, JSON, SQL)
   - View table structure and indexes
   - Monitor database performance

## Database Views

Two views are pre-created for common queries:

### v_pending_moderation
Shows all cases awaiting moderator review with full context.

\`\`\`sql
SELECT * FROM v_pending_moderation;
\`\`\`

### v_recent_reports
Shows last 100 scam reports with attachment counts.

\`\`\`sql
SELECT * FROM v_recent_reports;
\`\`\`

## Stored Procedures

### update_system_metrics()
Updates all dashboard metrics in one call.

\`\`\`sql
CALL update_system_metrics();
\`\`\`

This procedure automatically:
- Counts total verifications
- Counts total reports
- Calculates queue depth
- Counts active users (last 24h)

## Backup and Restore

### Backup
\`\`\`bash
mysqldump -u tecw_user -p tecw_db > backup_$(date +%Y%m%d).sql
\`\`\`

### Restore
\`\`\`bash
mysql -u tecw_user -p tecw_db < backup_20250615.sql
\`\`\`

## Security Notes

**IMPORTANT for Production**:
1. Change default passwords in `.env`
2. Use strong passwords (16+ characters)
3. Restrict PHPMyAdmin access (disable in production)
4. Enable MySQL SSL connections
5. Regular backups to secure location
6. Update stored admin passwords (currently using sample hash)

## Troubleshooting

### Connection refused
- Check MySQL is running: `systemctl status mysql`
- Verify port 3306 is open: `netstat -an | grep 3306`

### Authentication failed
- Confirm credentials in `.env` match database user
- Check MySQL user privileges: `SHOW GRANTS FOR 'tecw_user'@'localhost';`

### PHPMyAdmin not loading
- Check Docker container: `docker ps`
- View logs: `docker logs tecw_phpmyadmin`

### Slow queries
- Check indexes: `SHOW INDEX FROM verifications;`
- Analyze query: `EXPLAIN SELECT ...`
- Consider adding indexes based on query patterns
