import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Important for refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and org-id
apiClient.interceptors.request.use(
  (config) => {
    // Add access token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add org-id if available and not auth endpoint
      const orgId = localStorage.getItem('currentOrgId');
      if (orgId && !config.url?.includes('/auth/')) {
        config.headers['x-org-id'] = orgId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Save new access token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.accessToken);
        }

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentOrgId');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
