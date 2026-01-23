import { useState, useEffect } from 'react';
import { Todo } from '@/lib/types';
import { todoService } from '@/lib/api';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (title: string, description?: string, completed?: boolean) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoCompletion: (id: string, completed: boolean) => Promise<void>;
  refetchTodos: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await todoService.getAllTodos();
        setTodos(response.data.todos || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch todos');
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const refetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getAllTodos();
      setTodos(response.data.todos || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string, description?: string, completed: boolean = false) => {
    try {
      setLoading(true);
      const response = await todoService.createTodo(title, description, completed);
      setTodos(prev => [...prev, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      const response = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...response.data } : todo));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoCompletion = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await todoService.toggleTodoCompletion(id, completed);
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: response.data.completed } : todo
      ));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update todo status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    refetchTodos,
  };
};