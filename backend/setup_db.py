#!/usr/bin/env python
"""
Setup script to create the MySQL database and run migrations
"""
import pymysql
import subprocess
import sys

# Create database
try:
    pymysql.install_as_MySQLdb()
    import MySQLdb
    
    # Connect to MySQL without specifying database
    conn = MySQLdb.connect(
        host='127.0.0.1',
        user='root',
        password='Sandeep@1404',
        port=3306
    )
    cursor = conn.cursor()
    
    # Create database
    cursor.execute('CREATE DATABASE IF NOT EXISTS library_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
    conn.commit()
    cursor.close()
    conn.close()
    
    print("✓ Database 'library_manager' created successfully!")
    
except Exception as e:
    print(f"✗ Error creating database: {e}")
    sys.exit(1)

# Run migrations
print("\nRunning Django migrations...")
result = subprocess.run([sys.executable, 'manage.py', 'migrate'], cwd='.')
if result.returncode == 0:
    print("✓ Migrations completed successfully!")
else:
    print("✗ Migrations failed!")
    sys.exit(1)

print("\n✓ Backend setup complete! Your Django project is now connected to MySQL.")
