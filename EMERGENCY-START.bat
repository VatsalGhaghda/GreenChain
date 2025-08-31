@echo off
title Green Hydrogen Registry - Emergency Start
echo ========================================
echo EMERGENCY HACKATHON STARTUP
echo Time: %time%
echo ========================================

echo [1/3] Starting Backend Server...
start "Backend" cmd /k "cd /d 'd:\Hackout 2025\GreenChain_JD\GreenChain\backend' && echo Backend Starting... && node src/index.js"

echo [2/3] Waiting for backend...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd /d 'd:\Hackout 2025\GreenChain_JD\GreenChain\frontend' && echo Frontend Starting... && npm start"

echo.
echo ========================================
echo SERVERS STARTING IN SEPARATE WINDOWS
echo ========================================
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Wait 10 seconds then open: http://localhost:3000
echo ========================================
pause
