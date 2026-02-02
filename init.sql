-- Initialize MySQL database for Library Manager
CREATE DATABASE IF NOT EXISTS library_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library_manager;

-- Create a specific user for the application (optional but recommended)
CREATE USER IF NOT EXISTS 'library_user'@'%' IDENTIFIED BY 'library_password';
GRANT ALL PRIVILEGES ON library_manager.* TO 'library_user'@'%';
FLUSH PRIVILEGES;
