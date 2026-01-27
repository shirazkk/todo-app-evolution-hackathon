# Data Model: Frontend Todo Application

## Overview
This document defines the frontend data models, types, and structures for the todo application. These models represent the client-side representation of data received from and sent to the backend API.

## User Session Models

### UserSession
Represents the current user's authenticated session state.

```typescript
interface UserSession {
  id: string;                    // User ID from backend
  email: string;                 // User's email address
  name: string;                  // User's display name
  createdAt: Date;              // Account creation timestamp
  token: string;                // JWT access token
  expiresAt: Date;              // Token expiration timestamp
}
```

**Validation Rules**:
- All fields required
- Email must be valid email format
- Token must be non-empty string
- Expiration date must be in the future

### AuthResponse
Data structure returned from authentication endpoints.

```typescript
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    created_at: string;  // ISO date string from backend
  };
  token: string;
  expires_at: string;    // ISO date string from backend
}
```

**Validation Rules**:
- All fields required
- Token length > 0
- Valid ISO date strings

## Todo Models

### TodoItem
Represents a single todo item with all its properties.

```typescript
interface TodoItem {
  id: string;                    // UUID from backend
  userId: string;               // Associated user ID
  title: string;                // Todo title (1-200 chars)
  description?: string;         // Optional description (max 1000 chars)
  priority: 'high' | 'medium' | 'low';  // Priority level
  completed: boolean;           // Completion status
  createdAt: Date;             // Creation timestamp
  updatedAt: Date;             // Last update timestamp
  completedAt?: Date;          // Completion timestamp (if completed)
}
```

**Validation Rules**:
- ID must be valid UUID format
- Title length: 1-200 characters
- Description length: max 1000 characters (if present)
- Priority must be one of 'high', 'medium', 'low'
- createdAt and updatedAt must be valid dates
- completedAt only present when completed is true

### TodoListResponse
Response structure for fetching multiple todos.

```typescript
interface TodoListResponse {
  todos: TodoItem[];
  total: number;
  filtersApplied: {
    status: 'all' | 'pending' | 'completed';
    sortBy: 'created_at' | 'priority' | 'title';
    order: 'asc' | 'desc';
  };
}
```

**Validation Rules**:
- todos array must not be null
- total must be non-negative integer
- filtersApplied object must contain valid values

## API Request Models

### SignupRequest
Request payload for user registration.

```typescript
interface SignupRequest {
  email: string;                 // User's email address
  password: string;              // User's password (8+ chars, with requirements)
  name: string;                  // User's display name (2-100 chars)
}
```

**Validation Rules**:
- Email must be valid format
- Password must be 8+ characters with uppercase, lowercase, and digit
- Name must be 2-100 characters

### LoginRequest
Request payload for user authentication.

```typescript
interface LoginRequest {
  email: string;                 // User's email address
  password: string;              // User's password
}
```

**Validation Rules**:
- Email must be valid format
- Password must be present

### CreateTodoRequest
Request payload for creating a new todo.

```typescript
interface CreateTodoRequest {
  title: string;                 // Todo title (1-200 chars)
  description?: string;          // Optional description (max 1000 chars)
  priority?: 'high' | 'medium' | 'low';  // Priority level, defaults to 'medium'
}
```

**Validation Rules**:
- Title length: 1-200 characters
- Description length: max 1000 characters (if present)
- Priority must be valid if provided

### UpdateTodoRequest
Request payload for updating an existing todo (full update).

```typescript
interface UpdateTodoRequest {
  title: string;                 // Todo title (1-200 chars)
  description?: string;          // Optional description (max 1000 chars)
  priority: 'high' | 'medium' | 'low';  // Priority level
}
```

**Validation Rules**:
- Title length: 1-200 characters
- Description length: max 1000 characters (if present)
- Priority must be one of the valid values

### PartialUpdateTodoRequest
Request payload for partially updating a todo.

```typescript
interface PartialUpdateTodoRequest {
  title?: string;                // Todo title (1-200 chars if provided)
  description?: string;          // Optional description (max 1000 chars)
  priority?: 'high' | 'medium' | 'low';  // Priority level
}
```

**Validation Rules**:
- If title provided, length must be 1-200 characters
- If description provided, length must be max 1000 characters
- If priority provided, must be one of the valid values

### ToggleCompleteRequest
Request payload for toggling todo completion status.

```typescript
interface ToggleCompleteRequest {
  completed: boolean;            // New completion status
}
```

**Validation Rules**:
- Completed must be boolean

## UI State Models

### TodoFilters
Client-side filtering state for todo lists.

```typescript
interface TodoFilters {
  status: 'all' | 'pending' | 'completed';
  sortBy: 'created_at' | 'priority' | 'title';
  order: 'asc' | 'desc';
  searchTerm?: string;          // Text search term
}
```

**Validation Rules**:
- All enum values must be valid
- searchTerm length: max 100 characters (if present)

### TodoFormState
State for todo creation/editing forms.

```typescript
interface TodoFormState {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  loading: boolean;
  error?: string;
}
```

**Validation Rules**:
- Title and description follow same rules as TodoItem
- Loading must be boolean
- Error must be string if present

### AuthFormState
State for authentication forms.

```typescript
interface AuthFormState {
  email: string;
  password: string;
  name?: string;                // For signup only
  loading: boolean;
  error?: string;
}
```

**Validation Rules**:
- Email must be valid format
- Password must meet requirements
- Loading must be boolean
- Error must be string if present

## Error Models

### ApiError
Standardized error response from API calls.

```typescript
interface ApiError {
  error: string;                // Error type identifier
  details?: any;                // Additional error details
  message: string;              // Human-readable error message
}
```

**Validation Rules**:
- Error and message must be non-empty strings

### ValidationError
Field-level validation errors.

```typescript
interface ValidationError {
  field: string;                // Field name
  message: string;              // Validation error message
}
```

**Validation Rules**:
- Both fields required and non-empty

## State Management Models

### AppState
Global application state structure.

```typescript
interface AppState {
  auth: {
    user: UserSession | null;
    loading: boolean;
    authenticated: boolean;
  };
  todos: {
    items: TodoItem[];
    loading: boolean;
    error?: string;
    filters: TodoFilters;
  };
}
```

**Validation Rules**:
- All nested objects follow their respective validation rules
- Loading states must be booleans
- Collections must be proper arrays/objects