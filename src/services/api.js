import axios from 'axios';

// Mode toggle: true = mock/demo mode, false = real Node/Express backend only
export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mediconsult_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clean up and redirect if needed
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mediconsult_token');
      localStorage.removeItem('mediconsult_user');
    }
    return Promise.reject(error);
  }
);

export default api;
