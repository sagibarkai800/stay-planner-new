import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    logout: () => apiClient.post('/api/auth/logout'),
    me: () => apiClient.get('/api/auth/me'),
  },

  // Trips endpoints
  trips: {
    list: () => apiClient.get('/api/trips'),
    create: (tripData) => apiClient.post('/api/trips', tripData),
    get: (id) => apiClient.get(`/api/trips/${id}`),
    update: (id, tripData) => apiClient.put(`/api/trips/${id}`, tripData),
    delete: (id) => apiClient.delete(`/api/trips/${id}`),
  },

  // Calculations endpoints
  calculations: {
    schengen: (date) => apiClient.get(`/api/calcs/schengen?date=${date}`),
    residency: (year) => apiClient.get(`/api/calcs/residency?year=${year}`),
    summary: () => apiClient.get('/api/calcs/summary'),
  },

  // Documents endpoints
  documents: {
    list: () => apiClient.get('/api/docs'),
    upload: (formData) => apiClient.post('/api/docs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    get: (id) => apiClient.get(`/api/docs/${id}`),
    delete: (id) => apiClient.delete(`/api/docs/${id}`),
  },

  // Health check
  health: () => apiClient.get('/api/health'),
};

export default apiClient;
