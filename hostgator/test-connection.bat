@echo off
echo 🔌 Hostgator Connection Test
echo ============================

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
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔌 Testing connection to Hostgator...
echo.

REM Run the test script
node test-connection.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Connection test successful!
    echo 💡 You can now deploy your site using deploy.bat
) else (
    echo.
    echo ❌ Connection test failed!
    echo 📋 Check the error messages above
)

echo.
pause
