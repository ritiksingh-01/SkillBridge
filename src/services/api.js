import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getProfile: () => {
    // Mock implementation for now
    return Promise.resolve({
      data: JSON.parse(localStorage.getItem('user') || '{}')
    });
  },
  updateProfile: (data) => {
    // Mock implementation for now
    const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return Promise.resolve({ data: updatedUser });
  },
  searchUsers: (params) => api.get('/users/search', { params }),
};

// Mentors API
export const mentorsAPI = {
  apply: (data) => api.post('/mentors/apply', data),
  getAll: (params) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  updateProfile: (data) => api.put('/mentors/profile', data),
  getDashboardStats: () => {
    // Mock implementation
    return Promise.resolve({
      data: {
        stats: {
          totalSessions: 24,
          totalMentees: 12,
          rating: { average: 4.8, count: 18 },
          earnings: 15600,
          responseTime: '~2 hours',
          completionRate: 95
        }
      }
    });
  },
};

// Sessions API
export const sessionsAPI = {
  create: (data) => api.post('/sessions', data),
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  updateStatus: (id, data) => api.put(`/sessions/${id}/status`, data),
};

// Messages API
export const messagesAPI = {
  send: (data) => {
    // Mock implementation
    return Promise.resolve({ data: { success: true } });
  },
  getBySession: (sessionId, params) => api.get(`/messages/${sessionId}`, { params }),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => {
    // Mock implementation
    return Promise.resolve({
      data: {
        notifications: []
      }
    });
  },
  markAsRead: (id) => {
    // Mock implementation
    return Promise.resolve({ data: { success: true } });
  },
  markAllAsRead: () => {
    // Mock implementation
    return Promise.resolve({ data: { success: true } });
  },
  delete: (id) => {
    // Mock implementation
    return Promise.resolve({ data: { success: true } });
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
};

// Reviews API
export const reviewsAPI = {
  submit: (data) => api.post('/reviews', data),
  getMentorReviews: (mentorId, params) => api.get(`/reviews/mentor/${mentorId}`, { params }),
};

export default api;