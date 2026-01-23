'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import TodoList from '@/components/todos/TodoList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <AuthGuard requireAuth={true}> {/* Only show to authenticated users */}
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
          <p className="text-gray-600 mt-2">Manage your todos efficiently</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Todos</h2>
          <Button onClick={() => router.push('/dashboard/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Todo
          </Button>
        </div>

        <TodoList />
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;