# 📚 Library Manager - Complete Documentation

A full-stack web application for managing shared item library with user authentication, item inspection, and borrowing requests.

## 🎯 Features

### Customer Features
✅ Register and login with secure JWT authentication  
✅ Add items for sale, exchange, or sharing  
✅ Browse available items from other users  
✅ Create borrow/purchase requests  
✅ Track status of requests  
✅ View personal item inventory  

### Staff Features  
✅ Inspect items and provide condition ratings  
✅ Approve or deny borrow requests  
✅ Manage item verification process  
✅ Return items after use  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Start the server:**
```bash
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/token/` | Get access token |
| GET | `/api/user/` | Get current user info |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items/` | List all items |
| POST | `/api/items/` | Create new item |
| GET | `/api/items/{id}/` | Get item details |
| PUT | `/api/items/{id}/` | Update item |
| DELETE | `/api/items/{id}/` | Delete item |

### Inspection Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inspection-reports/` | List reports |
| POST | `/api/inspection-reports/submit_report/` | Submit inspection |

### Borrow Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrow-requests/` | List requests |
| POST | `/api/borrow-requests/` | Create request |
| POST | `/api/borrow-requests/{id}/approve/` | Approve request |
| POST | `/api/borrow-requests/{id}/return_item/` | Return item |

---

## 🔐 Authentication

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

Get token from `/api/token/` endpoint after login.

---

## 📊 Database Schema

### User
- `id` - Primary key
- `username` - Unique username
- `email` - Email address
- `password` - Hashed password
- `role` - CUSTOMER or STAFF
- `created_at` - Account creation time

### Item
- `id` - Primary key
- `owner` - Foreign key to User
- `name` - Item name
- `category` - Category
- `description` - Item description
- `ownership_type` - SELL, EXCHANGE, SHARE
- `condition_score` - 1-5 rating
- `status` - Current status
- `created_at` - Creation timestamp

### InspectionReport
- `id` - Primary key
- `item` - Foreign key to Item
- `staff` - Foreign key to User (staff member)
- `condition_rating` - 1-5 rating
- `notes` - Inspection notes
- `inspected_at` - Inspection timestamp

### BorrowRequest
- `id` - Primary key
- `item` - Foreign key to Item
- `borrower` - Foreign key to User
- `status` - PENDING, APPROVED, DENIED, RETURNED
- `due_date` - Expected return date
- `created_at` - Request creation timestamp

---

## 🎨 UI Components

### Login/Register
- Clean, modern authentication forms
- Role selection during registration
- Input validation and error messages

### Customer Dashboard
- **My Items Tab**: View and manage personal items
- **Available Items Tab**: Browse items from other users
- **My Requests Tab**: Track borrow/purchase requests

### Staff Dashboard
- **Items Tab**: Inspect pending items with rating system
- **Requests Tab**: Approve or deny borrow requests

---

## 🔄 Item Status Workflow

```
┌─────────────────────┐
│ PENDING_VERIFICATION│
└──────────┬──────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
   APPROVED   REJECTED
      │
      ▼
 AVAILABLE
      │
      ├─── RESERVED ─── CHECKED_OUT ─── RETURNED
```

---

## 🎯 Item Ownership Types

| Type | Description |
|------|-------------|
| SELL | Item available for purchase |
| EXCHANGE | Item available for trade |
| SHARE | Item available for borrowing |

---

## 📝 Example API Calls

### Register User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "CUSTOMER"
  }'
```

### Get Token
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'
```

### Create Item
```bash
curl -X POST http://localhost:8000/api/items/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "category": "Electronics",
    "description": "Dell XPS 13",
    "ownership_type": "SELL"
  }'
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 6.0.1
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **CORS**: django-cors-headers
- **Database**: SQLite (development)

### Frontend
- **Framework**: React 19.2.4
- **HTTP Client**: Axios 1.6.0
- **State Management**: React hooks
- **Styling**: Custom CSS with gradient backgrounds

---

## 🔒 Security Features

✅ JWT token-based authentication  
✅ Password hashing using Django's built-in system  
✅ CORS protection  
✅ Role-based access control  
✅ Token expiration (60 minutes for access token)  

---

## 📦 Project Structure

```
project/
├── backend/
│   ├── library_manager/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── things/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── StaffDashboard.js
│   │   │   └── InspectionPage.js
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── SETUP_GUIDE.md
```

---

## 🐛 Troubleshooting

### CORS Error
**Solution**: Make sure `django-cors-headers` is installed and configured in settings.py

### Token Expired
**Solution**: Get a new token using the login endpoint

### Port Already in Use
**Solution**: 
```bash
# Backend
python manage.py runserver 8001

# Frontend
PORT=3001 npm start
```

### Database Lock Error
**Solution**: Delete `db.sqlite3` and run migrations again

### Frontend Can't Connect to Backend
**Solution**: Ensure backend is running on `http://localhost:8000` and CORS is enabled

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)

---

## 👨‍💻 Development

### Running Tests
```bash
# Backend
python manage.py test

# Frontend
npm test
```

### Building for Production
```bash
# Frontend
npm run build
```

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Support

For issues and questions, please refer to the SETUP_GUIDE.md file for detailed troubleshooting steps.

Happy coding! 🚀
