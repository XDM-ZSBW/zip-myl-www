@echo off
echo 🔄 Sync Hostgator to Cloud Run
echo ===============================

REM Check if we're in the right directory
if not exist "..\src" (
    echo ❌ Please run this script from the hostgator directory.
    echo 📁 Expected structure: zip-myl-www/hostgator/
    pause
    exit /b 1
)

REM Change to parent directory (zip-myl-www)
cd ..

REM Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo 🔄 Syncing Hostgator changes to Google Cloud Run...
echo 📝 This will commit and push changes to trigger Cloud Run deployment
echo.

REM Run the sync script
node hostgator/sync-to-cloud.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Sync completed successfully!
    echo 🌐 Cloud Run will automatically deploy the changes.
    echo ⏱️  Deployment typically takes 2-5 minutes.
) else (
    echo.
    echo ❌ Sync failed!
    echo 📋 Check the error messages above
)

echo.
pause
