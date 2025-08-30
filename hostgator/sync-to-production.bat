@echo off
echo 🔄 Sync Staging to Production
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

echo 🔄 Syncing staging (stage.myl.zip) to production (myl.zip)...
echo 📝 This will commit and push changes to trigger Cloud Run deployment
echo.

REM Check if we're in a git repository
git status >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Not in a git repository. Please run this from the zip-myl-www directory.
    pause
    exit /b 1
)

REM Check for changes
git status --porcelain > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="" (
    echo ℹ️  No changes detected. Everything is up to date.
    echo 💡 Staging and production are already in sync.
    pause
    exit /b 0
)

echo 📋 Changes detected:
git status --porcelain

REM Add all changes
echo 📦 Adding changes to git...
git add .

REM Commit changes
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%T%HH%:%Min%:%Sec%"
set "commitMessage=Sync from staging - %timestamp%"
echo 💾 Committing changes: %commitMessage%
git commit -m "%commitMessage%"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Sync to production completed successfully!
    echo 🌐 Cloud Run will automatically deploy the changes.
    echo ⏱️  Deployment typically takes 2-5 minutes.
    echo.
    echo 📊 Monitor deployment at:
    echo    https://console.cloud.google.com/run
    echo.
    echo 🌐 Production will be available at:
    echo    https://myl.zip
) else (
    echo.
    echo ❌ Sync to production failed!
    echo 📋 Check the error messages above
)

echo.
pause
