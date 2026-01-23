import { useState, useCallback } from 'react';

// Define error handling types
interface ErrorState {
  message: string | null;
  severity: 'info' | 'warning' | 'error' | 'success';
  isVisible: boolean;
}

interface UseErrorHandlingReturn {
  error: ErrorState;
  showError: (message: string, severity?: 'info' | 'warning' | 'error' | 'success') => void;
  hideError: () => void;
  clearError: () => void;
  handleError: (error: any, defaultMessage?: string) => void;
}

export const useErrorHandling = (): UseErrorHandlingReturn => {
  const [error, setError] = useState<ErrorState>({
    message: null,
    severity: 'error',
    isVisible: false,
  });

  const showError = useCallback((message: string, severity: 'info' | 'warning' | 'error' | 'success' = 'error') => {
    setError({
      message,
      severity,
      isVisible: true,
    });
  }, []);

  const hideError = useCallback(() => {
    setError(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const clearError = useCallback(() => {
    setError({
      message: null,
      severity: 'error',
      isVisible: false,
    });
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string = 'An error occurred') => {
    let errorMessage = defaultMessage;

    // Extract error message from different possible sources
    if (error?.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    showError(errorMessage, 'error');
  }, [showError]);

  return {
    error,
    showError,
    hideError,
    clearError,
    handleError,
  };
};

// Error boundary component
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <div className="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Utility function to handle network errors
export const handleNetworkError = (error: any): string => {
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network.';
  }

  if (error?.response?.status === 401) {
    return 'Session expired. Please log in again.';
  }

  if (error?.response?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }

  if (error?.response?.status === 404) {
    return 'Requested resource not found.';
  }

  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  if (error?.message?.includes('Network Error')) {
    return 'Network error. Please check your connection.';
  }

  return 'An unexpected error occurred. Please try again.';
};