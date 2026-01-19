/**
 * Authentication context for the todo application.
 * Manages authentication state across the application.
 */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our auth context
interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth provider component that wraps the application and manages authentication state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real implementation, we would verify the token with the backend
        const token = localStorage.getItem('access_token');
        if (token) {
          // We would normally make a request to verify the token
          // For now, we'll just assume if there's a token, the user is logged in
          // but we don't have the user details yet
          setUser({
            id: 'placeholder-id', // Would come from token or API call
            email: localStorage.getItem('user_email') || '', // Would come from token or API
            name: localStorage.getItem('user_name') || '', // Would come from token or API
          });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear any invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function that authenticates the user and stores the session.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Call the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();

      // Store the token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);

      // In a real implementation, we would fetch user details after login
      setUser({ id: 'placeholder-id', email, name: localStorage.getItem('user_name') || '' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup function that creates a new user account.
   */
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Call the signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await response.json();

      // Store the token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);

      // Set the user in context
      setUser({ id: 'placeholder-id', email, name });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function that clears the session and redirects the user.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setUser(null);
  };

  /**
   * Check if the user is authenticated.
   */
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}