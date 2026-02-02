# Quick Start Guide - Library of Things

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend
python manage.py runserver
```

Backend will run at: **http://localhost:8000**

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run at: **http://localhost:5173**

### Step 3: Test the Application

Open your browser and go to: **http://localhost:5173**

---

## 🧪 Test Scenarios

### Scenario 1: Customer Journey

1. **Register as Customer**
   - Click "Create one now" on login page
   - Fill in: username, email, password
   - Select "Customer" role
   - Click "Create Account"

2. **Browse Items**
   - You'll be redirected to Customer Dashboard
   - Click "Browse Items" in navigation or quick actions
   - By default, you see items "Near Me" (area-based)
   - Click "All Locations" button to see all items

3. **Request an Item**
   - Click on any item card
   - View item details and condition rating
   - Click "Request to Borrow"
   - Check "My Rentals" to see pending request

4. **List Your Own Item**
   - Click "List New Item" in navigation
   - Fill in item details
   - Select ownership type (Share/Exchange/Sell)
   - Submit
   - ⚠️ Item goes to staff verification (not visible to customers yet)

5. **View Rewards**
   - Click "Rewards" in navigation
   - See your points balance (mock: 150 points)
   - Browse redeemable items
   - Try redeeming a 30-point item (Cap)

### Scenario 2: Staff Journey

1. **Register as Staff**
   - On registration page, select "Staff" role
   - Complete registration

2. **Verify Items**
   - You'll be redirected to Staff Dashboard
   - See pending items count
   - Click "Verify Items" or "Pending Items"
   - Click "Inspect & Verify" on an item
   - Rate condition (1-5 stars)
   - ✓ Rating ≥ 3 = Approved
   - ✗ Rating < 3 = Rejected
   - Add notes (optional)
   - Submit inspection

3. **Approve Borrow Requests**
   - Click "Borrow Requests" in navigation
   - See pending customer requests
   - View borrower and owner information
   - Click "Approve Request" or "Deny"

### Scenario 3: End-to-End Flow

**Customer A:**
1. Register as Customer (username: alice)
2. List an item (e.g., "DSLR Camera")
3. Item status: PENDING_VERIFICATION

**Staff:**
1. Login as Staff
2. Go to Pending Items
3. Inspect "DSLR Camera"
4. Rate 4/5 stars
5. Submit → Item status: APPROVED

**Customer B:**
1. Register as Customer (username: bob)
2. Browse items
3. Find "DSLR Camera" (now visible)
4. Click and request to borrow
5. Request status: PENDING

**Staff:**
1. Go to Borrow Requests
2. See Bob's request for Camera
3. Click "Approve Request"
4. Request status: APPROVED

**Customer B:**
1. Go to "My Rentals"
2. See active rental
3. After use, click "Mark as Returned"
4. Earn reward points!

---

## 🎯 Key Features to Test

### Area-Based Filtering
- ✓ On "Browse Items" page, default shows area items
- ✓ Click "All Locations" button to see all
- ✓ Button toggles between "Near Me" and "All Locations"

### Staff Verification
- ✓ Customer lists item → Status: PENDING_VERIFICATION
- ✓ Staff inspects and rates item
- ✓ Rating ≥3: Item becomes APPROVED and visible
- ✓ Rating <3: Item becomes REJECTED and hidden

### Rewards System
- ✓ View points balance
- ✓ Browse redeemable items (5 items)
- ✓ Items show required points
- ✓ Can only redeem if enough points
- ✓ Mock redemption flow works

### Role-Based Navigation
- ✓ Customer sees: Dashboard, Browse Items, List Item, Rentals, Rewards
- ✓ Staff sees: Dashboard, Pending Items, Borrow Requests
- ✓ Each role has different colored navigation

---

## 🔍 Things to Observe

### Custom Design Elements
1. **Gradient Cards**: Diagonal gradient backgrounds on dashboard stats
2. **Unique Layouts**: Different from typical admin panels
3. **Custom Modals**: Inspection modal with star rating
4. **Smooth Animations**: Hover effects, transitions
5. **Color Coding**: 
   - Blue for items/products
   - Purple for requests
   - Amber/Orange for rewards
   - Green for success

### User Experience
1. **Loading States**: Spinners during API calls
2. **Error Handling**: Red alerts for errors
3. **Success Feedback**: Green alerts with auto-redirect
4. **Responsive Design**: Try resizing browser
5. **Mobile Menu**: Hamburger menu on small screens

---

## 📊 Sample Data

If you need to test with existing data, you can create via API:

### Create Customer User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer1",
    "email": "customer@test.com",
    "password": "test123",
    "role": "CUSTOMER"
  }'
```

### Create Staff User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "staff1",
    "email": "staff@test.com",
    "password": "test123",
    "role": "STAFF"
  }'
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend errors
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### API connection issues
- Check backend is running on port 8000
- Check CORS settings in backend
- Check browser console for errors

### Page not found
- Check if route exists in App.jsx
- Verify ProtectedRoute is working
- Check authentication state

---

## 📱 Browser Testing

**Recommended browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test responsive design:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

---

## ✅ Checklist

After testing, verify:

- [ ] Can register as Customer
- [ ] Can register as Staff
- [ ] Customer dashboard loads
- [ ] Staff dashboard loads
- [ ] Can browse items with filters
- [ ] Area filter toggle works
- [ ] Can view item details
- [ ] Can list new item
- [ ] Staff can verify items
- [ ] Staff can approve/reject items
- [ ] Can create borrow request
- [ ] Staff can approve borrow requests
- [ ] Can view rentals
- [ ] Can mark item as returned
- [ ] Can view rewards
- [ ] Can see redeemable items
- [ ] Navigation adapts to role
- [ ] Logout works
- [ ] Design is unique (no templates)
- [ ] Responsive on mobile

---

## 🎓 Tips

1. **Use separate browsers** for Customer and Staff to test simultaneously
2. **Check Network tab** in browser DevTools to see API calls
3. **Use React DevTools** to inspect component state
4. **Try different screen sizes** to test responsive design
5. **Test error scenarios** (wrong password, invalid data, etc.)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check terminal output for backend errors
3. Verify both servers are running
4. Check API_BASE_URL in api.js matches backend

---

**Happy Testing! 🎉**
