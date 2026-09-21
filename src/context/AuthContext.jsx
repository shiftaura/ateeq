import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { isMockMode } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state strictly from localStorage token (No automatic bypass)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('mediconsult_token');
        const storedUser = localStorage.getItem('mediconsult_user');

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          } catch (e) {
            localStorage.removeItem('mediconsult_token');
            localStorage.removeItem('mediconsult_user');
            setToken(null);
            setUser(null);
          }
        } else {
          // Explicitly unauthenticated: user must log in
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        localStorage.removeItem('mediconsult_token');
        localStorage.removeItem('mediconsult_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    // Authenticate through authService (validates credentials strictly)
    const data = await authService.login(email, password);
    const authToken = data.token;
    const authUser = data.user;

    if (!authToken || !authUser) {
      throw new Error('Authentication succeeded but returned invalid session data');
    }

    localStorage.setItem('mediconsult_token', authToken);
    localStorage.setItem('mediconsult_user', JSON.stringify(authUser));

    setToken(authToken);
    setUser(authUser);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const authToken = data.token;
    const authUser = data.user;

    if (authToken && authUser) {
      localStorage.setItem('mediconsult_token', authToken);
      localStorage.setItem('mediconsult_user', JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mediconsult_token');
    localStorage.removeItem('mediconsult_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const merged = { ...user, ...updatedData };
    localStorage.setItem('mediconsult_user', JSON.stringify(merged));
    setUser(merged);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    isMockMode,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
