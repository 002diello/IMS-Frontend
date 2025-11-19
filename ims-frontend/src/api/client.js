// import axios from 'axios'

// // Create axios instance with base configuration
// export const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Include cookies if using session-based auth
// })

// // Request interceptor - adds JWT token to requests if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor - handles common errors
// api.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     // Handle 401 Unauthorized - token expired or invalid
//     if (error.response?.status === 401) {
//       localStorage.removeItem('access_token')
//       // Optionally redirect to login
//       // window.location.href = '/login'
//     }

//     // Handle 403 Forbidden - insufficient permissions
//     if (error.response?.status === 403) {
//       console.error('Access forbidden - insufficient permissions')
//     }

//     return Promise.reject(error)
//   }
// )

// export default api


import axios from 'axios';

// Detect API base URL dynamically
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies if using session-based auth
});

// Request interceptor - adds JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Optionally redirect to login
      // window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default api;

