# 📚 Library Manager - Setup & Testing Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd "c:\Users\Deep\OneDrive\Desktop\Python Project\backend"
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create a Superuser (Optional for Admin Panel)
```bash
python manage.py createsuperuser
```

### 4. Start Backend Server
```bash
python manage.py runserver
```

**Backend URL:** `http://localhost:8000`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd "c:\Users\Deep\OneDrive\Desktop\Python Project\frontend"
npm install
```

### 2. Start Frontend Server
```bash
npm start
```

**Frontend URL:** `http://localhost:3000`

---

## API Testing with Postman

### Base URL
```
http://localhost:8000/api/
```

### 1. Register User
**Endpoint:** `POST http://localhost:8000/api/register/`

**Body (JSON):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

---

### 2. Get Authentication Token
**Endpoint:** `POST http://localhost:8000/api/token/`

**Body (JSON):**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Copy the `access` token and add it to all subsequent requests:**
- Header: `Authorization: Bearer <your_access_token>`

---

### 3. Create an Item
**Endpoint:** `POST http://localhost:8000/api/items/`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Laptop",
  "category": "Electronics",
  "description": "Dell XPS 13, good condition",
  "ownership_type": "SELL"
}
```

**Response:**
```json
{
  "id": 1,
  "owner": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  },
  "name": "Laptop",
  "category": "Electronics",
  "description": "Dell XPS 13, good condition",
  "ownership_type": "SELL",
  "condition_score": null,
  "status": "PENDING_VERIFICATION",
  "created_at": "2024-01-29T10:30:00Z"
}
```

---

### 4. Get All Items
**Endpoint:** `GET http://localhost:8000/api/items/`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "owner": {...},
    "name": "Laptop",
    ...
  }
]
```

---

### 5. Submit Inspection Report (Staff Only)
**Endpoint:** `POST http://localhost:8000/api/inspection-reports/submit_report/`

**Headers:**
```
Authorization: Bearer <staff_access_token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "item_id": 1,
  "condition_rating": 4,
  "notes": "Item is in excellent condition"
}
```

**Response:**
```json
{
  "id": 1,
  "item": {
    "id": 1,
    "name": "Laptop",
    ...
  },
  "staff": {
    "id": 2,
    "username": "staff_user",
    ...
  },
  "condition_rating": 4,
  "notes": "Item is in excellent condition",
  "inspected_at": "2024-01-29T11:00:00Z"
}
```

---

### 6. Create Borrow Request
**Endpoint:** `POST http://localhost:8000/api/borrow-requests/`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Body (JSON):**
```json
{
  "item_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "item": {...},
  "borrower": {...},
  "status": "PENDING",
  "due_date": null,
  "created_at": "2024-01-29T11:30:00Z"
}
```

---

### 7. Approve Borrow Request (Staff Only)
**Endpoint:** `POST http://localhost:8000/api/borrow-requests/{id}/approve/`

**Headers:**
```
Authorization: Bearer <staff_access_token>
```

**Response:**
```json
{
  "id": 1,
  "item": {...},
  "borrower": {...},
  "status": "APPROVED",
  "due_date": "2024-02-05T11:30:00Z",
  "created_at": "2024-01-29T11:30:00Z"
}
```

---

### 8. Return Item
**Endpoint:** `POST http://localhost:8000/api/borrow-requests/{id}/return_item/`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:**
```json
{
  "id": 1,
  "item": {...},
  "borrower": {...},
  "status": "RETURNED",
  "due_date": "2024-02-05T11:30:00Z",
  "created_at": "2024-01-29T11:30:00Z"
}
```

---

## User Roles

### CUSTOMER
- Add items for sale, exchange, or sharing
- View available items
- Create borrow/purchase requests
- View their own requests

### STAFF
- Inspect items and provide ratings
- Approve or deny borrow requests
- View all items and requests

---

## Item Status Flow

```
PENDING_VERIFICATION → APPROVED → AVAILABLE → RESERVED/CHECKED_OUT → RETURNED
                   ↓
                 REJECTED
```

---

## Common Postman Tips

1. **Save Access Token:** Use Postman's environment variables to store the token
2. **Use Collections:** Create a collection with all endpoints for quick testing
3. **Set Pre-request Scripts:** Auto-refresh tokens if expired
4. **Use Postman Tests:** Validate responses automatically

---

## Frontend Features

### Customer Dashboard
- Add new items for sale/exchange/sharing
- Browse available items from other users
- Create borrow/purchase requests
- Track status of requests

### Staff Dashboard
- View items pending inspection
- Submit inspection reports with condition ratings
- Approve or deny borrow requests
- Return items after use

---

## Troubleshooting

### CORS Error
Make sure the backend is running and CORS is configured in `settings.py`

### Token Expired
Get a new token using the register/login endpoints

### Database Errors
Run migrations: `python manage.py migrate`

### Port Already in Use
Change the port: `python manage.py runserver 8001`

---

**Ready to test! Happy coding!** 🚀
