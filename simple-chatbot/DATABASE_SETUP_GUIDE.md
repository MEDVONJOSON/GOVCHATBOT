# Database Setup Guide - Sierra Leone GovChat

## Method 1: Using phpMyAdmin (Easiest)

1. **Open phpMyAdmin**
   - If you have XAMPP: Go to http://localhost/phpmyadmin
   - Or open phpMyAdmin from your MySQL installation

2. **Import the Database**
   - Click on "Import" tab at the top
   - Click "Choose File" and select: `database/schema.sql`
   - Click "Go" at the bottom
   - Done! ✅

## Method 2: Using MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your local MySQL server**
3. **File → Run SQL Script**
4. **Select:** `database/schema.sql`
5. **Click "Run"**
6. Done! ✅

## Method 3: Command Line (If MySQL is in PATH)

Open Command Prompt (not PowerShell) and run:
```cmd
cd "C:\Users\medvo\Desktop\GOV-AI CHATBOX\simple-chatbot"
mysql -u root -p < database\schema.sql
```
Enter your MySQL password when prompted.

## Verify Setup

After running any method above, check if it worked:

1. **Restart the backend server:**
   - Stop the current server (Ctrl+C in the terminal)
   - Run: `node backend-server.js`
   
2. **You should see:**
   ```
   ✅ Database connected successfully!
   ✅ Backend server running on http://localhost:5000
   ```

3. **Test the system:**
   - Go to http://localhost:3000/register
   - Create a new account
   - Try logging in at http://localhost:3000/login

## Troubleshooting

**"Database connection failed"**
- Make sure MySQL is running
- Check your `.env` file has correct MySQL password
- Default is no password (empty string)

**"Table doesn't exist"**
- The SQL import didn't work
- Try a different method above

**Need help?**
- Check if MySQL is running in Task Manager
- Try restarting MySQL service
- Make sure you're using the correct MySQL user (usually 'root')

## What Gets Created

- **Database:** `govchat_db`
- **Tables:** 
  - `users` (for authentication)
  - `chat_history` (for storing conversations)
  - `scam_reports` (for reporting threats)
  - `verified_info` (for official government data)
- **Default Admin:** admin@gov.sl / admin123
