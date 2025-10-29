import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
