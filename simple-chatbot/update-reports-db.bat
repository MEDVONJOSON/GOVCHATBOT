@echo off
echo Updating database schema for Report Scam feature...
echo.

cd /d "%~dp0"

mysql -u root govchat_db < database\update_schema_reports.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database updated successfully!
    echo.
) else (
    echo.
    echo ❌ Database update failed. Please check your MySQL credentials.
    echo.
)

pause
