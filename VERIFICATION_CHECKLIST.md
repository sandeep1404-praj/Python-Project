# ✓ Verification Checklist

Use this checklist to verify everything is working correctly.

---

## 📋 Pre-Setup

- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] All documentation files present
- [ ] Postman installed (optional)

---

## 🔧 Setup Verification

### Backend Setup
- [ ] `backend/requirements.txt` exists with dependencies
- [ ] Dependencies installed successfully
- [ ] `python manage.py makemigrations` runs without errors
- [ ] `python manage.py migrate` runs without errors
- [ ] Database file created (`backend/db.sqlite3`)
- [ ] Backend can start without errors

### Frontend Setup
- [ ] `frontend/package.json` has axios in dependencies
- [ ] `npm install` completes without errors
- [ ] No critical vulnerabilities in npm packages
- [ ] Frontend files are present:
  - [ ] `src/App.js`
  - [ ] `src/components/Login.js`
  - [ ] `src/components/Register.js`
  - [ ] `src/components/StaffDashboard.js`
  - [ ] `src/components/InspectionPage.js`
  - [ ] `src/api.js`
  - [ ] `src/App.css`

---

## 🌐 Server Startup

### Backend Server
- [ ] Backend starts with `python manage.py runserver`
- [ ] No errors in console
- [ ] Listens on `http://localhost:8000`
- [ ] Can access `http://localhost:8000` in browser
- [ ] Can access `http://localhost:8000/api/` in browser

### Frontend Server
- [ ] Frontend starts with `npm start`
- [ ] Compiles without errors
- [ ] Opens in browser at `http://localhost:3000`
- [ ] Page loads without errors
- [ ] Login page is visible

---

## 🔐 Authentication Test

### Registration
- [ ] Can register customer user
- [ ] Registration endpoint returns 201 Created
- [ ] User data saved in database
- [ ] Can register staff user with STAFF role

### Login
- [ ] Can login with registered credentials
- [ ] Token endpoint returns access token
- [ ] Token is JWT format
- [ ] Can see user role in response

### Token Usage
- [ ] Token stored in localStorage
- [ ] Token included in API requests
- [ ] Authorization header correctly formatted
- [ ] Token validation works

---

## 📦 API Testing

### Items Endpoint
- [ ] Can GET all items
- [ ] Can POST create new item
- [ ] Can GET specific item
- [ ] Can PUT update item
- [ ] Can DELETE item
- [ ] Item ownership tracked correctly

### Inspection Endpoint
- [ ] Can GET inspection reports
- [ ] Can POST submit inspection (staff only)
- [ ] Item status changes based on rating
- [ ] Rating >= 3: APPROVED
- [ ] Rating < 3: REJECTED

### Borrow Requests Endpoint
- [ ] Can GET borrow requests
- [ ] Can POST create request
- [ ] Can POST approve request (staff only)
- [ ] Can POST return item
- [ ] Due date assigned on approval

### User Endpoint
- [ ] Can GET current user
- [ ] Returns correct user info
- [ ] Role is included in response

---

## 🎨 Frontend UI

### Login Page
- [ ] Page loads correctly
- [ ] Username input field works
- [ ] Password input field works
- [ ] Login button submits form
- [ ] Error messages display
- [ ] Can switch to register

### Register Page
- [ ] Page loads correctly
- [ ] Username input works
- [ ] Email input works
- [ ] Password input works
- [ ] Role dropdown shows CUSTOMER & STAFF
- [ ] Register button submits form
- [ ] Can switch back to login

### Customer Dashboard
- [ ] Loads after customer login
- [ ] Has three tabs: My Items, Available, Requests
- [ ] My Items tab shows items
- [ ] Can click "+ Add New Item"
- [ ] Add form has all fields
- [ ] Available Items tab shows items
- [ ] Can request items
- [ ] Requests tab shows requests

### Staff Dashboard
- [ ] Loads after staff login
- [ ] Has two tabs: Items, Requests
- [ ] Items tab shows pending items
- [ ] Can click "Inspect Item"
- [ ] Inspection form appears
- [ ] Can select condition rating 1-5
- [ ] Can add notes
- [ ] Requests tab shows all requests
- [ ] Can approve pending requests

### Navigation
- [ ] Navbar shows username
- [ ] Navbar shows user role
- [ ] Can logout from navbar
- [ ] Logout clears token
- [ ] Redirects to login after logout

---

## 📊 Database

### Tables Created
- [ ] User table with correct fields
- [ ] Item table with correct fields
- [ ] InspectionReport table with correct fields
- [ ] BorrowRequest table with correct fields

### Data Integrity
- [ ] Foreign keys working correctly
- [ ] Cascade deletes work
- [ ] Timestamps being set automatically
- [ ] Default values applied correctly

---

## 🔄 Full Workflow

### Complete Item Lifecycle
- [ ] 1. Customer registers (CUSTOMER role)
- [ ] 2. Customer adds item (status: PENDING_VERIFICATION)
- [ ] 3. Staff registers (STAFF role)
- [ ] 4. Staff inspects item (condition_rating: 4)
- [ ] 5. Item status changes to APPROVED
- [ ] 6. Customer creates borrow request
- [ ] 7. Request status: PENDING
- [ ] 8. Staff approves request
- [ ] 9. Request status: APPROVED
- [ ] 10. Item status: RESERVED
- [ ] 11. Customer returns item
- [ ] 12. Request status: RETURNED
- [ ] 13. Item status: RETURNED

### Rejection Workflow
- [ ] Staff can reject item (rating < 3)
- [ ] Item status: REJECTED
- [ ] Item cannot be borrowed

---

## 🧪 Postman Collection

- [ ] `Library_Manager_API.postman_collection.json` exists
- [ ] Can import into Postman
- [ ] All endpoints listed
- [ ] Base URL variable set correctly
- [ ] Token variable works
- [ ] Pre-request scripts working
- [ ] All endpoints executable

---

## 📄 Documentation

- [ ] `README.md` exists and complete
- [ ] `SETUP_GUIDE.md` exists with examples
- [ ] `GETTING_STARTED.md` exists with steps
- [ ] `API_REFERENCE.md` exists with endpoints
- [ ] `ARCHITECTURE.md` exists with diagrams
- [ ] `PROJECT_COMPLETION_SUMMARY.md` exists
- [ ] `COMPLETE_SETUP_SUMMARY.md` exists
- [ ] `INDEX.md` exists for navigation
- [ ] All documentation links work

---

## 🛠️ Tools

- [ ] `quickstart.bat` exists
- [ ] `quickstart.bat` runs without errors
- [ ] `requirements.txt` has all dependencies
- [ ] `package.json` has axios and all dependencies

---

## 🔒 Security

- [ ] Passwords hashed in database
- [ ] JWT tokens used for auth
- [ ] CORS enabled for localhost:3000
- [ ] Token expiration working
- [ ] Refresh token working
- [ ] Role-based permissions enforced
- [ ] Staff endpoints deny customer access

---

## ⚠️ Error Handling

- [ ] Login errors display correctly
- [ ] Network errors handled
- [ ] Invalid token shows error
- [ ] Missing fields show validation errors
- [ ] 404 errors handled gracefully
- [ ] 403 errors handled gracefully
- [ ] 401 errors handled gracefully

---

## 🎯 Performance

- [ ] Frontend loads quickly
- [ ] Backend responds quickly
- [ ] No console errors
- [ ] No console warnings (minor ok)
- [ ] Network requests complete
- [ ] No memory leaks visible

---

## 📱 Responsive Design

- [ ] Desktop view looks good (1920x1080)
- [ ] Tablet view works (768px)
- [ ] Mobile view works (375px)
- [ ] Navigation adapts to screen size
- [ ] Forms are readable on mobile
- [ ] Buttons are clickable on mobile

---

## 🚀 Final Checks

- [ ] Backend and frontend both running
- [ ] Can complete full workflow
- [ ] No critical errors
- [ ] All features working
- [ ] Documentation complete
- [ ] Ready for use

---

## ✅ All Clear!

If all items are checked, your application is ready to use!

---

## 📞 If Something Fails

1. Check relevant documentation file
2. Review error message carefully
3. Check troubleshooting section
4. Verify dependencies are installed
5. Restart servers
6. Clear browser cache
7. Check port availability

---

## 🎉 You're Ready!

Everything is set up and verified. Start using your Library Manager application!

---

**Date Completed**: ________________  
**Completed By**: ________________  
**Notes**: ________________________________________

---

### Print this checklist and mark items as you verify them! ✓
