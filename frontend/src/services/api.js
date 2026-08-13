import axios from 'axios';

/**
 * API_BASE_URL points to the backend server.
 * This exactly matches the port (8000) and the versioned base path (/api/v1)
 * defined in your backend's app.js file.
 */
const API_BASE_URL = 'http://localhost:8000/api/v1'; 

/**
 * Create a centralized Axios instance.
 * This prevents writing the base URL and default headers repeatedly across different components.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * This middleware runs automatically before every outgoing HTTP request.
 * It checks if a JWT authentication token exists in local storage and attaches it 
 * to the request headers to authorize protected backend routes.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});