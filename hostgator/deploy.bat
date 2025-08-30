@echo off
echo 🚀 Hostgator Deployment Script
echo ================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if ftp-config.json exists
if not exist "ftp-config.json" (
    echo ❌ ftp-config.json not found. Please create it with your Hostgator credentials.
    echo.
    echo Example:
    echo {
    echo   "host": "your-server.com",
    echo   "username": "your-username",
    echo   "password": "your-password",
    echo   "port": 21,
    echo   "secure": false,
    echo   "localPath": "./src",
    echo   "remotePath": "/public_html"
    echo }
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔄 Starting deployment to Hostgator...
echo.

REM Run the deployment script
node deploy.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🌐 Your site should be live at: https://myl.zip
    echo.
    echo 💡 Next steps:
    echo   1. Test the site at https://myl.zip
    echo   2. Check the setup wizard at https://myl.zip/setup-wizard.html
    echo   3. Monitor for any issues
) else (
    echo.
    echo ❌ Deployment failed!
    echo 📋 Check the error messages above
)

echo.
pause
