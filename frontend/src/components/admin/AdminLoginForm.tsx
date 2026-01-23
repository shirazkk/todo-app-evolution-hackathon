'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { validateAdminCredentials } from '@/lib/auth';

// Define admin login form schema with Zod
const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Define type for form data
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLoginForm = () => {
  const router = useRouter();

  // Set up form with react-hook-form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      // Validate admin credentials against environment variables
      const isValid = validateAdminCredentials(data.email, data.password);

      if (isValid) {
        // Store admin session in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');

        // Redirect to admin dashboard after successful login
        router.push('/admin');
        router.refresh(); // Refresh to update the UI with the new authentication state
      } else {
        // Set error to display in the form
        setError('root', {
          type: 'manual',
          message: 'Invalid admin credentials. Please check your email and password.',
        });
      }
    } catch (err: any) {
      // Set error to display in the form
      setError('root', {
        type: 'manual',
        message: err?.message || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter your admin credentials to access the admin panel</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Admin Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {errors.root.message}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Signing in...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </Button>

          {/* Link to regular login */}
          <div className="mt-4 text-center text-sm">
            Back to user dashboard?{' '}
            <a href="/dashboard" className="underline">
              Go to dashboard
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminLoginForm;