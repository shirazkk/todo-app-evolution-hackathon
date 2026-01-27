'use client'
import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from '../services/authService';
import { UserResponse } from '../types/auth';

// Define the authentication context type
interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<UserResponse | null>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around parts of the app that need authentication
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setAuthenticated(true);
        }
      } catch (error) {
        // If token is invalid or expired, clear it
        authService.logout();
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await authService.signup({ email, password, name });
      setUser(response.user);
      setAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthenticated(false);
  };

  // Get current user function
  const getCurrentUser = async (): Promise<UserResponse | null> => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setAuthenticated(true);
      return userData;
    } catch (error) {
      logout();
      return null;
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    authenticated,
    login,
    signup,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value= { contextValue } >
    { children }
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};