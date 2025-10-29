# API Client Documentation

This directory contains the API client configuration and service functions for connecting to the Spring Boot backend.

## Files

- **`client.js`** - Axios instance with interceptors for JWT and error handling
- **`services.js`** - Organized API service functions for all backend endpoints

## Usage Examples

### 1. Basic API Call

```javascript
import { publicService } from '../api/services'

const message = await publicService.hello()
console.log(message) // "Hello from Spring Boot API!"
```

### 2. Login and Store Token

```javascript
import { authService } from '../api/services'

try {
  const data = await authService.login({ email, password })
  localStorage.setItem('access_token', data.token)
  // Token will automatically be included in future requests
} catch (error) {
  console.error('Login failed:', error.response?.data)
}
```

### 3. Fetch Protected Data

```javascript
import { laptopService } from '../api/services'

// Token from localStorage is automatically added to headers
const laptops = await laptopService.getAll()
```

### 4. Create/Update/Delete

```javascript
import { laptopService } from '../api/services'

// Create
const newLaptop = await laptopService.create({
  brand: 'Dell',
  model: 'XPS 15',
  serialNumber: 'ABC123'
})

// Update
const updated = await laptopService.update(1, { status: 'assigned' })

// Delete
await laptopService.delete(1)
```

### 5. Error Handling

```javascript
import { userService } from '../api/services'

try {
  const users = await userService.getAll()
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login (token expired)
  } else if (error.response?.status === 403) {
    // Show "Access denied" message
  } else {
    // Handle other errors
    console.error(error.message)
  }
}
```

### 6. Using in React Components

```javascript
import { useEffect, useState } from 'react'
import { laptopService } from '../api/services'

function MasterLaptop() {
  const [laptops, setLaptops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const data = await laptopService.getAll()
        setLaptops(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLaptops()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {laptops.map(laptop => (
        <div key={laptop.id}>{laptop.model}</div>
      ))}
    </div>
  )
}
```

## Backend Endpoint Mapping

Make sure your Spring Boot controllers match these paths:

| Service | Frontend Path | Backend Controller |
|---------|--------------|-------------------|
| Auth | `/api/auth/*` | `AuthController` or `UserController` |
| Users | `/api/users/*` | `UserController` |
| Laptops | `/api/laptops/*` | `MasterLaptopController` |
| Assignments | `/api/assignments/*` | `AssignReturnController` |
| Return Leasing | `/api/return-leasing/*` | `ReturnLeasingController` |
| Repairs | `/api/repairs/*` | `RepairRecordController` |

## Notes

- **JWT Token**: Stored in `localStorage` as `access_token`
- **Auto-Logout**: 401 responses automatically clear the token
- **CORS**: Handled by Vite proxy in dev; configure Spring Security for production
- **Base URL**: All requests use `/api` prefix (proxied to `http://localhost:8080` in dev)
