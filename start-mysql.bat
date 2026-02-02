@echo off
REM Library Manager MySQL Setup using Docker
REM This script starts MySQL in Docker container for development

echo ========================================
echo Library Manager - MySQL Docker Setup
echo ========================================

REM Check if Docker is installed
docker --version > nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo.
echo Starting MySQL container...
echo.

REM Navigate to project root
cd /d "%~dp0"

REM Check if container already exists
docker ps -a --filter "name=library_manager_mysql" --format "{{.Names}}" > nul 2>&1
if errorlevel 0 (
    REM Container exists, check if it's running
    docker ps --filter "name=library_manager_mysql" --format "{{.Names}}" > nul 2>&1
    if errorlevel 1 (
        echo Container exists but not running. Starting it...
        docker start library_manager_mysql
    ) else (
        echo Container is already running!
    )
) else (
    REM Container doesn't exist, create it
    echo Creating new MySQL container...
    docker-compose up -d mysql
)

echo.
echo Waiting for MySQL to be ready...
timeout /t 5

REM Check connection
docker exec library_manager_mysql mysqladmin ping -u root -proot > nul 2>&1
if errorlevel 0 (
    echo.
    echo ========================================
    echo ✓ MySQL is ready!
    echo ========================================
    echo.
    echo Database: library_manager
    echo Host: 127.0.0.1
    echo Port: 3306
    echo Username: root (or library_user)
    echo Password: root (or library_password)
    echo.
    echo Next steps:
    echo 1. Run: cd backend
    echo 2. Run: python setup_mysql.py
    echo 3. Run: python manage.py runserver
    echo.
) else (
    echo Error: MySQL failed to start
    echo Run 'docker logs library_manager_mysql' for more details
    pause
    exit /b 1
)

pause
