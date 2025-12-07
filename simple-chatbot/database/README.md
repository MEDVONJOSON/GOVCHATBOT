# Database Setup Instructions
## Sierra Leone Government Chatbot

## Quick Setup (Windows)

### Option 1: Automated Setup (Recommended)
1. Make sure MySQL is running
2. Double-click `setup-database.bat`
3. Enter your MySQL root password when prompted (or press Enter if no password)
4. Done! The database and tables will be created automatically.

### Option 2: Manual Setup
1. Open MySQL command line or phpMyAdmin
2. Run the SQL file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Enter your MySQL password when prompted

## Database Configuration

The database connection settings are in `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=govchat_db
DB_PORT=3306
```

**Important:** If your MySQL has a password, update `DB_PASSWORD` in the `.env` file!

## Default Admin Account

After setup, you can login with:
- **Email:** admin@gov.sl
- **Password:** admin123

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Database Tables

The following tables will be created:

1. **users** - User accounts and authentication
2. **chat_history** - Conversation storage
3. **scam_reports** - Threat reporting system
4. **verified_info** - Official government information

## Testing the Connection

1. Start the backend server:
   ```bash
   node backend-server.js
   ```

2. You should see:
   ```
   ✅ Database connected successfully!
   ✅ Backend server running on http://localhost:5000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Chat (existing)
- `POST /api/chat` - Send message
- `POST /api/clear` - Clear chat
- `GET /api/messages` - Get messages

## Troubleshooting

### "Database connection failed"
- Check if MySQL is running
- Verify credentials in `.env` file
- Make sure database `govchat_db` exists

### "Table doesn't exist"
- Run `setup-database.bat` again
- Or manually run `database/schema.sql`

### "Module not found"
- Run `npm install` in the project directory

## Next Steps

After database setup:
1. Test registration at http://localhost:3000/register
2. Test login at http://localhost:3000/login
3. Verify chat history is being saved
