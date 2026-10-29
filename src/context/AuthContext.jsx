import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Normalize user object so both .id and ._id are always available
const normalizeUser = (userData) => {
  if (!userData) return null;
  const id = userData._id || userData.id;
  return {
    ...userData,
    id,
    _id: id
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Clean up legacy mock data
      if (parsed?.email === 'test@example.com' || parsed?.id === 'temp_user') {
        localStorage.removeItem('user');
        return null;
      }
      return normalizeUser(parsed);
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      // Validate session with server: prefer usersAPI.getProfile for full profile, fallback to authAPI.getMe
      let res;
      try {
        res = await usersAPI.getProfile();
      } catch (profileErr) {
        if (profileErr.response?.status === 401) {
          throw profileErr;
        }
        res = await authAPI.getMe();
      }

      if (res?.data?.user) {
        // Discard any legacy dummy mock payload
        if (res.data.user.email === 'test@example.com' || res.data.user.id === 'temp_user') {
          return;
        }
        const normalized = normalizeUser(res.data.user);
        setUser(normalized);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(normalized));
      }
    } catch (err) {
      // ONLY clear token if server explicitly rejected it with 401
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: rawUser } = response.data;

      const normalized = normalizeUser(rawUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalized));

      setUser(normalized);
      setIsAuthenticated(true);

      return { success: true, user: normalized };
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: rawUser } = response.data;

      const normalized = normalizeUser(rawUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalized));

      setUser(normalized);
      setIsAuthenticated(true);

      return { success: true, user: normalized };
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: 'Registration failed. Please check your details.' };
    }
  };

  const logout = useCallback(() => {
    // Synchronously purge credentials and reset auth state immediately for instant UI response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);

    // Notify backend in background without blocking UI
    authAPI.logout().catch(() => {});
  }, []);

  const updateUser = useCallback((userData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
