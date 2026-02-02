# MySQL Setup Guide for Library Manager

## Status
Currently, MySQL server is not installed or running on your system. This guide will help you set it up.

## Prerequisites Installed
✓ PyMySQL (Python MySQL driver)
✓ python-dotenv (Environment variable loader)
✓ Django configured for MySQL support

## Step 1: Install MySQL Server

### Option A: Using Windows MSI Installer (Recommended)
1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. During installation:
   - Choose "Server Machine" for server type
   - Choose "Standalone MySQL Server / MySQL Router"
   - Accept default port 3306
   - Set root password (remember this!)
   - Configure as Windows Service (recommended)
4. After installation, MySQL will start automatically

### Option B: Using Chocolatey (if elevated privileges available)
```powershell
choco install mysql-server
```

### Option C: Using Docker (Quick Start)
```powershell
docker run -d `
  --name mysql_library `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=library_manager `
  -p 3306:3306 `
  mysql:8.0
```

## Step 2: Configure Environment Variables

The `.env` file in the backend directory contains your database configuration:

```
USE_SQLITE=0
DB_NAME=library_manager
DB_USER=root
DB_PASSWORD=root
DB_HOST=127.0.0.1
DB_PORT=3306
```

**Update these values if you used different settings during MySQL installation**

## Step 3: Run Setup Script

Once MySQL is running:

```powershell
cd C:\Users\praja\Desktop\pyProject\Python-Project\backend
C:/Users/praja/Desktop/pyProject/.venv/Scripts/python.exe setup_mysql.py
```

This script will:
1. ✓ Connect to MySQL server
2. ✓ Create the `library_manager` database
3. ✓ Run all Django migrations
4. ✓ Set up all tables and schemas

## Step 4: Verify MySQL Connection

Test the connection manually:

```powershell
# In the backend directory
C:/Users/praja/Desktop/pyProject/.venv/Scripts/python.exe manage.py dbshell
```

This should open a MySQL prompt if connection is successful.

## Step 5: Start the Server

```powershell
python manage.py runserver
```

Your API will now use MySQL instead of SQLite!

## Troubleshooting

### "Can't connect to MySQL server"
- Check if MySQL is running:
  - Windows Task Manager → Services → MySQL80
  - Or run: `mysql -u root -p` (if MySQL is in PATH)

### "Access denied for user 'root'"
- Wrong password in .env file
- Reset MySQL root password: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html

### "Database doesn't exist"
- Run `setup_mysql.py` again
- Or manually create it in MySQL:
  ```sql
  CREATE DATABASE library_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### "Port 3306 already in use"
- Another MySQL instance is running
- Change DB_PORT in .env to an available port (e.g., 3307)

## Migrating Data from SQLite

If you have existing data in SQLite and want to transfer it to MySQL:

```powershell
# Dump SQLite data
python manage.py dumpdata > data.json

# Switch to MySQL (update .env)
# Run setup_mysql.py

# Load data into MySQL
python manage.py loaddata data.json
```

## Benefits of Using MySQL

✓ Better for production environments
✓ Supports larger datasets
✓ Better concurrent access handling
✓ Enhanced security features
✓ Enterprise-grade reliability
✓ Scalability for multiple servers
✓ Full-text search capabilities

## Next Steps

1. Install MySQL server
2. Update .env if needed (usually default credentials work)
3. Run `setup_mysql.py`
4. Restart Django development server
5. Test API endpoints

## Quick Reference Commands

```powershell
# Check MySQL is running
Get-Service | findstr MySQL

# Start MySQL service
Start-Service MySQL80

# Stop MySQL service
Stop-Service MySQL80

# Check database connection
python manage.py dbshell

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## Environment File (.env)

Location: `C:\Users\praja\Desktop\pyProject\Python-Project\backend\.env`

Edit to match your MySQL installation:
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_HOST`: MySQL host (default: 127.0.0.1 for local)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_NAME`: Database name to create/use (default: library_manager)

## More Information

- MySQL Documentation: https://dev.mysql.com/doc/
- Django MySQL Support: https://docs.djangoproject.com/en/6.0/ref/databases/#mysql-notes
- PyMySQL: https://github.com/PyMySQL/PyMySQL
