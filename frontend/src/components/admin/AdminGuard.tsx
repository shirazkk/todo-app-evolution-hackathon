import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    // If not authenticated as admin, redirect to admin login
    if (!isAdminAuthenticated) {
      // Don't redirect if already on the login page
      if (pathname !== '/admin-login') {
        router.push('/admin-login');
      }
    }
  }, [router, pathname]);

  // Check admin authentication status
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  // Show loading state while checking authentication
  if (!isAdminAuthenticated && pathname !== '/admin-login') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <span className="ml-2">Checking admin access...</span>
      </div>
    );
  }

  // Render children if admin authentication requirements are met
  return <>{children}</>;
};

export default AdminGuard;