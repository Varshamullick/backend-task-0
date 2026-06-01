@echo off
setlocal enabledelayedexpansion

REM Colors for output
REM This is a simplified version for Windows batch

echo Starting Scalable API Setup...
echo.

REM Check for Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    exit /b 1
)
echo [OK] Node.js is installed
echo.

REM Setup Backend
echo Setting up Backend...
cd backend
if not exist .env copy .env.example .env
call npm install
echo [OK] Backend setup complete
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\frontend
if not exist .env copy .env.example .env
call npm install
echo [OK] Frontend setup complete
echo.

echo [OK] Setup complete!
echo.
echo To start the application:
echo   1. Terminal 1 (MongoDB): mongod
echo   2. Terminal 2 (Backend): cd backend ^&^& npm run dev
echo   3. Terminal 3 (Frontend): cd frontend ^&^& npm start
echo.
echo Or use Docker: docker-compose up -d
