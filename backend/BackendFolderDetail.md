# Backend Folder Structure and Database Schema

This document provides a detailed overview of the backend folder structure for the Library Manager API project, which is built using Django. It also includes the database schema and models used in the application.

## Backend Folder Structure

The backend is organized as follows:

```
backend/
├── db.sqlite3                          # SQLite database file (used for development)
├── manage.py                           # Django management script for running commands
├── populate_db.py                      # Script to populate the database with sample data
├── requirements.txt                    # Python dependencies for the project
├── setup_db.py                         # Script to set up the database
├── setup_mysql.py                      # Script to configure MySQL database
├── library_manager/                    # Main Django project directory
│   ├── __init__.py                     # Package initialization
│   ├── asgi.py                         # ASGI configuration for asynchronous servers
│   ├── db_backend.py                   # Custom database backend configuration
│   ├── settings.py                     # Django settings file
│   ├── urls.py                         # Main URL configuration
│   └── wsgi.py                         # WSGI configuration for web servers
├── media/                              # Directory for user-uploaded media files
│   └── item_images/                    # Subdirectory for item images
│       ├── chair.webp                  # Example item image
│       └── images.jpeg                 # Example item image
└── things/                             # Django app for managing library items and users
    ├── __init__.py                     # Package initialization
    ├── admin.py                        # Django admin configuration
    ├── apps.py                         # App configuration
    ├── models.py                       # Database models (detailed below)
    ├── serializers.py                  # DRF serializers for API responses
    ├── tests.py                        # Unit tests for the app
    ├── urls.py                         # URL patterns for the app
    ├── views.py                        # API views and logic
    └── migrations/                     # Database migration files
        ├── __init__.py
        ├── 0001_initial.py             # Initial migration
        ├── 0002_alter_user_managers.py # Alteration to user managers
        ├── 0003_user_location_message.py # Added user location and message fields
        ├── 0004_pointtransaction_rating_userpoints.py # Added point transactions and ratings
        ├── 0005_borrowrequest_return_date.py # Added return date to borrow requests
        └── 0006_item_image.py           # Added image field to items
```

### Key Files and Directories

- **manage.py**: Entry point for Django commands like `python manage.py runserver` or `python manage.py makemigrations`.
- **library_manager/**: The main project directory containing settings, URLs, and server configurations.
- **things/**: The primary Django app handling all business logic for items, users, borrowing, etc.
- **media/**: Stores uploaded files, such as item images.
- **migrations/**: Contains database migration files to track schema changes.

## Database Schema and Models

The application uses Django's ORM to define the database schema. All models are defined in `things/models.py`. Below is a detailed description of each model, including fields, relationships, and purposes.

### User Model
Extends Django's `AbstractUser` for authentication and adds custom fields.

- **Fields**:
  - `role`: CharField with choices ('CUSTOMER', 'STAFF') – Default: 'CUSTOMER'
  - `location`: CharField (optional) – City/Area of the user
- **Relationships**: None direct, but related to other models via foreign keys.
- **Purpose**: Represents users in the system, with roles for customers and staff.

### Item Model
Represents items available for sharing, selling, or exchanging.

- **Fields**:
  - `owner`: ForeignKey to User (cascade delete) – The item's owner
  - `name`: CharField (max 255) – Item name
  - `category`: CharField (max 100) – Item category
  - `description`: TextField – Detailed description
  - `image`: ImageField (optional, upload to 'item_images/') – Item image
  - `ownership_type`: CharField with choices ('SELL', 'EXCHANGE', 'SHARE')
  - `condition_score`: IntegerField (optional, 1-5) – Set after inspection
  - `status`: CharField with choices ('PENDING_VERIFICATION', 'APPROVED', 'AVAILABLE', 'RESERVED', 'CHECKED_OUT', 'RETURNED', 'REJECTED') – Default: 'PENDING_VERIFICATION'
  - `created_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - One-to-Many with User (owner)
  - One-to-One with InspectionReport
  - One-to-Many with BorrowRequest
  - One-to-Many with Message
  - One-to-One with Rating
  - One-to-Many with PointTransaction
- **Purpose**: Core model for library items, tracking ownership, status, and interactions.

### InspectionReport Model
Stores inspection details for items by staff.

- **Fields**:
  - `item`: OneToOneField to Item (cascade delete)
  - `staff`: ForeignKey to User (cascade delete)
  - `condition_rating`: IntegerField (1-5)
  - `notes`: TextField (optional)
  - `inspected_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - One-to-One with Item
  - Many-to-One with User (staff)
- **Purpose**: Records staff inspections of items, including ratings and notes.

### BorrowRequest Model
Handles borrowing requests for items.

- **Fields**:
  - `item`: ForeignKey to Item (cascade delete)
  - `borrower`: ForeignKey to User (cascade delete)
  - `status`: CharField with choices ('PENDING', 'APPROVED', 'DENIED', 'RETURNED') – Default: 'PENDING'
  - `due_date`: DateTimeField (optional)
  - `return_date`: DateTimeField (optional)
  - `created_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - Many-to-One with Item
  - Many-to-One with User (borrower)
- **Purpose**: Manages the lifecycle of borrowing items, from request to return.

### Message Model
For user-to-user messaging, often related to items.

- **Fields**:
  - `sender`: ForeignKey to User (cascade delete)
  - `recipient`: ForeignKey to User (cascade delete)
  - `item`: ForeignKey to Item (optional, set null on delete)
  - `subject`: CharField (max 255)
  - `body`: TextField
  - `is_read`: BooleanField – Default: False
  - `created_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - Many-to-One with User (sender and recipient)
  - Many-to-One with Item (optional)
- **Purpose**: Enables communication between users, e.g., about borrowing or exchanging items.

### Rating Model
Stores ratings given by staff during inspections.

- **Fields**:
  - `item`: OneToOneField to Item (cascade delete)
  - `staff`: ForeignKey to User (cascade delete)
  - `stars`: IntegerField (1-5)
  - `comment`: TextField (optional)
  - `created_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - One-to-One with Item
  - Many-to-One with User (staff)
- **Purpose**: Provides a rating system for items based on staff evaluations.

### UserPoints Model
Tracks reward points for users.

- **Fields**:
  - `user`: OneToOneField to User (cascade delete)
  - `total_points`: IntegerField – Default: 0
  - `updated_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - One-to-One with User
- **Purpose**: Manages user points for rewards, earned through actions like approving items or borrowing.

### PointTransaction Model
Logs individual point transactions.

- **Fields**:
  - `user`: ForeignKey to User (cascade delete)
  - `points`: IntegerField (can be positive or negative)
  - `action`: CharField with choices (e.g., 'ITEM_APPROVED', 'ITEM_BORROWED', etc.)
  - `item`: ForeignKey to Item (optional, set null on delete)
  - `description`: TextField (optional)
  - `created_at`: DateTimeField (auto-set to now)
- **Relationships**:
  - Many-to-One with User
  - Many-to-One with Item (optional)
- **Purpose**: Detailed log of point changes, linked to specific actions and items.

## Database Setup

- **Development**: Uses SQLite (`db.sqlite3`).
- **Production**: Configured for MySQL via `setup_mysql.py`.
- Migrations are managed via Django's migration system in `things/migrations/`.

For more details on setup, refer to `SETUP_GUIDE.md` in the root directory.
