"""
MySQL Setup Helper
This script helps set up MySQL database for the Library Manager project
It uses PyMySQL as the database adapter
"""
import os
import sys
import pymysql
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

def create_database():
    """Create the MySQL database if it doesn't exist"""
    print("=" * 60)
    print("Library Manager - MySQL Setup")
    print("=" * 60)
    
    # Get database configuration from environment
    db_host = os.getenv('DB_HOST', '127.0.0.1')
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_name = os.getenv('DB_NAME', 'library_manager')
    db_port = int(os.getenv('DB_PORT', '3306'))
    
    print("\nDatabase Configuration:")
    print(f"  Host: {db_host}")
    print(f"  User: {db_user}")
    print(f"  Port: {db_port}")
    print(f"  Database: {db_name}")
    
    # Try to connect and create database
    print("\nAttempting to connect to MySQL...")
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            port=db_port,
            charset='utf8mb4'
        )
        print("✓ Successfully connected to MySQL server!")
        
        cursor = connection.cursor()
        
        # Create database if not exists
        print(f"\nCreating database '{db_name}' if it doesn't exist...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"✓ Database '{db_name}' is ready!")
        
        cursor.close()
        connection.close()
        
    except pymysql.err.OperationalError as e:
        print(f"✗ Failed to connect to MySQL server:")
        print(f"  Error: {str(e)}")
        print("\nPlease ensure:")
        print("  1. MySQL server is installed and running")
        print("  2. Database credentials are correct in .env file")
        print("  3. MySQL root user password is set correctly")
        return False
    except Exception as e:
        print(f"✗ Unexpected error:")
        print(f"  Error: {str(e)}")
        return False
    
    return True

def run_migrations():
    """Run Django migrations"""
    print("\n" + "=" * 60)
    print("Running Django Migrations")
    print("=" * 60)
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_manager.settings')
    
    import django
    from django.core.management import call_command
    
    try:
        django.setup()
        
        # Run migrations
        print("\nApplying migrations...")
        call_command('migrate', verbosity=2)
        print("\n✓ Migrations completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed:")
        print(f"  Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main setup flow"""
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Check if using MySQL
    use_sqlite = os.getenv('USE_SQLITE', '1') == '1'
    
    if use_sqlite:
        print("=" * 60)
        print("Library Manager - Database Setup")
        print("=" * 60)
        print("\n⚠️  Currently configured to use SQLite!")
        print("\nTo use MySQL, set USE_SQLITE=0 in .env file")
        print("=" * 60)
        return False
    
    # Create database
    if not create_database():
        return False
    
    # Run migrations
    if not run_migrations():
        return False
    
    print("\n" + "=" * 60)
    print("✓ MySQL setup completed successfully!")
    print("=" * 60)
    print("\nYour data is now stored in MySQL database:")
    print(f"  Database: {os.getenv('DB_NAME', 'library_manager')}")
    print(f"  Host: {os.getenv('DB_HOST', '127.0.0.1')}")
    print(f"  Port: {os.getenv('DB_PORT', '3306')}")
    print("=" * 60)
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)

