# MySQL Setup - Quick Reference Card

## TL;DR - Get MySQL Running in 5 Minutes

### For Docker (Easiest)
```powershell
# 1. Run this
cd C:\Users\praja\Desktop\pyProject\Python-Project
.\start-mysql.ps1

# 2. Then run this
cd backend
python setup_mysql.py

# 3. Test it
python manage.py runserver
```

### For Native MySQL
```powershell
# 1. Download MySQL (https://dev.mysql.com/downloads/mysql/)
# 2. Install with default settings
# 3. Run setup
cd C:\Users\praja\Desktop\pyProject\Python-Project\backend
python setup_mysql.py

# 4. Test it
python manage.py runserver
```

## Files You Created

| File | Purpose |
|------|---------|
| `.env` | Database configuration |
| `setup_mysql.py` | One-click setup script |
| `start-mysql.ps1` | Start MySQL (Docker) |
| `start-mysql.bat` | Start MySQL (Batch) |
| `docker-compose.yml` | Docker configuration |
| `MYSQL_INTEGRATION_COMPLETE.md` | Full instructions |

## Environment Configuration

Edit `backend\.env`:
```
USE_SQLITE=0              # 1 = SQLite, 0 = MySQL
DB_NAME=library_manager   # Database name
DB_USER=root             # MySQL username
DB_PASSWORD=root         # MySQL password  
DB_HOST=127.0.0.1       # Localhost
DB_PORT=3306            # Default MySQL port
```

## Before Starting

1. **Backup your SQLite data:**
   ```powershell
   cd backend
   python manage.py dumpdata > backup.json
   ```

2. **Make sure you have either:**
   - Docker Desktop installed, OR
   - MySQL installed with root password set

## Verification Commands

```powershell
# Check database connection
cd backend
python manage.py dbshell

# Count users in database
python manage.py shell -c "from things.models import User; print(f'Users: {User.objects.count()}')"

# Test login endpoint
curl -X POST http://localhost:8000/api/token/ ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"test123\"}"
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't connect" | Make sure MySQL/Docker is running |
| "Access denied" | Check DB_USER and DB_PASSWORD in .env |
| "Port in use" | Change DB_PORT in .env |
| "Database exists" | That's okay, script will use it |
| "Want SQLite back" | Set USE_SQLITE=1 in .env |

## What Gets Migrated

✓ All 4 existing users  
✓ All user roles (CUSTOMER, STAFF)  
✓ All items and data  
✓ All relationships  

## Current Database

**Type**: SQLite  
**File**: `backend/db.sqlite3`  
**Users**: 4 (Deep, user, Sandeep, sandeep)  
**Size**: ~Negligible  

## After Migration

**Type**: MySQL  
**Host**: 127.0.0.1  
**Port**: 3306  
**Users**: Same 4 users + any new ones  

## Important Reminders

⚠️ **Backup first!**
```powershell
python manage.py dumpdata > backup.json
```

⚠️ **Only change one setting at a time**

⚠️ **Make sure MySQL is running before setup_mysql.py**

## Still Using SQLite?

If you haven't run `setup_mysql.py` yet, your app still uses SQLite.  
To migrate, follow the TL;DR steps above.

## Documentation Files

- **MYSQL_INTEGRATION_COMPLETE.md** - Full setup guide
- **MYSQL_SETUP_GUIDE.md** - Detailed instructions
- **MYSQL_MIGRATION.md** - Step-by-step migration
- **LOGIN_ROLE_CHANGES.md** - Previous login changes

## Most Common Commands

```powershell
# Start MySQL (Docker)
C:\Users\praja\Desktop\pyProject\Python-Project\start-mysql.ps1

# Setup database
cd C:\Users\praja\Desktop\pyProject\Python-Project\backend
python setup_mysql.py

# Run server
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Backup data
python manage.py dumpdata > backup.json

# Load data
python manage.py loaddata backup.json
```

## API Testing

After setup, test your API:

**Register:**
```bash
POST /api/register/
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "pass123"
}
```

**Login:**
```bash
POST /api/token/
{
  "username": "newuser",
  "password": "pass123"
}
```

**Get User:**
```bash
GET /api/user/
Header: Authorization: Bearer <access_token>
```

---

**Ready to go!** Follow the TL;DR section above.
