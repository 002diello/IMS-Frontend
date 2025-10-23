# Authentication Flow Setup

## Overview

Your React app now has a complete authentication flow integrated with your Spring Boot backend.

## What Was Added

### 1. **AuthContext** (`src/context/AuthContext.jsx`)
- Global authentication state management
- Stores user data and JWT token
- Provides `login()`, `logout()`, and `updateUser()` functions
- Automatically checks for existing auth on app load

### 2. **Updated Login Page** (`src/pages/Login.jsx`)
- Calls `/api/auth/login` endpoint
- Stores JWT token in localStorage
- Stores user data in AuthContext
- Handles authentication errors (401, 403, etc.)

### 3. **Updated Register Page** (`src/pages/Register.jsx`)
- Calls `/api/auth/register` endpoint
- Validates form data
- Redirects to login after successful registration

### 4. **Enhanced ProtectedRoute** (`src/App.jsx`)
- Uses AuthContext instead of simple localStorage flag
- Shows loading spinner while checking auth
- Redirects to `/login` if not authenticated

### 5. **Improved Logout**
- Clears all auth data from localStorage
- Resets AuthContext state
- Redirects to login page

## Backend Requirements

Your Spring Boot backend needs these endpoints:

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account disabled

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `409 Conflict` - Email already exists

## How It Works

### Login Flow
1. User enters email and password
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials and returns JWT token + user data
4. Frontend stores token in localStorage
5. Frontend stores user data in AuthContext
6. User is redirected to dashboard
7. All subsequent API calls include `Authorization: Bearer <token>` header

### Protected Routes
1. User tries to access protected route (e.g., `/dashboard`)
2. `ProtectedRoute` checks AuthContext for authentication
3. If authenticated → render the page
4. If not authenticated → redirect to `/login`

### Logout Flow
1. User clicks logout button
2. Frontend clears token and user data
3. AuthContext state is reset
4. User is redirected to login page

## Testing Authentication

### 1. Test Registration
```bash
# Navigate to http://localhost:5173/register
# Fill in the form and submit
# Should redirect to login page after success
```

### 2. Test Login
```bash
# Navigate to http://localhost:5173/login
# Enter credentials
# Should redirect to dashboard with user info in header
```

### 3. Test Protected Routes
```bash
# Without logging in, try to access http://localhost:5173/
# Should redirect to /login
```

### 4. Test Logout
```bash
# After logging in, click the logout button in the profile menu
# Should redirect to /login and clear all auth data
```

## Using Auth in Components

### Get current user
```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.name}!</p>}
    </div>
  )
}
```

### Logout programmatically
```javascript
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests automatically include the token via axios interceptor
- 401 responses automatically clear the token and redirect to login
- Passwords are sent over HTTPS in production (ensure backend uses HTTPS)

## Next Steps

1. **Create backend auth endpoints** (`/api/auth/login` and `/api/auth/register`)
2. **Configure JWT** in your Spring Boot SecurityConfig
3. **Test the flow** end-to-end
4. **Add role-based access** if needed (check `user.role` in components)

## Troubleshooting

### "Login failed" error
- Check that backend is running on `http://localhost:8080`
- Verify `/api/auth/login` endpoint exists
- Check browser console for detailed error

### Redirects to login immediately
- Check that backend returns correct response format
- Verify token is being stored in localStorage
- Check browser console for errors

### Token not included in requests
- Verify axios interceptor is working (check `src/api/client.js`)
- Check that token exists in localStorage
- Look for `Authorization` header in Network tab
