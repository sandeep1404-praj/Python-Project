# Frontend Setup Complete ✅

## Project Structure
```
client/
├── public/
│   └── index.html              # Entry HTML
├── src/
│   ├── components/
│   │   └── Navigation.jsx       # Top navbar with role-based menu
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state & JWT management
│   ├── pages/
│   │   ├── Login.jsx            # Login with gradient background
│   │   ├── Register.jsx         # User registration
│   │   ├── Dashboard.jsx        # Items grid with filters
│   │   ├── ItemDetail.jsx       # Single item view
│   │   ├── CreateItem.jsx       # Add new item form
│   │   ├── BorrowRequests.jsx   # Borrow management (staff/borrowers)
│   │   └── InspectionReports.jsx # Inspection submission & reports
│   ├── services/
│   │   ├── api.js               # Axios config with JWT interceptors
│   │   ├── itemService.js       # Item API methods
│   │   ├── borrowService.js     # Borrow request API methods
│   │   └── inspectionService.js # Inspection API methods
│   ├── styles/
│   │   └── index.css            # Tailwind + custom components
│   ├── App.jsx                  # Main router with 7 routes
│   ├── index.jsx                # Entry point with AuthProvider
│   └── main.jsx                 # Vite entry (can be removed)
├── vite.config.js               # Vite config (port 5173, API proxy)
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
└── package.json                 # Dependencies
```

## Features Implemented

### Authentication ✅
- JWT-based login/register
- Automatic token refresh on 401
- Role-based access (CUSTOMER/STAFF)
- Protected routes
- User context throughout app

### Pages ✅
- **Login**: Gradient background, form validation
- **Register**: New account creation with email
- **Dashboard**: Grid layout with status/category filters
- **ItemDetail**: Full item info, owner details, borrow button
- **CreateItem**: Form for SELL/EXCHANGE/SHARE items
- **BorrowRequests**: Staff approval, customer return flows
- **InspectionReports**: Staff inspection submission + report list

### API Services ✅
- **itemService**: CRUD operations (getItems, getItem, createItem, updateItem, deleteItem)
- **borrowService**: Borrow management (get, create, approve, deny, return)
- **inspectionService**: Inspection reports (get, submit)

### Styling ✅
- Tailwind CSS 4.1.18 with custom components
- Responsive grid layouts
- Status badges with color coding
- Form components with validation
- Gradient backgrounds
- Dark mode ready

## How to Run

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### 3. Make sure backend is running
```bash
cd backend
python manage.py runserver
```
Backend should be running on `http://localhost:8000`

## API Endpoints Referenced

### Authentication
- `POST /api/token/` - Login (username, password)
- `POST /api/register/` - Register (username, email, password)
- `GET /api/user/` - Get current user info

### Items
- `GET /api/items/` - List all items
- `GET /api/items/{id}/` - Get single item
- `POST /api/items/` - Create item
- `PUT /api/items/{id}/` - Update item
- `DELETE /api/items/{id}/` - Delete item

### Borrow Requests
- `GET /api/borrow-requests/` - List requests
- `POST /api/borrow-requests/` - Create request
- `POST /api/borrow-requests/{id}/approve/` - Approve (staff)
- `POST /api/borrow-requests/{id}/deny/` - Deny (staff)
- `POST /api/borrow-requests/{id}/return_item/` - Return item

### Inspections
- `GET /api/inspection-reports/` - List reports
- `POST /api/inspection-reports/submit_report/` - Submit report (staff)

## Tech Stack
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.5 (rolldown)
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.13.0
- **HTTP Client**: Axios 1.13.4
- **Dev Server Port**: 5173
- **Backend API**: http://localhost:8000

## Notes
- All components use Tailwind utility classes only (no custom CSS files)
- JWT tokens stored in localStorage
- Automatic token refresh on 401 errors
- Role-based UI rendering (CUSTOMER vs STAFF)
- API proxy configured to backend on port 8000
- Hot reload enabled during development
