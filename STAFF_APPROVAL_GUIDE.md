# Staff Approval Page - Setup & Testing Guide

## Problem Found

You couldn't see the pending products in the staff approval page because **you were logged in as a CUSTOMER**, not a STAFF member.

## Solution

The staff approval page is restricted to staff members only. To view and approve pending products, you need to:

### Step 1: Logout Your Current Account
1. Go to the application (http://localhost:5174)
2. Click your profile menu (top right)
3. Click "Logout"

### Step 2: Login with a Staff Account

Use one of these staff credentials:

| Username | Email | Role |
|----------|-------|------|
| codingsandeep@gmail.com | codingsandeep@gmail.com | STAFF |
| staff2 | staff2@example.com | STAFF |
| staff3 | staff3@example.com | STAFF |

**Note:** To find out the password, check with the database or reset the password through the admin panel.

### Step 3: Navigate to Staff Panel
1. After logging in as staff, click **"Dashboard"** in the navigation menu
2. In the dashboard, you should see a **"Staff Panel"** option
3. Or navigate directly to: http://localhost:5174/inspections

## What You Should See

When logged in as staff, the inspection page shows:

### **Pending Review Tab (Default)**
- List of all products with status `PENDING_VERIFICATION`
- For each product, you can:
  - **Set Star Rating** (1-5 stars) - indicates product quality
  - **Add Comments** - provide feedback on the product
  - **Approve** ✅ - approves the product and awards 10 points to the seller
  - **Reject** ❌ - rejects the product with a reason

### **Approved Tab**
- Shows all previously approved products
- Displays who approved it and when

## Current Pending Products

There are currently **3 pending products** waiting for approval:

1. **Printer** (ID: 9)
2. **ash ketchum** (ID: 12)
3. **dknf** (ID: 13)

## Complete Approval Workflow

1. **Find pending item** in the "Pending Review" tab
2. **Click the item** to expand it (shows full description, owner info, category)
3. **Set product quality** by clicking stars (1-5) or using slider
4. **Add approval comment** (optional) - e.g., "Great condition, verified."
5. **Click "✅ Approve"** button
6. **Confirmation** - Product is now APPROVED, item owner gets 10 points
7. **Check "Approved" tab** to see the newly approved product

## Point System

When you approve a product:
- ✅ **Owner gets +10 points** automatically
- 📊 A **transaction record** is created in the Points system
- 💰 User can redeem points later for rewards

## Rejection Workflow

If a product doesn't meet quality standards:

1. **Click the item** to expand it
2. **Add rejection reason** - explain why it's being rejected
3. **Click "❌ Reject"** button
4. **Confirmation** - Product status becomes REJECTED
5. **Item no longer visible** to customers

## Testing Checklist

- [ ] Logout current user
- [ ] Login as staff member (codingsandeep@gmail.com or staff2)
- [ ] Navigate to /inspections page
- [ ] See "Pending Review" tab with 3 items
- [ ] Expand first item (Printer)
- [ ] Select star rating (4-5 stars recommended)
- [ ] Add approval comment
- [ ] Click "✅ Approve"
- [ ] See success message
- [ ] Check "Approved" tab to confirm it moved there
- [ ] Check item owner's profile to see +10 points awarded
- [ ] Try rejecting next item with a reason
- [ ] Confirm rejection workflow works

## Troubleshooting

### "Access Denied - Staff Only" Error
**Solution:** You're logged in as a CUSTOMER. Logout and login as staff.

### Can't See Pending Items
**Causes:**
- Not logged in as staff
- Browser cache issue - try refreshing (Ctrl+F5)
- Backend server down - check if Django is running

**Solution:**
1. Ensure Django backend is running: `python manage.py runserver`
2. Ensure React frontend is running: `npm run dev`
3. Check browser console (F12) for error messages
4. Clear browser cache and refresh

### Approval Doesn't Work
**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Check Django server logs for API errors
3. Ensure all pending migrations are applied: `python manage.py migrate`

### Can't Find Staff Account
**Solution:**
1. Access Django admin: http://localhost:8000/admin
2. Create a new staff account:
   - Click "Users" 
   - Click "Add User"
   - Fill in username and password
   - Set "role" to "STAFF"
   - Click Save

## Architecture Overview

```
Staff Approval Workflow
├── Frontend (React)
│   └── InspectionReports.jsx
│       ├── Loads pending items from API
│       ├── Shows star rating interface
│       ├── Sends approval/rejection requests
│       └── Updates UI with results
│
├── API Layer
│   └── approvalService.js
│       ├── /item-approval/pending_items/ (GET)
│       ├── /item-approval/approve_item/ (POST)
│       └── /item-approval/reject_item/ (POST)
│
└── Backend (Django)
    └── ItemApprovalViewSet
        ├── Permission: IsStaff only
        ├── pending_items() → Returns PENDING_VERIFICATION items
        ├── approve_item() → Updates status, awards points
        └── reject_item() → Marks as REJECTED
```

## Database Queries

### View all pending items (from Django shell)
```python
python manage.py shell
>>> from things.models import Item
>>> Item.objects.filter(status='PENDING_VERIFICATION')
```

### View all staff users
```python
python manage.py shell
>>> from things.models import User
>>> User.objects.filter(role='STAFF')
```

### Check point transactions
```python
python manage.py shell
>>> from things.models import PointTransaction
>>> PointTransaction.objects.all()
```

## API Endpoints

All endpoints require staff authentication (Bearer token with staff role).

### Get Pending Items
```
GET /api/item-approval/pending_items/
Response: [
  {
    "id": 9,
    "name": "Printer",
    "description": "...",
    "ownership_type": "SELL",
    "status": "PENDING_VERIFICATION",
    "owner": { ... }
  },
  ...
]
```

### Approve Item
```
POST /api/item-approval/approve_item/
Body: {
  "item_id": 9,
  "stars": 4,
  "comment": "Verified and in good condition"
}
Response: {
  "id": 9,
  "status": "APPROVED",
  ...
}
```

### Reject Item
```
POST /api/item-approval/reject_item/
Body: {
  "item_id": 9,
  "comment": "Does not meet quality standards"
}
Response: {
  "id": 9,
  "status": "REJECTED",
  ...
}
```

---

**For more details, see:**
- Backend: `backend/things/views.py` → `ItemApprovalViewSet`
- Frontend: `client/src/pages/InspectionReports.jsx`
- Services: `client/src/services/approvalService.js`
