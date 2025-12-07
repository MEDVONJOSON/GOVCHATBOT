@echo off
echo Setting up Real-time Alerts database...
echo.

cd /d "%~dp0"

mysql -u root govchat_db < database\alerts_schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Alerts database created successfully!
    echo.
) else (
    echo.
    echo ❌ Database setup failed. Please check your MySQL credentials.
    echo.
)

pause
