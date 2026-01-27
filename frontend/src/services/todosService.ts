import { apiRequest } from '../lib/api';
import {
  TodoItem,
  TodoListResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  PartialUpdateTodoRequest,
  ToggleCompleteRequest
} from '../types/todos';

// Todos service to handle todo operations
export const todosService = {
  // Get user's todos with optional filtering and sorting
  getUserTodos: async (
    userId: string,
    status?: 'all' | 'pending' | 'completed',
    sortBy?: 'created_at' | 'priority' | 'title',
    order?: 'asc' | 'desc'
  ): Promise<TodoListResponse> => {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (sortBy) params.sort_by = sortBy;
      if (order) params.order = order;

      const response = await apiRequest.get<TodoListResponse>(`/users/${userId}/todos`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while fetching todos'
      );
    }
  },

  // Create a new todo
  createTodo: async (userId: string, todoData: CreateTodoRequest): Promise<TodoItem> => {
    try {
      const response = await apiRequest.post<TodoItem>(`/users/${userId}/todos`, todoData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while creating the todo'
      );
    }
  },

  // Get a specific todo by ID
  getTodoById: async (userId: string, todoId: string): Promise<TodoItem> => {
    try {
      const response = await apiRequest.get<TodoItem>(`/users/${userId}/todos/${todoId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while fetching the todo'
      );
    }
  },

  // Update a todo (full update)
  updateTodo: async (userId: string, todoId: string, todoData: UpdateTodoRequest): Promise<TodoItem> => {
    try {
      const response = await apiRequest.put<TodoItem>(`/users/${userId}/todos/${todoId}`, todoData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while updating the todo'
      );
    }
  },

  // Partially update a todo
  partialUpdateTodo: async (userId: string, todoId: string, todoData: PartialUpdateTodoRequest): Promise<TodoItem> => {
    try {
      const response = await apiRequest.patch<TodoItem>(`/users/${userId}/todos/${todoId}`, todoData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while updating the todo'
      );
    }
  },

  // Toggle todo completion status
  toggleTodoCompletion: async (userId: string, todoId: string, completed: boolean): Promise<TodoItem> => {
    try {
      const response = await apiRequest.patch<TodoItem>(
        `/users/${userId}/todos/${todoId}/complete`,
        { completed } as ToggleCompleteRequest
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while toggling the todo completion status'
      );
    }
  },

  // Delete a todo
  deleteTodo: async (userId: string, todoId: string): Promise<{ message: string; deleted_id: string }> => {
    try {
      const response = await apiRequest.delete<{ message: string; deleted_id: string }>(`/users/${userId}/todos/${todoId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'An error occurred while deleting the todo'
      );
    }
  },
};