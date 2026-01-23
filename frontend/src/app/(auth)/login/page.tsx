'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import AuthGuard from '@/components/auth/AuthGuard';

const LoginPage = () => {
  return (
    <AuthGuard requireAuth={false}> {/* Only show to unauthenticated users */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </AuthGuard>
  );
};

export default LoginPage;