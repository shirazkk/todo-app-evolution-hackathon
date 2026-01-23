'use client';

import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import UserTodos from '@/components/admin/UserTodos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserDetailView = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/admin');
  };

  return (
    <AdminGuard>
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>

        <UserTodos />
      </div>
    </AdminGuard>
  );
};

export default UserDetailView;