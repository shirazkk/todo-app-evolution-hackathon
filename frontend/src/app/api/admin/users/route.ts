import { NextRequest } from 'next/server';
import { validateAdminCredentials } from '@/lib/auth';

// This API route will validate admin credentials and fetch users from the backend
export async function GET(request: NextRequest) {
  try {
    // Extract admin credentials from the request (could be from headers, body, or cookies)
    const authHeader = request.headers.get('authorization');

    // For simplicity, we'll check if the admin is authenticated via localStorage on the client
    // In a real-world scenario, this would validate credentials from the request
    const isAdmin = request.cookies.get('isAdminAuthenticated')?.value === 'true' ||
                   request.headers.get('x-admin-authenticated') === 'true';

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, this would make a request to the backend API
    // to fetch user data, using admin credentials to authenticate with the backend
    // For now, we'll return a mock response

    // Example of how to make a request to the backend:
    // const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
    //   headers: {
    //     'Authorization': `Bearer ${adminBackendToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    //
    // const users = await backendResponse.json();

    // Mock response for demonstration
    const mockUsers = [
      {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
        createdAt: '2023-01-15T08:30:00Z',
      },
      {
        id: 'user-2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        createdAt: '2023-02-20T10:15:00Z',
      },
    ];

    return new Response(JSON.stringify({ users: mockUsers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}