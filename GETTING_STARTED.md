# 🎯 Getting Started - Step by Step

## ✨ What You Have

A **Full-Stack Item Library Management System** with:
- **Backend**: Django REST API with JWT authentication
- **Frontend**: React with modern UI
- **Database**: SQLite with proper models
- **Documentation**: Complete API & setup guides

---

## 🚀 Step 1: Initial Setup (One Time)

### Option A: Use Quick Start Script (Easiest)
```bash
cd "c:\Users\Deep\OneDrive\Desktop\Python Project"
quickstart.bat
```

This will:
- ✅ Install all backend dependencies
- ✅ Run database migrations
- ✅ Install all frontend dependencies

### Option B: Manual Setup
```bash
# Backend setup
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

# Frontend setup
cd ../frontend
npm install
```

---

## 🌐 Step 2: Start the Application

### Terminal 1 - Backend (Keep Running)
```bash
cd "c:\Users\Deep\OneDrive\Desktop\Python Project\backend"
python manage.py runserver
```
✅ Backend runs on: `http://localhost:8000`

### Terminal 2 - Frontend (Keep Running)
```bash
cd "c:\Users\Deep\OneDrive\Desktop\Python Project\frontend"
npm start
```
✅ Frontend runs on: `http://localhost:3000`

---

## 🧪 Step 3: Test with Postman

### Setup Postman
1. Open Postman
2. Click **Import**
3. Select `Library_Manager_API.postman_collection.json`
4. Create environment variable:
   - Variable: `base_url`
   - Value: `http://localhost:8000`

### Test Sequence

#### 1️⃣ Register a Customer
```
POST http://localhost:8000/api/register/

Body (JSON):
{
  "username": "customer1",
  "email": "customer@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}

✅ You should get a 201 Created response with user data
```

#### 2️⃣ Register a Staff Member
```
POST http://localhost:8000/api/register/

Body (JSON):
{
  "username": "staff1",
  "email": "staff@example.com",
  "password": "password123",
  "role": "STAFF"
}

✅ You should get a 201 Created response
```

#### 3️⃣ Get Token (as Customer)
```
POST http://localhost:8000/api/token/

Body (JSON):
{
  "username": "customer1",
  "password": "password123"
}

✅ Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

📌 Copy the 'access' token - you'll need this!
```

#### 4️⃣ Get Token (as Staff)
```
POST http://localhost:8000/api/token/

Body (JSON):
{
  "username": "staff1",
  "password": "password123"
}

✅ Get staff access token
```

#### 5️⃣ Create Item (as Customer)
```
POST http://localhost:8000/api/items/

Headers:
Authorization: Bearer <customer_access_token>

Body (JSON):
{
  "name": "Laptop",
  "category": "Electronics",
  "description": "Dell XPS 13 in good condition",
  "ownership_type": "SELL"
}

✅ Item created with status: PENDING_VERIFICATION
```

#### 6️⃣ List Items
```
GET http://localhost:8000/api/items/

Headers:
Authorization: Bearer <your_access_token>

✅ You'll see all items
```

#### 7️⃣ Submit Inspection (as Staff)
```
POST http://localhost:8000/api/inspection-reports/submit_report/

Headers:
Authorization: Bearer <staff_access_token>

Body (JSON):
{
  "item_id": 1,
  "condition_rating": 4,
  "notes": "Item is in excellent condition"
}

✅ Item status changes to APPROVED (rating >= 3)
```

#### 8️⃣ Create Borrow Request (as Customer)
```
POST http://localhost:8000/api/borrow-requests/

Headers:
Authorization: Bearer <customer_access_token>

Body (JSON):
{
  "item_id": 1
}

✅ Request created with status: PENDING
```

#### 9️⃣ Approve Borrow Request (as Staff)
```
POST http://localhost:8000/api/borrow-requests/1/approve/

Headers:
Authorization: Bearer <staff_access_token>

✅ Request status: APPROVED
   Item status: RESERVED
   Due date assigned (7 days)
```

#### 🔟 Return Item (as Customer)
```
POST http://localhost:8000/api/borrow-requests/1/return_item/

Headers:
Authorization: Bearer <customer_access_token>

✅ Request status: RETURNED
   Item status: RETURNED
```

---

## 💻 Step 4: Use the Web Interface

### Go to Frontend
Open `http://localhost:3000` in your browser

### Register a User
1. Click "Register here"
2. Fill in details
3. Choose role (CUSTOMER or STAFF)
4. Submit

### Login
1. Enter credentials
2. You're in!

### As Customer:
- **📦 My Items Tab**: Add new items, track your items
- **🛍️ Available Items**: Browse items from others, request to borrow
- **📋 My Requests**: See status of your borrow requests

### As Staff:
- **📦 Items Tab**: See pending items, inspect them, rate condition
- **🔄 Requests Tab**: Approve borrow requests, return items

---

## 📊 Understanding the Flow

### Item Lifecycle
```
1. Customer adds item → Status: PENDING_VERIFICATION
2. Staff inspects → Rating >= 3: APPROVED, < 3: REJECTED
3. If approved → Status: AVAILABLE
4. Customer requests → BorrowRequest: PENDING
5. Staff approves → Status: RESERVED
6. Customer gets item → Status: CHECKED_OUT
7. Customer returns → Status: RETURNED
```

### User Roles
- **CUSTOMER**: Add items, browse, make requests
- **STAFF**: Inspect items, approve/deny requests

---

## 🔍 Common Tasks

### Task 1: Add an Item
```
Frontend: Login → My Items → + Add New Item → Fill form → Submit
Backend: Item created with status PENDING_VERIFICATION
```

### Task 2: Inspect an Item
```
Staff Frontend: Staff Dashboard → Items Tab → Click Inspect
Fill rating (1-5) and notes → Submit
Backend: InspectionReport created, Item status updated
```

### Task 3: Borrow an Item
```
Customer Frontend: Available Items → Click item → Request to Borrow
Staff Frontend: Requests Tab → Click Approve
Customer can now access the item
```

### Task 4: Return Item
```
Customer Frontend: My Requests → Click Return
Backend: BorrowRequest status = RETURNED
```

---

## ⚠️ Troubleshooting

### "Cannot connect to backend"
- ✅ Make sure backend is running: `python manage.py runserver`
- ✅ Check CORS settings in `settings.py`

### "Invalid token" Error
- ✅ Get a fresh token from `/api/token/` endpoint
- ✅ Make sure you're using Bearer token format

### "Permission denied" (403)
- ✅ Check if you have the right role for the action
- ✅ Staff endpoints require role = 'STAFF'

### "Not found" (404)
- ✅ Check the endpoint URL spelling
- ✅ Verify the item/request ID exists

### "Database locked" Error
- ✅ Delete `backend/db.sqlite3`
- ✅ Run migrations again: `python manage.py migrate`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `SETUP_GUIDE.md` | Detailed setup & API examples |
| `API_REFERENCE.md` | Quick API reference |
| `ARCHITECTURE.md` | System architecture & diagrams |
| `COMPLETE_SETUP_SUMMARY.md` | Setup summary |

---

## 🎨 Frontend URLs

- Login/Register: `http://localhost:3000`
- Customer Dashboard: `http://localhost:3000` (after login as customer)
- Staff Dashboard: `http://localhost:3000` (after login as staff)

---

## 🔌 Backend URLs

- API Base: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin/` (if superuser created)
- API Root: `http://localhost:8000/api/` (browsable API)

---

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can register user in Postman
- [ ] Can get token
- [ ] Can create item
- [ ] Can see items in list
- [ ] Can submit inspection
- [ ] Can create borrow request
- [ ] Can approve request
- [ ] Can access web interface

---

## 🎯 Next Steps

1. **Explore the API**: Try all endpoints in Postman
2. **Test the UI**: Register users, add items, test workflows
3. **Customize**: Modify styling, add features, enhance UI
4. **Deploy**: Set up for production when ready
5. **Extend**: Add more features as needed

---

## 💡 Tips

- **Postman**: Import collection for easy testing
- **Frontend**: All components are modular and easy to modify
- **Backend**: DRF makes API development straightforward
- **Documentation**: All features are documented

---

## 🚀 You're Ready!

Everything is set up and ready to go. Start with Step 1 above and follow through!

**Happy coding!** 🎉
