# TECW SQLite Setup Guide

## Overview
The TECW system now uses **SQLite** - a simple, file-based database that requires zero configuration. Perfect for development and easy to deploy anywhere including Antygravity.

## Quick Start

### 1. Initialize Database

The database will be automatically created when you first run the app. It will be located at:
\`\`\`
database/tecw.db
\`\`\`

### 2. Run the Application

\`\`\`bash
npm install
npm run dev
\`\`\`

The database schema will be automatically initialized with sample data on first run.

### 3. Access the Dashboard

Open http://localhost:3000 to see:
- Real-time verification statistics
- Recent verifications list
- System metrics charts
- Moderation queue

## Database Location

\`\`\`
project/
├── database/
│   ├── schema.sql          # Database schema
│   └── tecw.db            # SQLite database file (auto-created)
├── lib/
│   ├── db.ts              # Database connection & operations
│   └── db-operations.ts   # Higher-level DB functions
└── app/
    └── api/               # API routes using SQLite
\`\`\`

## Features

### Automatic Schema Initialization
- Creates all tables on first run
- Adds sample data for testing
- No manual SQL execution needed

### Simple API
\`\`\`typescript
import { dbOperations } from '@/lib/db'

// Get stats
const stats = dbOperations.getStats()

// Get recent verifications
const verifications = dbOperations.getRecentVerifications(10)

// Create new verification
dbOperations.createVerification({...})
\`\`\`

### Zero Configuration
- No connection strings
- No environment variables required
- Just works out of the box

## For Production (Antygravity)

When deploying to Antygravity:

1. **Include the database file** in your deployment
2. **Set file permissions** (read/write for app)
3. **Backup regularly** using:
   \`\`\`bash
   cp database/tecw.db database/tecw_backup_$(date +%Y%m%d).db
   \`\`\`

## Advantages of SQLite

- **Zero setup**: No server, no configuration
- **Single file**: Easy to backup and move
- **Fast**: Perfect for small to medium workloads
- **Reliable**: Battle-tested, used by millions of apps
- **Portable**: Works on any platform (Windows, Mac, Linux, Antygravity)

## Database Schema

The database includes these tables:
- `users` - User accounts and language preferences
- `verifications` - All claim verifications with verdicts
- `cases` - Scam reports submitted to authorities
- `evidence` - Media evidence attached to cases
- `moderation_queue` - Items pending human review
- `system_metrics` - Performance and usage statistics

## Viewing Data

You can use any SQLite browser to view the data:
- **DB Browser for SQLite** (free, cross-platform)
- **VS Code SQLite extension**
- **Command line**: `sqlite3 database/tecw.db`

Example queries:
\`\`\`sql
-- View all verifications
SELECT * FROM verifications ORDER BY created_at DESC LIMIT 10;

-- Count by verdict
SELECT verdict, COUNT(*) FROM verifications GROUP BY verdict;

-- Get moderation queue
SELECT * FROM moderation_queue WHERE status = 'pending';
\`\`\`

## Troubleshooting

**Database locked error?**
- Only one process can write at a time
- Make sure only one instance of the app is running

**Permission denied?**
- Ensure the database/ directory has write permissions
- Check file ownership

**Database not found?**
- The database is created automatically on first run
- Check that lib/db.ts can find the correct path

## Next Steps

1. Connect WhatsApp Business API for real messages
2. Add AI verification service
3. Enable SMS notifications
4. Deploy to Antygravity with confidence
