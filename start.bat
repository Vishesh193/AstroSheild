@echo off
echo Space Debris Monitoring Project Launcher
echo =======================================
echo 1. Start Frontend Only
echo 2. Start Backend Only
echo 3. Start Both Frontend and Backend
echo 4. Start With Real-time Features Enabled (Enhanced Version)
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Starting Frontend...
    cd space_debris_website\frontend
    start cmd /k npm start
) else if "%choice%"=="2" (
    echo Starting Backend...
    cd space_debris_website\backend
    start cmd /k python app.py
) else if "%choice%"=="3" (
    echo Starting Backend...
    cd space_debris_website\backend
    start cmd /k python app.py
    timeout /t 5
    cd ..\..\
    echo Starting Frontend...
    cd space_debris_website\frontend
    start cmd /k npm start
) else if "%choice%"=="4" (
    echo Starting Enhanced Version with Real-time Features...
    echo Starting Backend with WebSocket support...
    cd space_debris_website\backend
    start cmd /k python app.py --realtime
    timeout /t 5
    cd ..\..\
    echo Starting Frontend...
    cd space_debris_website\frontend
    start cmd /k npm start
    
    echo.
    echo Real-time Features Enabled:
    echo - Live debris tracking
    echo - Collision risk assessment
    echo - 3D visualization
    echo - Space weather monitoring
    echo - Real-time alerts via WebSockets
) else (
    echo Invalid choice. Please run the script again.
)

echo.
echo Frontend URL: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Done! 