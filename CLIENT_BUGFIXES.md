# Client Folder - Bug Fixes

## Bugs Fixed

### 1. ✅ React Router v7 State Dependency Issue (Messages.jsx)

**Problem**:
The `useEffect` hook in Messages.jsx was using `location` as a dependency, which caused the effect to run every time the location object reference changed, even if the actual state data didn't change. This could cause infinite loops or unexpected behavior.

```javascript
// ❌ BEFORE: Using entire location object as dependency
useEffect(() => {
  // Check if coming from browse with item contact
  if (location.state?.recipientId) {
    setShowCompose(true);
    // ...
  }
  loadMessages(); // Runs every time location changes
}, [location]); // Bad dependency
```

**Solution**:
Separated the effects into two hooks:
1. First effect loads messages once on component mount
2. Second effect handles the navigation state with proper dependency tracking

```javascript
// ✅ AFTER: Properly separated effects
useEffect(() => {
  loadMessages();
}, []);

useEffect(() => {
  // Check if coming from browse with item contact
  if (location.state?.recipientId) {
    setShowCompose(true);
    // ...
  }
}, [location.state?.recipientId]); // Only depends on actual state data
```

**File Modified**: `client/src/pages/Messages.jsx`
**Impact**: Prevents unnecessary re-renders and API calls

---

### 2. ✅ Unused Variable Warning (Profile.jsx)

**Problem**:
The `token` variable from `useAuth()` hook was imported but never used in the component, causing ESLint warnings.

```javascript
// ❌ BEFORE: Unused token variable
const { user, token } = useAuth();
```

**Solution**:
Removed the unused destructuring:

```javascript
// ✅ AFTER: Only destructure what's needed
const { user } = useAuth();
```

**File Modified**: `client/src/pages/Profile.jsx`
**Impact**: Cleaner code, removes console warnings

---

## Testing the Fixes

### To verify the fixes work:

1. **Start the development server**:
```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

2. **Check for ESLint warnings**:
- Open browser DevTools (F12)
- Console should show no warnings about unused variables
- No warnings about infinite effects

3. **Test Messages Navigation**:
- Go to Browse page
- Click "Contact" button on any product
- Should redirect to Messages with pre-filled recipient
- Form should have recipient ID and item reference
- Should NOT reload messages multiple times

4. **Test Profile Page**:
- Click on username in navigation
- Profile page should load without errors
- All tabs should work (My Items, Requests, Messages)
- Edit Profile button should work

---

## Files Modified

| File | Issue | Status |
|------|-------|--------|
| `client/src/pages/Messages.jsx` | useEffect dependency chain | ✅ Fixed |
| `client/src/pages/Profile.jsx` | Unused variable import | ✅ Fixed |

---

## No Breaking Changes

All fixes are backward compatible:
- All functionality remains the same
- Navigation still works
- All features still functional
- Just improved React best practices

