@echo off
echo 🔄 Sync Cloud Run to Hostgator
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

echo 🔄 Syncing Cloud Run changes to Hostgator...
echo 📝 This will pull latest changes and deploy to Hostgator
echo.

REM Pull latest changes from GitHub
echo 📥 Pulling latest changes from GitHub...
git pull origin main

if %errorlevel% neq 0 (
    echo ❌ Failed to pull latest changes!
    pause
    exit /b 1
)

echo ✅ Latest changes pulled successfully!
echo.

REM Deploy to Hostgator
echo 📤 Deploying to Hostgator...
cd hostgator
call deploy.bat

if %errorlevel% equ 0 (
    echo.
    echo ✅ Sync to Hostgator completed successfully!
    echo 🌐 Hostgator now has the latest content from Cloud Run
    echo 💡 Hostgator is ready for emergency DNS switch if needed
) else (
    echo.
    echo ❌ Sync to Hostgator failed!
    echo 📋 Check the error messages above
)

echo.
pause
