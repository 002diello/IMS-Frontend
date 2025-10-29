import api from './client'

// ============================================
// Authentication Services
// ============================================

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token')
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
}

// ============================================
// User Services
// ============================================

export const userService = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  create: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data
  },

  // Update user
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

// ============================================
// Laptop Services
// ============================================

export const laptopService = {
  // Get all laptops
  getAll: async () => {
    const response = await api.get('/laptops')
    return response.data
  },

  // Get laptop by ID
  getById: async (id) => {
    const response = await api.get(`/laptops/${id}`)
    return response.data
  },

  // Create new laptop
  create: async (laptopData) => {
    const response = await api.post('/laptops', laptopData)
    return response.data
  },

  // Update laptop
  update: async (id, laptopData) => {
    const response = await api.put(`/laptops/${id}`, laptopData)
    return response.data
  },

  // Delete laptop
  delete: async (id) => {
    const response = await api.delete(`/laptops/${id}`)
    return response.data
  },
}

// ============================================
// Assignment Services
// ============================================

export const assignmentService = {
  // Get all assignments
  getAll: async () => {
    const response = await api.get('/assignments')
    return response.data
  },

  // Get assignment by ID
  getById: async (id) => {
    const response = await api.get(`/assignments/${id}`)
    return response.data
  },

  // Create new assignment
  create: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData)
    return response.data
  },

  // Update assignment
  update: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData)
    return response.data
  },

  // Delete assignment
  delete: async (id) => {
    const response = await api.delete(`/assignments/${id}`)
    return response.data
  },
}

// ============================================
// Return Leasing Services
// ============================================

export const returnLeasingService = {
  // Get all return leasing records
  getAll: async () => {
    const response = await api.get('/return-leasing')
    return response.data
  },

  // Get return leasing by ID
  getById: async (id) => {
    const response = await api.get(`/return-leasing/${id}`)
    return response.data
  },

  // Create new return leasing record
  create: async (returnData) => {
    const response = await api.post('/return-leasing', returnData)
    return response.data
  },

  // Update return leasing record
  update: async (id, returnData) => {
    const response = await api.put(`/return-leasing/${id}`, returnData)
    return response.data
  },

  // Delete return leasing record
  delete: async (id) => {
    const response = await api.delete(`/return-leasing/${id}`)
    return response.data
  },
}

// ============================================
// Repair Services
// ============================================

export const repairService = {
  // Get all repair records
  getAll: async () => {
    const response = await api.get('/repairs')
    return response.data
  },

  // Get repair by ID
  getById: async (id) => {
    const response = await api.get(`/repairs/${id}`)
    return response.data
  },

  // Create new repair record
  create: async (repairData) => {
    const response = await api.post('/repairs', repairData)
    return response.data
  },

  // Update repair record
  update: async (id, repairData) => {
    const response = await api.put(`/repairs/${id}`, repairData)
    return response.data
  },

  // Delete repair record
  delete: async (id) => {
    const response = await api.delete(`/repairs/${id}`)
    return response.data
  },
}

// ============================================
// Test/Public Services
// ============================================

export const publicService = {
  // Test endpoint
  hello: async () => {
    const response = await api.get('/hello')
    return response.data
  },
}
