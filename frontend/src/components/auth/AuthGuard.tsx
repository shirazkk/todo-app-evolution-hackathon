import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, only allow authenticated users; if false, only allow unauthenticated users
  redirectTo?: string; // Where to redirect if access is denied
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If still loading, nothing to do
    if (loading) return;

    // If we require authentication but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }

    // If we don't require authentication but user IS authenticated
    if (!requireAuth && isAuthenticated) {
      router.push('/dashboard'); // Redirect authenticated users away from login/signup pages
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // If the authentication state doesn't match the requirement, don't render children
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  // Render children if authentication requirements are met
  return <>{children}</>;
};

export default AuthGuard;