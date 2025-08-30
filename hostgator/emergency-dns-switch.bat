@echo off
echo 🚨 Emergency DNS Switch to Hostgator
echo =====================================

echo.
echo ⚠️  WARNING: This is an emergency procedure!
echo    Only use this if Cloud Run is down and you need to switch to Hostgator.
echo.

set /p confirm="Are you sure you want to proceed? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Emergency switch cancelled.
    pause
    exit /b 0
)

echo.
echo 🔄 Starting emergency DNS switch procedure...
echo.

REM Step 1: Deploy latest content to Hostgator
echo 📤 Step 1: Deploying latest content to Hostgator...
call deploy.bat

if %errorlevel% neq 0 (
    echo ❌ Hostgator deployment failed! Cannot proceed with DNS switch.
    pause
    exit /b 1
)

echo.
echo ✅ Hostgator deployment successful!
echo.

REM Step 2: DNS Change Instructions
echo 📋 Step 2: DNS Change Instructions
echo ================================
echo.
echo You need to change your DNS A record for myl.zip:
echo.
echo FROM: Google Cloud Run IP
echo TO:   Hostgator IP
echo.
echo 📍 DNS Change Steps:
echo    1. Login to your domain registrar (Google Domains, etc.)
echo    2. Go to DNS settings for myl.zip
echo    3. Find the A record pointing to Cloud Run
echo    4. Change it to point to your Hostgator IP
echo    5. Save the changes
echo.
echo ⏱️  DNS propagation takes 24-48 hours
echo 🌐 Monitor at: https://www.whatsmydns.net/
echo.

REM Step 3: Verification
echo 📋 Step 3: Verification Checklist
echo ================================
echo.
echo After DNS change, verify:
echo □ Hostgator site loads at your Hostgator URL
echo □ DNS propagation is complete (24-48 hours)
echo □ myl.zip points to Hostgator
echo □ SSL certificate is working
echo □ All pages load correctly
echo.

REM Step 4: Recovery Instructions
echo 📋 Step 4: Recovery Instructions
echo ===============================
echo.
echo When Cloud Run is restored:
echo    1. Deploy latest content to Cloud Run
echo    2. Change DNS A record back to Cloud Run IP
echo    3. Monitor DNS propagation
echo    4. Verify myl.zip points to Cloud Run
echo.

echo 🎯 Emergency DNS switch procedure complete!
echo.
echo 💡 Next steps:
echo    1. Change DNS A record as instructed above
echo    2. Monitor DNS propagation
echo    3. Test myl.zip after propagation
echo    4. Keep Hostgator updated while Cloud Run is down
echo.

pause
