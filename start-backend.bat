@echo off
echo ========================================
echo STARTING BACKEND SERVER ON PORT 3001
echo ========================================
cd /d "d:\Hackout 2025\GreenChain_JD\GreenChain\backend"
echo Installing dependencies...
call npm install
echo.
echo Starting server...
node src/index.js
pause
