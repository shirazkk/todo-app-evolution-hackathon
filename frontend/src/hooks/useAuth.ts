import { useContext } from 'react';
import { AuthContextType } from '@/lib/types';
import { AuthContext } from '@/components/providers/AuthProvider'; // This assumes we export the context from AuthProvider

// This is the hook that uses the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Note: The actual implementation would be in the AuthProvider component
// This hook just provides a way to access the context from any component