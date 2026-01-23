'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

// Define User type
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Simulating fetching users from a Next.js API route that validates admin credentials
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // This would call a Next.js API route that validates admin credentials
        // and then fetches user data from the backend
        const response = await fetch('/api/admin/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is admin authenticated
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (!isAdmin) {
      router.push('/admin-login');
      return;
    }

    fetchUsers();
  }, [router]);

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Todos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;