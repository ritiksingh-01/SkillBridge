import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/users/profile');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' &&
          !isAuthCheck &&
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/signUp' &&
          window.location.pathname !== '/') {
        window.location.href = '/login';
      }
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
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  searchUsers: (params) => api.get('/users/search', { params }),
  getById: (id) => api.get(`/users/${id}`),
};

// Mentors API (no fake success wrapping F7, real routes F6)
export const mentorsAPI = {
  apply: (data) => api.post('/mentors/apply', data),
  getAll: (params = {}) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  getMe: () => api.get('/mentors/profile/me'),
  updateProfile: (id, data) => api.put(`/mentors/${id}`, data),
  getDashboardStats: () => api.get('/mentors/dashboard/stats'),
};

// Sessions API
export const sessionsAPI = {
  create: (data) => api.post('/sessions', data),
  getAll: (params = {}) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  updateStatus: (id, data) => api.put(`/sessions/${id}/status`, data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
};

// Messages API
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getBySession: (sessionId, params) => api.get(`/messages/${sessionId}`, { params }),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  getConversations: (params) => api.get('/messages/conversations', { params }),
  markSessionAsRead: (sessionId) => api.put(`/messages/session/${sessionId}/mark-read`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  create: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  getSessionPayment: (sessionId) => api.get(`/payments/session/${sessionId}`),
};

// Reviews API
export const reviewsAPI = {
  submit: (data) => api.post('/reviews', data),
  getMentorReviews: (mentorId, params) => api.get(`/reviews/mentor/${mentorId}`, { params }),
  getSessionReviews: (sessionId) => api.get(`/reviews/session/${sessionId}`),
  update: (sessionId, data) => api.put(`/reviews/${sessionId}`, data),
};

export default api;
