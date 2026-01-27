'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTodosContext } from '../../context/TodosContext';
import TodoList from '../../components/todos/TodoList';

export default function DashboardPage() {
  const router = useRouter();
  const { authenticated, loading, user } = useAuth();
  const { fetchTodos } = useTodosContext();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/auth/login');
    }

    if (authenticated && user?.id) {
      fetchTodos(user.id);
    }
  }, [authenticated, loading, router, user, fetchTodos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently and stay productive</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Tasks</h3>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Completed</h3>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Pending</h3>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
            </div>
          </div>
        </div>

        <TodoList />
      </div>
    </div>
  );
}