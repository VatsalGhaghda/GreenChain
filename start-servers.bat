@echo off
echo Starting Green Hydrogen Credit Registry...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 3

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause
