import { useState, useEffect, useCallback } from 'react';
import { todosService } from '../services/todosService';
import { TodoItem, TodoListResponse, TodoFilters, CreateTodoRequest, UpdateTodoRequest, PartialUpdateTodoRequest } from '../types/todos';

interface UseTodosReturn {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
  fetchTodos: (userId: string, filters?: TodoFilters) => Promise<void>;
  createTodo: (userId: string, todoData: CreateTodoRequest) => Promise<TodoItem>;
  updateTodo: (userId: string, todoId: string, todoData: UpdateTodoRequest) => Promise<TodoItem>;
  partialUpdateTodo: (userId: string, todoId: string, todoData: PartialUpdateTodoRequest) => Promise<TodoItem>;
  toggleTodoCompletion: (userId: string, todoId: string) => Promise<TodoItem>;
  deleteTodo: (userId: string, todoId: string) => Promise<void>;
  setFilters: (filters: TodoFilters) => void;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    sort_by: 'created_at',
    order: 'desc',
    search_term: undefined,
  });

  // Fetch todos with filters
  const fetchTodos = useCallback(async (userId: string, customFilters?: TodoFilters) => {
    setLoading(true);
    setError(null);

    try {
      const activeFilters = customFilters || filters;
      const response: TodoListResponse = await todosService.getUserTodos(
        userId,
        activeFilters.status,
        activeFilters.sort_by,
        activeFilters.order
      );

      // Apply search filter client-side if needed
      let filteredTodos = response.todos;
      if (activeFilters.search_term) {
        const searchTerm = activeFilters.search_term.toLowerCase();
        filteredTodos = filteredTodos.filter(todo =>
          todo.title.toLowerCase().includes(searchTerm) ||
          (todo.description && todo.description.toLowerCase().includes(searchTerm))
        );
      }

      setTodos(filteredTodos);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create a new todo
  const createTodo = async (userId: string, todoData: CreateTodoRequest): Promise<TodoItem> => {
    setLoading(true);
    setError(null);

    try {
      const newTodo = await todosService.createTodo(userId, todoData);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a todo (full update)
  const updateTodo = async (userId: string, todoId: string, todoData: UpdateTodoRequest): Promise<TodoItem> => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodo = await todosService.updateTodo(userId, todoId, todoData);
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === todoId ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Partially update a todo
  const partialUpdateTodo = async (userId: string, todoId: string, todoData: PartialUpdateTodoRequest): Promise<TodoItem> => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodo = await todosService.partialUpdateTodo(userId, todoId, todoData);
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === todoId ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodoCompletion = async (userId: string, todoId: string): Promise<TodoItem> => {
    setLoading(true);
    setError(null);

    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) {
        throw new Error('Todo not found');
      }

      const updatedTodo = await todosService.toggleTodoCompletion(userId, todoId, !todo.completed);
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === todoId ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle todo completion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await todosService.deleteTodo(userId, todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    filters,
    fetchTodos,
    createTodo,
    updateTodo,
    partialUpdateTodo,
    toggleTodoCompletion,
    deleteTodo,
    setFilters,
  };
};



