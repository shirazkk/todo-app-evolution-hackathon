'use client';

import React from 'react';
import { useTodos } from '@/hooks/useApiCache';
import { Todo } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import TodoItem from '@/components/todos/TodoItem';
import TodoSkeleton from '@/components/todos/TodoSkeleton';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TodoList = () => {
  const {
    todos,
    isLoading,
    error,
    toggleTodo,
    deleteTodo,
    isToggling,
    isDeleting
  } = useTodos();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <TodoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error loading todos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Todos</h2>
        <Button onClick={() => router.push('/dashboard/new')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {todos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No todos yet. Add your first todo!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todos.map((todo: Todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              isToggling={isToggling}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;