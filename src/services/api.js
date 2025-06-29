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
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  searchUsers: (params) => api.get('/users/search', { params }),
};

// Mentors API
export const mentorsAPI = {
  apply: (data) => api.post('/mentors/apply', data),
  getAll: (params) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  updateProfile: (data) => api.put('/mentors/profile', data),
  getDashboardStats: () => api.get('/mentors/dashboard/stats'),
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
  send: (data) => api.post('/messages', data),
  getBySession: (sessionId, params) => api.get(`/messages/${sessionId}`, { params }),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
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