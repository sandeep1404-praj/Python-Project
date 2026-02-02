# How to Migrate Your Library Manager to MySQL

## Quick Summary

Your application now has full MySQL support configured. Follow the steps below based on your preference:

**Option 1: Use Native MySQL (Recommended for production)**
- Install MySQL Server directly on Windows
- Edit `.env` file with credentials
- Run migration script
- Start the server

**Option 2: Use Docker MySQL (Easiest for development)**
- Install Docker Desktop
- Run our Docker setup script
- Automatic MySQL container creation
- No manual installation needed

**Option 3: Keep SQLite (For now)**
- No changes needed
- Data stays in `db.sqlite3`
- Switch to MySQL later anytime

## Files Created

✓ **backend/.env** - Database configuration file
✓ **MYSQL_SETUP_GUIDE.md** - Detailed MySQL setup guide
✓ **docker-compose.yml** - Docker MySQL configuration
✓ **start-mysql.bat** - Batch script to start MySQL
✓ **start-mysql.ps1** - PowerShell script to start MySQL  
✓ **setup_mysql.py** - Python setup automation script
✓ **init.sql** - Database initialization SQL

## Current Database Status

**Currently: SQLite** (db.sqlite3)
- 4 users in database (Deep, user, Sandeep, sandeep)
- All existing data is safe

**After migration: MySQL**
- Same data moved to MySQL
- Better performance and scalability
- Production-ready

## Step-by-Step Setup

### Step 1: Choose Your Method

#### Method A: Docker (Easiest - Recommended for Development)
```powershell
# Prerequisites: Docker Desktop installed

# Run PowerShell script
C:\Users\praja\Desktop\pyProject\Python-Project\start-mysql.ps1

# Or run batch file
C:\Users\praja\Desktop\pyProject\Python-Project\start-mysql.bat
```

#### Method B: Native MySQL (For Production)
1. Download MySQL: https://dev.mysql.com/downloads/mysql/
2. Install and remember your root password
3. Update `.env` file if needed
4. Continue to Step 2

### Step 2: Configure Environment Variables

Edit the `.env` file in the backend directory:

```ini
# Current settings (if using Docker)
USE_SQLITE=0
DB_NAME=library_manager
DB_USER=root
DB_PASSWORD=root
DB_HOST=127.0.0.1
DB_PORT=3306

# If using different credentials, update above
```

### Step 3: Run the Migration Script

```powershell
cd C:\Users\praja\Desktop\pyProject\Python-Project\backend

# Run setup script
C:/Users/praja/Desktop/pyProject/.venv/Scripts/python.exe setup_mysql.py
```

**This script will:**
- ✓ Create the database
- ✓ Run all migrations
- ✓ Set up all tables and relationships
- ✓ Show success/failure messages

### Step 4: Start the Server

```powershell
cd backend
python manage.py runserver
```

Your API will now use MySQL!

## Backup Your SQLite Data Before Migration

```powershell
cd backend

# Export all data to JSON
python manage.py dumpdata > backup.json

# This creates backup.json with all your data
```

## After Migration - Verify Everything

```powershell
cd backend

# Check database connection
python manage.py dbshell

# List all users in MySQL
python manage.py shell -c "from things.models import User; print([u.username for u in User.objects.all()])"

# Test login endpoint (should work as before)
# curl -X POST http://localhost:8000/api/token/ \
#   -H "Content-Type: application/json" \
#   -d '{"username":"testuser","password":"test123"}'
```

## Troubleshooting

### "Cannot connect to MySQL"
- **Docker Method**: Make sure Docker Desktop is running
- **Native Method**: Make sure MySQL service is running
  - Windows: Services → Look for MySQL80

### "Database already exists"
- This is fine! The migration script will use existing database
- Run migrations anyway

### "Access denied" error
- Check DB_USER and DB_PASSWORD in .env
- Verify MySQL root password was set correctly

### "Port 3306 already in use"
- Change DB_PORT in .env to 3307 or another available port
- Update docker-compose.yml if using Docker

### Want to go back to SQLite?
- Edit `.env`: SET `USE_SQLITE=1`
- Restart Django server
- Your SQLite data will still work

## Database Contents After Migration

All of these will be automatically migrated:

✓ **Users** (4 current users)
- Deep (customer)
- user (customer)
- Sandeep (customer)
- sandeep (staff)

✓ **Items** (shared/borrowed items)
✓ **Inspection Reports** (staff reports)
✓ **Borrow Requests** (customer requests)

## What's Different?

### Performance
- **SQLite**: Slower with concurrent users
- **MySQL**: Fast, handles 1000s of concurrent users

### Storage
- **SQLite**: Single file (db.sqlite3)
- **MySQL**: Server-based database

### Features
- **SQLite**: Basic SQL
- **MySQL**: Advanced features (replication, clustering, etc.)

### Development
- **SQLite**: Zero setup needed
- **MySQL**: Easy setup with our scripts

## File Locations

```
Python-Project/
├── .env                          ← Update with your credentials
├── docker-compose.yml            ← For Docker method
├── start-mysql.bat              ← Run to start Docker MySQL
├── start-mysql.ps1              ← PowerShell version
├── init.sql                     ← Database init script
├── MYSQL_SETUP_GUIDE.md         ← Full guide (this file)
└── backend/
    ├── setup_mysql.py           ← Run this to setup
    ├── manage.py
    ├── db.sqlite3              ← Current SQLite (backup before deleting)
    └── requirements.txt
```

## Important Notes

1. **Backup First**: Your SQLite data is currently in `db.sqlite3`. Consider backing it up before switching.

2. **ENV Variables**: The `.env` file you created will be read automatically.

3. **Migrations**: Django automatically handles all schema creation via `manage.py migrate`.

4. **Data Transfer**: If you need to move SQLite data to MySQL:
   ```powershell
   # Export SQLite
   python manage.py dumpdata > data.json
   
   # Switch to MySQL (update .env)
   
   # Import to MySQL
   python manage.py loaddata data.json
   ```

5. **Production Ready**: Once on MySQL, your database is production-ready!

## Questions?

- MySQL Setup Issues → See MYSQL_SETUP_GUIDE.md
- Database Errors → Check `.env` file
- Connection Issues → Verify MySQL is running
- Docker Issues → Install Docker Desktop first

## Next Steps

1. **Choose your method** (Docker or Native MySQL)
2. **Follow Step 1** (Start MySQL)
3. **Follow Step 2** (Configure .env)
4. **Follow Step 3** (Run setup_mysql.py)
5. **Test** (Login endpoint should work)
6. **Deploy** (Your app is now using MySQL!)

---

Created: February 1, 2026
For: Library Manager System
Database: From SQLite to MySQL Migration Guide
