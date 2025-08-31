@echo off
echo ========================================
echo STARTING GREEN HYDROGEN REGISTRY
echo ========================================

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d 'd:\Hackout 2025\GreenChain_JD\GreenChain\backend' && node src/index.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d 'd:\Hackout 2025\GreenChain_JD\GreenChain\frontend' && npm start"

echo.
echo ========================================
echo SERVERS STARTING...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Wait 10 seconds then open: http://localhost:3000
pause
