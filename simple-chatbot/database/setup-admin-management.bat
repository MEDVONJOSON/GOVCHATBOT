@echo off
echo ========================================
echo Admin Management Schema Setup
echo ========================================
echo.

REM Get database credentials from .env file
for /f "tokens=1,2 delims==" %%a in ('findstr /r "^DB_" ..\.env') do (
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

echo Running admin management schema update...
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < admin_management_schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Admin management schema updated successfully!
) else (
    echo.
    echo ❌ Error updating schema. Please check your database connection.
)

echo.
pause
