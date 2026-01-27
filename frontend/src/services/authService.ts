
import { apiRequest } from '../lib/api';
import { AuthResponse, SignupRequest, LoginRequest } from '../types/auth';

// Authentication service to handle user authentication operations
export const authService = {
  // Register a new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest.post<AuthResponse>('/auth/signup', userData);
      // Store the token in localStorage upon successful signup
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred during signup'
      );
    }
  },

  // Authenticate user login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest.post<AuthResponse>('/auth/login', credentials);
      // Store the token in localStorage upon successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred during login'
      );
    }
  },

  // Logout user (client-side token removal)
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await apiRequest.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while fetching user info'
      );
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get token from storage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};