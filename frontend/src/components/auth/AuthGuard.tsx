'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires authentication; if false, requires no authentication
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !authenticated) {
        router.push('/auth/login');
      } else if (!requireAuth && authenticated) {
        router.push('/dashboard');
      }
    }
  }, [authenticated, loading, requireAuth, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If the user is not authenticated and this is a protected route, don't render children
  if (requireAuth && !authenticated) {
    return null;
  }

  // If the user is authenticated and this is a public route (like login/signup), don't render children
  if (!requireAuth && authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;