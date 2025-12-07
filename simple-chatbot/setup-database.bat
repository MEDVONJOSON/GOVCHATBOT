@echo off
echo ========================================
echo Sierra Leone GovChat - Database Setup
echo ========================================
echo.

echo This script will create the database and tables for GovChat.
echo.
echo Prerequisites:
echo - MySQL must be installed and running
echo - MySQL root password (if set)
echo.

set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if none): "

echo.
echo Creating database and tables...
echo.

if "%MYSQL_PASSWORD%"=="" (
    mysql -u root < database\schema.sql
) else (
    mysql -u root -p%MYSQL_PASSWORD% < database\schema.sql
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ Database setup completed successfully!
    echo ========================================
    echo.
    echo Database: govchat_db
    echo Tables created:
    echo   - users
    echo   - chat_history
    echo   - scam_reports
    echo   - verified_info
    echo.
    echo Default admin account:
    echo   Email: admin@gov.sl
    echo   Password: admin123
    echo   (Please change this password after first login!)
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ Database setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Correct password was entered
    echo 3. MySQL command is in your PATH
    echo.
)

pause
