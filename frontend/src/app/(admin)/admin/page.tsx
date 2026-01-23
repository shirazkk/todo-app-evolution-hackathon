'use client';

import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import UserList from '@/components/admin/UserList';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboardPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem('isAdminAuthenticated');
    logout();
  };

  return (
    <AdminGuard>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and manage users and their activities</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <UserList />
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboardPage;