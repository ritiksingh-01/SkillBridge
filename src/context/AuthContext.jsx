import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

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
      return stored ? normalizeUser(JSON.parse(stored)) : null;
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
      // Validate session with server (F11)
      const res = await authAPI.getMe();
      if (res.data?.user) {
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

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

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
