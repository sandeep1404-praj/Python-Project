"""
Custom Django database backend that uses PyMySQL
"""
import pymysql

# Patch PyMySQL version before importing Django's MySQL backend
pymysql.VERSION = (2, 2, 1, 'final', 0)
pymysql.__version__ = '2.2.1'

# Monkey patch the MySQLdb module check
import sys
sys.modules['MySQLdb'] = pymysql

from django.db.backends.mysql.base import DatabaseWrapper as MysqlDatabaseWrapper

class DatabaseWrapper(MysqlDatabaseWrapper):
    pass

