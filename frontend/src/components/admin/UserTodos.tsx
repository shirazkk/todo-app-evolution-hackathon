'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useRouter, useParams } from 'next/navigation';
import TodoItem from '@/components/todos/TodoItem';

// Define Todo type
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Define User type
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const UserTodos = () => {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // Get user ID from URL params
  const userId = params.userId as string;

  // Simulating fetching user todos from a Next.js API route that validates admin credentials
  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        setLoading(true);

        // This would call a Next.js API route that validates admin credentials
        // and then fetches user's todos from the backend
        const userResponse = await fetch(`/api/admin/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        const todosResponse = await fetch(`/api/admin/users/${userId}/todos`);
        if (!todosResponse.ok) {
          throw new Error('Failed to fetch user todos');
        }
        const todosData = await todosResponse.json();
        setTodos(todosData.todos || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching user todos');
        console.error('Error fetching user todos:', err);
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

    if (userId) {
      fetchUserTodos();
    }
  }, [userId, router]);

  // Mock functions for toggling and deleting todos (in real implementation, these would call admin API routes)
  const handleToggleTodo = (id: string, completed: boolean) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2">Loading user and their todos...</span>
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

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium">User ID</h3>
              <p className="text-sm font-mono">{user.id}</p>
            </div>
            <div>
              <h3 className="font-medium">Account Created</h3>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todos for {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos found for this user.</p>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  isToggling={false}
                  isDeleting={false}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTodos;