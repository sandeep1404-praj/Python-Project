# 🔌 Quick API Reference

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints except `/register/` and `/token/` require:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Endpoints Summary

### 🔐 Authentication (No Token Required)

#### Register
```
POST /register/
{
  "username": "user",
  "email": "user@example.com",
  "password": "pass123",
  "role": "CUSTOMER"  // or "STAFF"
}
Response: 201 Created - User object
```

#### Get Token
```
POST /token/
{
  "username": "user",
  "password": "pass123"
}
Response: 200 OK - {access, refresh}
```

---

### 👤 User (Token Required)

#### Get Current User
```
GET /user/
Response: 200 OK - Current user object
```

---

### 📦 Items (Token Required)

#### List All Items
```
GET /items/
Query Params:
  - ?search=laptop
  - ?ordering=created_at
Response: 200 OK - [{item}, ...]
```

#### Create Item
```
POST /items/
{
  "name": "Laptop",
  "category": "Electronics",
  "description": "Good condition",
  "ownership_type": "SELL"  // EXCHANGE, SHARE
}
Response: 201 Created - Item object
```

#### Get Item
```
GET /items/{id}/
Response: 200 OK - Item object
```

#### Update Item
```
PUT /items/{id}/
{
  "name": "Updated Name",
  ...
}
Response: 200 OK - Updated item
```

#### Delete Item
```
DELETE /items/{id}/
Response: 204 No Content
```

---

### 🔍 Inspection Reports (Staff Only, Token Required)

#### List Inspection Reports
```
GET /inspection-reports/
Response: 200 OK - [{report}, ...]
```

#### Submit Inspection Report
```
POST /inspection-reports/submit_report/
{
  "item_id": 1,
  "condition_rating": 4,  // 1-5
  "notes": "In good condition"
}
Response: 201 Created - Report object
```

---

### 📋 Borrow Requests (Token Required)

#### List Borrow Requests
```
GET /borrow-requests/
Response: 200 OK - [{request}, ...]
```

#### Create Borrow Request
```
POST /borrow-requests/
{
  "item_id": 1
}
Response: 201 Created - Request object
```

#### Approve Borrow Request (Staff Only)
```
POST /borrow-requests/{id}/approve/
Response: 200 OK - Approved request
```

#### Return Item
```
POST /borrow-requests/{id}/return_item/
Response: 200 OK - Returned request
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Backend issue |

---

## Item Status Values

- `PENDING_VERIFICATION` - Waiting for staff inspection
- `APPROVED` - Inspection passed, ready to use
- `AVAILABLE` - Available for borrowing/purchase
- `RESERVED` - Reserved for a borrower
- `CHECKED_OUT` - Currently borrowed
- `RETURNED` - Item returned after use
- `REJECTED` - Failed inspection

---

## Borrow Request Status Values

- `PENDING` - Waiting for staff approval
- `APPROVED` - Approved, ready to borrow
- `DENIED` - Request denied
- `RETURNED` - Item returned

---

## Ownership Type Values

- `SELL` - Item for sale
- `EXCHANGE` - Item for trade/exchange
- `SHARE` - Item for borrowing

---

## User Role Values

- `CUSTOMER` - Regular user
- `STAFF` - Staff member for inspections

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid token",
  "code": "token_not_valid"
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

---

## Example Workflows

### Workflow 1: Register and Login
```bash
1. POST /register/
   Response: User created

2. POST /token/
   Response: {access, refresh}

3. Save access token to localStorage

4. Use token in Authorization header for all requests
```

### Workflow 2: Add and Inspect Item
```bash
1. POST /items/
   Body: {name, category, description, ownership_type}
   Response: Item created with status PENDING_VERIFICATION

2. (As Staff) POST /inspection-reports/submit_report/
   Body: {item_id, condition_rating, notes}
   If rating >= 3: Item status -> APPROVED
   If rating < 3: Item status -> REJECTED

3. Item now available for borrowing (if APPROVED)
```

### Workflow 3: Borrow Item
```bash
1. GET /items/
   Find available items

2. POST /borrow-requests/
   Body: {item_id}
   Response: Request created with status PENDING

3. (As Staff) POST /borrow-requests/{id}/approve/
   Response: Request status -> APPROVED
   Item status -> RESERVED/CHECKED_OUT
   Due date assigned

4. (As Borrower) POST /borrow-requests/{id}/return_item/
   Request status -> RETURNED
   Item status -> RETURNED
```

---

## Useful Curl Commands

### Get Token
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

### Create Item
```bash
curl -X POST http://localhost:8000/api/items/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Laptop",
    "category":"Electronics",
    "description":"Good condition",
    "ownership_type":"SELL"
  }'
```

### Get All Items
```bash
curl -X GET http://localhost:8000/api/items/ \
  -H "Authorization: Bearer TOKEN"
```

### Submit Inspection
```bash
curl -X POST http://localhost:8000/api/inspection-reports/submit_report/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id":1,
    "condition_rating":4,
    "notes":"Good condition"
  }'
```

---

## Rate Limiting

Currently: No rate limiting (Development)

---

## Pagination

Currently: All results returned (Development)

---

## Filters & Search

Available on most list endpoints:
- `?search=` - Search in text fields
- `?ordering=` - Sort by field
- `?status=` - Filter by status

---

## Token Refresh

### Refresh Access Token
```
POST /token/refresh/
{
  "refresh": "refresh_token_value"
}
Response: {access} - New access token
```

---

## Version Info

- Django: 6.0.1
- DRF: 3.14.0
- Simple JWT: 5.3.2
- Python: 3.8+
- React: 19.2.4

---

## Postman Tips

1. **Set Environment Variables:**
   - `base_url` = `http://localhost:8000`
   - `access_token` = (from login response)

2. **Auto-refresh Token:**
   Add to "Pre-request Script":
   ```javascript
   // Auto-refresh token logic here
   ```

3. **Test & Validate:**
   Add Tests tab to check responses

4. **Save Responses:**
   Use "Save as example" for documentation

---

This is your quick reference! For detailed information, see README.md and SETUP_GUIDE.md
