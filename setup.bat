@echo off
echo Space Debris Monitoring Project Setup
echo ====================================
echo This script will install all necessary dependencies for the project.
echo.

echo Step 1: Installing Python dependencies for backend...
cd space_debris_website\backend
pip install -r requirements.txt
echo Installing additional backend dependencies...
pip install flask-socketio==5.3.0 pyjwt==2.4.0 tensorflow==2.8.0 redis==4.3.4 celery==5.2.7 prometheus-client==0.14.1
echo.

echo Step 2: Installing Node.js dependencies for frontend...
cd ..\..\space_debris_website\frontend
npm install
echo Installing additional frontend dependencies...
npm install three socket.io-client d3 jwt-decode
echo.

echo Step 3: Creating required directories...
mkdir -p ..\frontend\public\static\images
mkdir -p ..\frontend\public\education\tutorials
mkdir -p ..\frontend\public\education\case_studies
echo.

echo Setup complete! You can now run the project using start.bat
echo The enhanced version includes:
echo - Real-time debris tracking and alerts
echo - 3D visualization capabilities
echo - Authentication and user management
echo - Space weather monitoring
echo - Educational resources and case studies
echo.