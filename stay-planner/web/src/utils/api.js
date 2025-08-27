// Simple API utility for authentication
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }
  
  let errorMessage = 'Request failed';
  try {
    const errorData = await response.json();
    errorMessage = errorData.error || errorMessage;
  } catch {
    // If we can't parse the error response, use the status text
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new ApiError(errorMessage, response.status);
};

export const api = {
  auth: {
    async login(credentials) {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(credentials),
      });
      
      return handleResponse(response);
    },
    
    async register(userData) {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    },
    
    async logout() {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    async checkAuth() {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include',
      });
      
      return handleResponse(response);
    }
  }
};

export { ApiError };
