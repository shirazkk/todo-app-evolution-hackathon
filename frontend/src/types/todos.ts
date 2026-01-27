// TodoItem represents a single todo item with all its properties
export interface TodoItem {
  id: string;                    // UUID from backend
  user_id: string;               // Associated user ID
  title: string;                 // Todo title (1-200 chars)
  description?: string;          // Optional description (max 1000 chars)
  priority: 'high' | 'medium' | 'low';  // Priority level
  completed: boolean;            // Completion status
  created_at: string;            // Creation timestamp (ISO string from backend)
  updated_at: string;            // Last update timestamp (ISO string from backend)
  completed_at?: string;         // Completion timestamp (if completed) (ISO string from backend)
}

// TodoListResponse structure for fetching multiple todos
export interface TodoListResponse {
  todos: TodoItem[];
  total: number;
  filters_applied: {
    status: 'all' | 'pending' | 'completed';
    sort_by: 'created_at' | 'priority' | 'title';
    order: 'asc' | 'desc';
  };
}

// Request models for API operations

// CreateTodoRequest payload for creating a new todo
export interface CreateTodoRequest {
  title: string;                 // Todo title (1-200 chars)
  description?: string;          // Optional description (max 1000 chars)
  priority?: 'high' | 'medium' | 'low';  // Priority level, defaults to 'medium'
}

// UpdateTodoRequest payload for updating an existing todo (full update)
export interface UpdateTodoRequest {
  title: string;                 // Todo title (1-200 chars)
  description?: string;          // Optional description (max 1000 chars)
  priority: 'high' | 'medium' | 'low';  // Priority level
}

// PartialUpdateTodoRequest payload for partially updating a todo
export interface PartialUpdateTodoRequest {
  title?: string;                // Todo title (1-200 chars if provided)
  description?: string;          // Optional description (max 1000 chars)
  priority?: 'high' | 'medium' | 'low';  // Priority level
}

// ToggleCompleteRequest payload for toggling todo completion status
export interface ToggleCompleteRequest {
  completed: boolean;            // New completion status
}

// UI State models

// TodoFilters client-side filtering state for todo lists
export interface TodoFilters {
  status: 'all' | 'pending' | 'completed';
  sort_by: 'created_at' | 'priority' | 'title';
  order: 'asc' | 'desc';
  search_term?: string;          // Text search term
}

// TodoFormState state for todo creation/editing forms
export interface TodoFormState {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  loading: boolean;
  error?: string;
}