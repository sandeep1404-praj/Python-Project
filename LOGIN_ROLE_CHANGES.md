# Login Logic Changes - Role-Based Access Control

## Summary
The login system has been updated to enforce role-based access control with the following improvements:

1. **Default Role on Registration**: All new users are created as `CUSTOMER` by default - the role parameter is no longer accepted during registration
2. **Role Included in Login Response**: The login endpoint now returns the user's role along with authentication tokens
3. **Frontend Role Detection**: The frontend can now immediately identify user role after login and redirect accordingly

---

## Backend Changes (Django)

### File: `backend/things/views.py`

#### 1. **CustomTokenObtainPairSerializer** (Lines 21-54)
**What changed:**
- Login response now includes user details and role
- Previously only returned `refresh` and `access` tokens

**New response structure:**
```python
{
    'refresh': 'token...',
    'access': 'token...',
    'user_id': user.id,
    'username': user.username,
    'email': user.email,
    'role': user.role,  # 'CUSTOMER' or 'STAFF'
}
```

**Purpose:** Allows frontend to:
- Immediately know the user's role without extra API call
- Implement role-based routing (customer vs staff dashboards)
- Display appropriate UI based on role

#### 2. **RegisterView** (Lines 143-166)
**What changed:**
- Removed the ability to accept `role` parameter from request
- Hardcoded `role = 'CUSTOMER'` for all new registrations
- Updated logging to confirm user is created as CUSTOMER

**Key code:**
```python
# New users are ALWAYS created as CUSTOMER by default
role = 'CUSTOMER'
```

**Purpose:** 
- Ensures ALL new registrations start as customers
- Only admins/superusers can change role to STAFF (via admin panel or custom management command)
- Prevents unauthorized users from creating staff accounts

---

## Frontend Changes (React)

### File: `frontend/src/context/AuthContext.jsx`

#### 1. **login() function** (Lines 35-54)
**What changed:**
- Now extracts role from login response directly
- No longer needs separate API call for user details
- Stores role in localStorage as part of user object

**New code:**
```javascript
const { access, refresh, user_id, role, email } = tokenResponse.data;

const userData = {
  id: user_id,
  username: username,
  email: email,
  role: role,  // Comes directly from login response
};
```

**Benefits:**
- Faster login process (one API call instead of two)
- Role is available immediately for conditional rendering
- Consistent user object structure

#### 2. **register() function** (Lines 60-75)
**What changed:**
- Removed `role` parameter from function signature
- No longer sends role to backend registration endpoint
- Auto-login after registration gets role from login response

**New code:**
```javascript
const register = async (username, email, password) => {
  // No role parameter - backend always creates CUSTOMER
  const response = await authAPI.register({ 
    username, 
    email, 
    password,
  });
  return await login(username, password);
};
```

**Impact:**
- Registration UI should not include role selection
- User role is determined solely by backend

---

## How Role-Based Access Works Now

### Login Flow:
```
1. User submits username + password → POST /api/token/
2. Backend validates credentials
3. Backend returns tokens + user details + role
4. Frontend stores role in localStorage
5. Frontend checks role to redirect:
   - CUSTOMER → /customer/dashboard
   - STAFF → /staff/dashboard
```

### Access Control:
```javascript
// In AuthContext, available in any component:
const { user, isCustomer, isStaff } = useAuth();

// For conditional rendering:
{isStaff && <StaffOnlyFeature />}
{isCustomer && <CustomerOnlyFeature />}
```

### Backend Verification:
- All endpoints that require specific roles already have permissions:
  - `IsCustomer` permission for customer actions (create items, request borrows)
  - `IsStaff` permission for staff actions (inspection reports, approve/deny requests)

---

## Testing the Changes

### Test New User Registration:
```bash
# Register new user - will always be CUSTOMER
POST /api/register/
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "pass123"
}

# Response includes role: CUSTOMER
```

### Test Login:
```bash
# Login with any user
POST /api/token/
{
  "username": "newuser",
  "password": "pass123"
}

# Response now includes:
{
  "access": "token...",
  "refresh": "token...",
  "user_id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "role": "CUSTOMER"  # ← NEW FIELD
}
```

---

## Important Notes

1. **Changing User Role**: Only admins can change user role from CUSTOMER to STAFF
   - Use Django admin panel or create a management command
   - Example: `python manage.py make_staff username`

2. **Frontend Components**: 
   - Update any registration forms to NOT include role selection
   - Login will auto-redirect based on returned role

3. **Existing Users**: 
   - All existing users with `role='CUSTOMER'` continue to work
   - Users with `role='STAFF'` continue to work as staff
   - No database migration needed

4. **Security**: 
   - Backend validates role on every protected endpoint
   - Frontend uses role for UX only, backend is source of truth
   - Role field in JWT token can also be used for additional security

---

## Summary of Benefits

✅ **Consistency**: All new users start as customers  
✅ **Efficiency**: No extra API call needed after login  
✅ **Security**: Backend controls role assignment  
✅ **UX**: Immediate role-based routing after login  
✅ **Role-Based Access**: Existing permissions still enforce role checks on backend  
