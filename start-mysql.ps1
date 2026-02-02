#!/usr/bin/env powershell
# Library Manager MySQL Setup using Docker
# This script starts MySQL in Docker container for development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Library Manager - MySQL Docker Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "`n✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "`n✗ Error: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nStarting MySQL container..." -ForegroundColor Yellow

# Navigate to script directory
Set-Location $PSScriptRoot

# Check if container exists and is running
$containerStatus = docker ps --filter "name=library_manager_mysql" --format "{{.Names}}" 2>$null

if ($containerStatus) {
    Write-Host "✓ Container is already running!" -ForegroundColor Green
} else {
    # Check if container exists but is stopped
    $containerExists = docker ps -a --filter "name=library_manager_mysql" --format "{{.Names}}" 2>$null
    
    if ($containerExists) {
        Write-Host "Container exists but not running. Starting it..." -ForegroundColor Yellow
        docker start library_manager_mysql
    } else {
        Write-Host "Creating new MySQL container..." -ForegroundColor Yellow
        docker-compose up -d mysql
    }
}

Write-Host "`nWaiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check connection
$pingResult = docker exec library_manager_mysql mysqladmin ping -u root -proot 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ MySQL is ready!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Configuration:" -ForegroundColor Cyan
    Write-Host "  Database: library_manager"
    Write-Host "  Host: 127.0.0.1"
    Write-Host "  Port: 3306"
    Write-Host "  Username: root (or library_user)"
    Write-Host "  Password: root (or library_password)"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. cd backend"
    Write-Host "  2. python setup_mysql.py"
    Write-Host "  3. python manage.py runserver"
    Write-Host ""
} else {
    Write-Host "`n✗ Error: MySQL failed to start" -ForegroundColor Red
    Write-Host "Run 'docker logs library_manager_mysql' for more details" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"
