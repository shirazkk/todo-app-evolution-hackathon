// User session interface representing the current user's authenticated state
export interface UserSession {
  id: string;                    // User ID from backend
  email: string;                 // User's email address
  name: string;                  // User's display name
  created_at: string;            // Account creation timestamp (ISO string from backend)
  token: string;                 // JWT access token
  expires_at: string;            // Token expiration timestamp (ISO string from backend)
}

// AuthResponse data structure returned from authentication endpoints
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    created_at: string;  // ISO date string from backend
  };
  token: string;
  expires_at: string;    // ISO date string from backend
}

// SignupRequest payload for user registration
export interface SignupRequest {
  email: string;                 // User's email address
  password: string;              // User's password (8+ chars, with requirements)
  name: string;                  // User's display name (2-100 chars)
}

// LoginRequest payload for user authentication
export interface LoginRequest {
  email: string;                 // User's email address
  password: string;              // User's password
}

// ApiResponse for logout operation
export interface LogoutResponse {
  message: string;
}

// User info response from /auth/me endpoint
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Standardized error response from API calls
export interface ApiError {
  error?: string;                // Error type identifier
  detail: string;                // Human-readable error message
  details?: any;                 // Additional error details
}

// Field-level validation errors
export interface ValidationError {
  field: string;                 // Field name
  message: string;               // Validation error message
}