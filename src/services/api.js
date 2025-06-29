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
    // Try to get from API first, fallback to localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return Promise.resolve({ data: user });
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
  getAll: (params) => {
    // Mock implementation with realistic data
    const mockMentors = [
      {
        _id: '1',
        user: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          profileImage: 'https://ui-avatars.com/api/?name=Sarah+Johnson'
        },
        currentRole: 'Senior Software Engineer',
        organization: 'Google',
        expertise: ['React', 'JavaScript', 'Node.js', 'System Design'],
        rating: { average: 4.9, count: 24 },
        pricing: { oneOnOneSession: 150 },
        bio: 'Experienced software engineer with 8+ years in web development.',
        isActive: true
      },
      {
        _id: '2',
        user: {
          firstName: 'Michael',
          lastName: 'Chen',
          profileImage: 'https://ui-avatars.com/api/?name=Michael+Chen'
        },
        currentRole: 'Product Manager',
        organization: 'Microsoft',
        expertise: ['Product Strategy', 'User Research', 'Data Analysis'],
        rating: { average: 4.8, count: 18 },
        pricing: { oneOnOneSession: 120 },
        bio: 'Product manager with experience in B2B and B2C products.',
        isActive: true
      }
    ];
    return Promise.resolve({ data: { mentors: mockMentors } });
  },
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
  getAll: (params) => {
    // Mock implementation
    const mockSessions = [
      {
        _id: '1',
        title: 'React Development Guidance',
        mentee: {
          firstName: 'John',
          lastName: 'Doe',
          profileImage: 'https://ui-avatars.com/api/?name=John+Doe'
        },
        mentor: {
          user: {
            firstName: 'Sarah',
            lastName: 'Johnson'
          }
        },
        scheduledAt: new Date().toISOString(),
        duration: 60,
        price: 500,
        status: 'pending',
        meetingType: 'video'
      }
    ];
    return Promise.resolve({ data: { sessions: mockSessions } });
  },
  getById: (id) => api.get(`/sessions/${id}`),
  updateStatus: (id, data) => {
    // Mock implementation
    return Promise.resolve({ data: { success: true } });
  },
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
    const mockNotifications = [
      {
        _id: '1',
        title: 'New session request',
        message: 'You have a new session request from John Doe',
        createdAt: new Date().toISOString(),
        isRead: false
      },
      {
        _id: '2',
        title: 'Payment received',
        message: 'Payment of $150 received for your session',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isRead: true
      }
    ];
    return Promise.resolve({ data: { notifications: mockNotifications } });
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