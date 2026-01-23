'use client';

import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import AuthGuard from '@/components/auth/AuthGuard';

const SignupPage = () => {
  return (
    <AuthGuard requireAuth={false}> {/* Only show to unauthenticated users */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </AuthGuard>
  );
};

export default SignupPage;