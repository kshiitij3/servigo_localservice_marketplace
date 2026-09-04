/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('servigo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('servigo_token') || localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('servigo:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('servigo:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(credentials);
      const userData = response?.data?.data?.user || response?.data?.user || response?.user;
      const tokenData = response?.data?.data?.token || response?.data?.token || response?.token;

      if (userData) {
        setUser(userData);
        localStorage.setItem('servigo_user', JSON.stringify(userData));
      }
      if (tokenData) {
        setToken(tokenData);
        localStorage.setItem('servigo_token', tokenData);
      }
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(userData);
      const userObj = response?.data?.data?.user || response?.data?.user || response?.user;
      const tokenData = response?.data?.data?.token || response?.data?.token || response?.token;

      if (userObj) {
        setUser(userObj);
        localStorage.setItem('servigo_user', JSON.stringify(userObj));
      }
      if (tokenData) {
        setToken(tokenData);
        localStorage.setItem('servigo_token', tokenData);
      }
      return response;
    } catch (err) {
      const validationErrors = err?.response?.data?.data?.errors;
      const conflictMessage = err?.response?.status === 409
        ? err?.response?.data?.message || 'An account with this email or phone number already exists. Please log in.'
        : null;
      const message = conflictMessage || (validationErrors?.length
        ? validationErrors.map(({ msg, path }) => `${path}: ${msg}`).join('. ')
        : err?.response?.data?.message || err?.message || 'Registration failed');
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('servigo_token');
      localStorage.removeItem('servigo_user');
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('servigo_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user || token),
    isLoading,
    loading: isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
