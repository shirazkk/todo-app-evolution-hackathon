'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { authService } from '@/lib/api';
import { decodeToken, getAccessToken, isAuthenticated, removeAccessToken, storeAccessToken } from '@/lib/auth';

// Create Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();
        if (token && isAuthenticated()) {
          // Decode token to get user info
          const decoded = decodeToken(token);
          if (decoded) {
            // Get user details from backend
            const response = await authService.getMe();
            setUser(response.data);
            setToken(token);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clear invalid token
        removeAccessToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      // Store token
      storeAccessToken(response.data.token);
      setToken(response.data.token);

      // Set user
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.signup(email, password, name);

      // Store token
      storeAccessToken(response.data.token);
      setToken(response.data.token);

      // Set user
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeAccessToken();
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Memoized context value
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;