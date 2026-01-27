# Frontend Todo Application - Quickstart Guide

## Overview
This guide provides quick setup and development instructions for the frontend todo application.

## Prerequisites
- Node.js 18+ with npm/yarn
- Access to the backend API (running on localhost:8000 or configured endpoint)
- Git for version control

## Setup Instructions

### 1. Clone and Navigate
```bash
# Navigate to project root
cd hackathon-2-todo-application
```

### 2. Create Frontend Directory Structure
```bash
mkdir -p frontend/src/{app,components,hooks,lib,types}
mkdir -p frontend/src/app/{(auth),dashboard}
mkdir -p frontend/src/app/(auth)/{login,signup}
mkdir -p frontend/src/components/{auth,layout,todos,ui}
mkdir -p frontend/src/hooks
mkdir -p frontend/src/lib
mkdir -p frontend/src/types
```



### 3. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Todo Application"
```

Create `.env.example` for documentation:
```env
NEXT_PUBLIC_API_BASE_URL=your_backend_api_url_here
NEXT_PUBLIC_APP_NAME="Todo Application"
```



## Development Commands

### Start Development Server
```bash
cd frontend
npm run dev
```
Application will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Key Components to Implement

### 1. Authentication Components
- LoginForm: Handles user login with validation
- SignupForm: Handles user registration with validation
- AuthProvider: Context provider for authentication state

### 2. Todo Components
- TodoForm: Create/edit todo items
- TodoItem: Display individual todo with actions
- TodoList: Display collection of todos with filtering

### 3. Layout Components
- Navbar: Responsive navigation with auth-aware elements
- Layout: Main application layout with providers

### 4. Utility Hooks
- useAuth: Manage authentication state and operations
- useTodos: Handle todo operations and state

## API Integration Points

### Authentication Endpoints
- POST `/auth/signup` - User registration
- POST `/auth/login` - User authentication
- GET `/auth/me` - Current user info
- POST `/auth/logout` - Session logout

### Todo Endpoints
- GET `/users/{user_id}/todos` - Get user todos
- POST `/users/{user_id}/todos` - Create todo
- GET `/users/{user_id}/todos/{todo_id}` - Get specific todo
- PUT `/users/{user_id}/todos/{todo_id}` - Update todo
- PATCH `/users/{user_id}/todos/{todo_id}` - Partial update
- PATCH `/users/{user_id}/todos/{todo_id}/complete` - Toggle completion
- DELETE `/users/{user_id}/todos/{todo_id}` - Delete todo

## Testing Strategy

### Unit Tests
- Component rendering and props
- Custom hook functionality
- Utility functions

### Integration Tests
- API client functionality
- Form submissions
- State management

### E2E Tests
- User authentication flows
- Todo CRUD operations
- Navigation flows

## Deployment

### Build and Serve
```bash
npm run build
npm run start  # Runs production server on port 3000
```

### Environment Variables for Different Environments
- Development: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
- Staging: NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com
- Production: NEXT_PUBLIC_API_BASE_URL=https://api.example.com

## Troubleshooting

### Common Issues
1. **API Connection Errors**: Verify backend is running and URL is correct
2. **Authentication Failures**: Check token storage and expiration handling
3. **TypeScript Errors**: Ensure all API responses match defined interfaces
4. **Styling Issues**: Verify Tailwind CSS is properly configured

### Debugging Tips
- Check browser console for API errors
- Verify JWT token format and expiration
- Confirm all required environment variables are set
- Review network tab for failed API requests