@echo off
REM Quick Start Script for Library Manager

echo.
echo ========================================
echo  Library Manager - Quick Start
echo ========================================
echo.

REM Check if running from correct directory
if not exist "backend" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

echo.
echo 1. Installing Backend Dependencies...
echo.
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    cd ..
    exit /b 1
)

echo.
echo 2. Running Database Migrations...
echo.
python manage.py makemigrations
python manage.py migrate
if errorlevel 1 (
    echo Error: Failed to run migrations
    cd ..
    exit /b 1
)

echo.
echo 3. Backend setup complete!
echo.
cd ..

echo.
echo 4. Installing Frontend Dependencies...
echo.
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    cd ..
    exit /b 1
)

cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend:
echo    cd backend
echo    python manage.py runserver
echo.
echo 2. Start Frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo Backend URL: http://localhost:8000
echo Frontend URL: http://localhost:3000
echo.
echo API Documentation: http://localhost:8000/api/
echo Admin Panel: http://localhost:8000/admin/
echo.
pause
