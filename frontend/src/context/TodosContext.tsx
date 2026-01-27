'use client'
import React, { createContext, useContext, ReactNode } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem, TodoListResponse, TodoFilters, CreateTodoRequest, UpdateTodoRequest, PartialUpdateTodoRequest } from '../types/todos';

// Define the todos context type
interface TodosContextType {
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

// Create the todos context
const TodosContext = createContext<TodosContextType | undefined>(undefined);

// TodosProvider component to wrap around parts of the app that need todos functionality
interface TodosProviderProps {
  children: ReactNode;
}

export const TodosProvider: React.FC<TodosProviderProps> = ({ children }) => {
  const todosHook = useTodos();

  return (
    <TodosContext.Provider value={todosHook}>
      {children}
    </TodosContext.Provider>
  );
};

// Custom hook to use todos context
export const useTodosContext = (): TodosContextType => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodosContext must be used within a TodosProvider');
  }
  return context;
};