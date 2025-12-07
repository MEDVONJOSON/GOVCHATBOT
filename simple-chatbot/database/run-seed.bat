@echo off
REM Get database credentials
for /f "tokens=1,2 delims==" %%a in ('findstr /r "^DB_" ..\.env') do (
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

echo Promoting admin to Super Admin...
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < seed_super_admin.sql
echo Done.
pause
