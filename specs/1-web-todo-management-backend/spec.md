# Backend Specification: Web-Based Todo Management API with Authentication

**Feature Branch**: `1-web-todo-management-backend`
**Created**: 2026-01-20
**Status**: Draft
**Scope**: Backend API Only (No Frontend)

## Overview

This specification defines the backend implementation for a multi-user todo management system. This is **backend-only** - no frontend development is included in this phase.

### Tech Stack

- **Language**: Python 3.11+
- **API Framework**: FastAPI
- **Database**: Neon Serverless PostgreSQL (https://neon.com)
- **Authentication**: Better Auth (https://www.better-auth.com)
- **ORM**: SQLAlchemy 2.0+ (async)
- **Migration Tool**: Alembic
- **Validation**: Pydantic v2
- **Password Hashing**: bcrypt

### Architecture Overview

```
Client Request
    ↓
FastAPI Router
    ↓
Better Auth Middleware (JWT verification)
    ↓
Pydantic Validation
    ↓
Business Logic Layer
    ↓
SQLAlchemy ORM
    ↓
Neon PostgreSQL Database
```

---

## User Stories

### Authentication Stories

1. **As a new user**, I want to sign up with email/password via API so I can have my own todo account
2. **As a returning user**, I want to log in via API to receive a JWT token for accessing protected endpoints
3. **As an authenticated user**, I want my JWT token to be validated on each protected API request

### Todo Management Stories

4. **As a logged-in user**, I want to create todos via POST API with title, description, and priority
5. **As a logged-in user**, I want to retrieve all my todos via GET API (only mine, not other users')
6. **As a logged-in user**, I want to update my todo details via PUT/PATCH API
7. **As a logged-in user**, I want to delete my todos via DELETE API
8. **As a logged-in user**, I want to mark todos as complete/incomplete via PATCH API
9. **As a logged-in user**, I want to filter todos by status via query parameters (all/pending/completed)

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
**Purpose**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Success Response (201)**:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-01-20T10:00:00Z"
  },
  "token": "jwt-token-here"
}
```

**Error Responses**:
- 400: Invalid email format, weak password, or validation errors
- 409: Email already registered

---

#### POST `/api/auth/login`
**Purpose**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200)**:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here",
  "expires_at": "2026-01-27T10:00:00Z"
}
```

**Error Responses**:
- 401: Invalid credentials
- 429: Rate limit exceeded (5 attempts per minute)

---

#### POST `/api/auth/logout`
**Purpose**: Invalidate current JWT token

**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "message": "Successfully logged out"
}
```

---

### Todo Endpoints (All require JWT authentication)

#### POST `/api/users/{user_id}/todos`
**Purpose**: Create a new todo

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high"
}
```

**Success Response (201)**:
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "completed": false,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:00:00Z"
}
```

**Error Responses**:
- 400: Validation error (empty title, title too long, etc.)
- 401: Invalid or expired token
- 403: user_id in URL doesn't match JWT user_id

---

#### GET `/api/users/{user_id}/todos`
**Purpose**: Retrieve all todos for authenticated user

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status`: Optional filter - "all" (default), "pending", "completed"
- `sort_by`: Optional - "created_at" (default), "priority", "title"
- `order`: Optional - "desc" (default), "asc"

**Success Response (200)**:
```json
{
  "todos": [
    {
      "id": "uuid-1",
      "user_id": "uuid-here",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "priority": "high",
      "completed": false,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 1,
  "filters_applied": {
    "status": "all",
    "sort_by": "created_at",
    "order": "desc"
  }
}
```

**Error Responses**:
- 401: Invalid or expired token
- 403: user_id doesn't match JWT user_id

---

#### GET `/api/users/{user_id}/todos/{todo_id}`
**Purpose**: Retrieve a specific todo

**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "completed": false,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:00:00Z"
}
```

**Error Responses**:
- 401: Invalid or expired token
- 403: Todo belongs to different user
- 404: Todo not found

---

#### PUT `/api/users/{user_id}/todos/{todo_id}`
**Purpose**: Update a todo (replaces all fields)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium"
}
```

**Success Response (200)**:
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "completed": false,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:30:00Z"
}
```

**Error Responses**:
- 400: Validation error
- 401: Invalid or expired token
- 403: Todo belongs to different user
- 404: Todo not found

---

#### PATCH `/api/users/{user_id}/todos/{todo_id}`
**Purpose**: Partially update a todo (updates only provided fields)

**Headers**: `Authorization: Bearer <token>`

**Request Body** (all fields optional):
```json
{
  "title": "New title",
  "priority": "low"
}
```

**Success Response (200)**:
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "title": "New title",
  "description": "Original description unchanged",
  "priority": "low",
  "completed": false,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:35:00Z"
}
```

---

#### PATCH `/api/users/{user_id}/todos/{todo_id}/complete`
**Purpose**: Toggle todo completion status

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "completed": true
}
```

**Success Response (200)**:
```json
{
  "id": "uuid-here",
  "user_id": "uuid-here",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "completed": true,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:40:00Z",
  "completed_at": "2026-01-20T10:40:00Z"
}
```

---

#### DELETE `/api/users/{user_id}/todos/{todo_id}`
**Purpose**: Permanently delete a todo

**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "message": "Todo deleted successfully",
  "deleted_id": "uuid-here"
}
```

**Error Responses**:
- 401: Invalid or expired token
- 403: Todo belongs to different user
- 404: Todo not found

---

## Database Schema

### Table: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
```

### Table: `todos`

```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT title_length CHECK (LENGTH(title) <= 200),
    CONSTRAINT description_length CHECK (description IS NULL OR LENGTH(description) <= 1000),
    CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_priority ON todos(priority);
```

### Table: `sessions` (for Better Auth token management)

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_expiration CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
```

---

## Pydantic Models

### Request Models

```python
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Literal
from datetime import datetime

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least 1 uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least 1 lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least 1 number')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CreateTodoRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Literal['high', 'medium', 'low'] = 'medium'
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or only whitespace')
        return v.strip()

class UpdateTodoRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Literal['high', 'medium', 'low']

class PartialUpdateTodoRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[Literal['high', 'medium', 'low']] = None

class ToggleCompleteRequest(BaseModel):
    completed: bool
```

### Response Models

```python
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    token: str
    expires_at: datetime

class TodoResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    priority: str
    completed: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TodoListResponse(BaseModel):
    todos: list[TodoResponse]
    total: int
    filters_applied: dict
```

---

## Functional Requirements

### Authentication Requirements

- **FR-001**: System MUST validate email format using Pydantic EmailStr during signup/login
- **FR-002**: System MUST validate password contains at least 8 characters, 1 uppercase, 1 lowercase, 1 digit during signup
- **FR-003**: System MUST hash passwords using bcrypt with cost factor 12 before storing in database
- **FR-004**: System MUST generate JWT tokens with 7-day expiration using Better Auth upon successful authentication
- **FR-005**: System MUST validate JWT tokens on all protected endpoints using Better Auth middleware
- **FR-006**: System MUST implement rate limiting of 5 login attempts per minute per IP using slowapi or similar
- **FR-007**: System MUST return 401 Unauthorized for invalid or expired tokens
- **FR-008**: System MUST return 409 Conflict when attempting to register with existing email

### Todo Management Requirements

- **FR-009**: System MUST validate todo title is 1-200 characters and not only whitespace
- **FR-010**: System MUST validate todo description does not exceed 1000 characters when provided
- **FR-011**: System MUST validate priority is one of: "high", "medium", "low"
- **FR-012**: System MUST associate each todo with user_id extracted from validated JWT token
- **FR-013**: System MUST verify user_id in URL path matches user_id claim in JWT for all todo operations
- **FR-014**: System MUST return 403 Forbidden when user attempts to access another user's todos
- **FR-015**: System MUST return todos sorted by created_at descending by default
- **FR-016**: System MUST support filtering todos by status: "all", "pending", "completed"
- **FR-017**: System MUST support sorting todos by: created_at, priority, title
- **FR-018**: System MUST update updated_at timestamp on every todo modification
- **FR-019**: System MUST set completed_at timestamp when marking todo as complete
- **FR-020**: System MUST clear completed_at timestamp when marking todo as incomplete

### Data Isolation Requirements

- **FR-021**: System MUST implement database-level foreign key constraints (user_id references users.id)
- **FR-022**: System MUST add WHERE user_id = ? clause to all todo queries
- **FR-023**: System MUST validate ownership before update/delete operations
- **FR-024**: System MUST use CASCADE DELETE to remove all user's todos when user is deleted

### Error Handling Requirements

- **FR-025**: System MUST return consistent error response format with error code, message, and details
- **FR-026**: System MUST log all authentication failures with IP address and timestamp
- **FR-027**: System MUST return 404 Not Found for non-existent resources
- **FR-028**: System MUST return 400 Bad Request with validation details for invalid input
- **FR-029**: System MUST handle database connection errors gracefully with 503 Service Unavailable

---

## Non-Functional Requirements

### Performance

- **NFR-001**: API endpoints MUST respond within 500ms for 95% of requests (local development)
- **NFR-002**: Database queries MUST use appropriate indexes for user_id, created_at, completed, priority
- **NFR-003**: System MUST use SQLAlchemy async sessions for non-blocking database operations
- **NFR-004**: System MUST implement connection pooling for Neon PostgreSQL (min 5, max 20 connections)

### Security

- **NFR-005**: System MUST use HTTPS only in production (enforced via FastAPI middleware)
- **NFR-006**: System MUST implement CORS with specific allowed origins (no wildcard in production)
- **NFR-007**: System MUST sanitize all user inputs to prevent SQL injection (via SQLAlchemy parameterized queries)
- **NFR-008**: System MUST not expose internal error details in production responses
- **NFR-009**: System MUST implement request timeout of 30 seconds
- **NFR-010**: System MUST validate Content-Type header is application/json for POST/PUT/PATCH requests

### Code Quality

- **NFR-011**: Code MUST follow PEP 8 style guidelines (enforced via black and ruff)
- **NFR-012**: All endpoints MUST have OpenAPI documentation via FastAPI automatic generation
- **NFR-013**: All database models MUST have type hints
- **NFR-014**: Code MUST achieve minimum 80% test coverage
- **NFR-015**: All functions MUST have docstrings following Google style guide

### Observability

- **NFR-016**: System MUST log all API requests with method, path, status code, duration
- **NFR-017**: System MUST log all authentication events (success/failure)
- **NFR-018**: System MUST use structured logging (JSON format) for production
- **NFR-019**: System MUST expose health check endpoint at GET `/health`
- **NFR-020**: System MUST expose metrics endpoint at GET `/metrics` for monitoring

---

## Acceptance Scenarios

### User Story 1 - User Registration (Priority: P1)

**Scenario 1.1: Successful Registration**
- **Given** user provides valid email "test@example.com", password "SecurePass123", name "Test User"
- **When** POST request sent to `/api/auth/signup`
- **Then** system creates user with bcrypt-hashed password, returns 201 with user object and JWT token valid for 7 days

**Scenario 1.2: Invalid Email Format**
- **Given** user provides email "invalid-email"
- **When** POST request sent to `/api/auth/signup`
- **Then** system returns 400 with error message "Invalid email format"

**Scenario 1.3: Weak Password**
- **Given** user provides password "weak"
- **When** POST request sent to `/api/auth/signup`
- **Then** system returns 400 with error message detailing password requirements

**Scenario 1.4: Duplicate Email**
- **Given** email "test@example.com" already exists in database
- **When** POST request sent to `/api/auth/signup` with same email
- **Then** system returns 409 with error message "Email already registered"

---

### User Story 2 - User Authentication (Priority: P1)

**Scenario 2.1: Successful Login**
- **Given** valid credentials for existing user
- **When** POST request sent to `/api/auth/login`
- **Then** system validates password, returns 200 with user object and JWT token

**Scenario 2.2: Invalid Credentials**
- **Given** incorrect password for existing user
- **When** POST request sent to `/api/auth/login`
- **Then** system returns 401 with error message "Invalid credentials"

**Scenario 2.3: Rate Limit Exceeded**
- **Given** 5 failed login attempts within 1 minute from same IP
- **When** 6th POST request sent to `/api/auth/login`
- **Then** system returns 429 with error message "Rate limit exceeded"

---

### User Story 3 - Todo Creation (Priority: P1)

**Scenario 3.1: Successful Todo Creation**
- **Given** authenticated user with valid JWT token
- **When** POST request to `/api/users/{user_id}/todos` with title "Buy groceries", description "Milk, bread, eggs", priority "high"
- **Then** system creates todo associated with user_id from JWT, returns 201 with complete todo object including auto-generated UUID and timestamps

**Scenario 3.2: Empty Title**
- **Given** authenticated user
- **When** POST request with title containing only whitespace
- **Then** system returns 400 with error message "Title cannot be empty or only whitespace"

**Scenario 3.3: Title Too Long**
- **Given** authenticated user
- **When** POST request with title exceeding 200 characters
- **Then** system returns 400 with validation error

**Scenario 3.4: Unauthorized Access**
- **Given** user_id in URL path doesn't match user_id in JWT claim
- **When** POST request to `/api/users/{different_user_id}/todos`
- **Then** system returns 403 with error message "Forbidden"

---

### User Story 4 - Todo Retrieval (Priority: P1)

**Scenario 4.1: Retrieve All User Todos**
- **Given** authenticated user with 3 todos in database
- **When** GET request to `/api/users/{user_id}/todos`
- **Then** system returns 200 with array of 3 todos sorted by created_at descending, total count 3

**Scenario 4.2: Filter Completed Todos**
- **Given** user has 2 completed and 3 pending todos
- **When** GET request to `/api/users/{user_id}/todos?status=completed`
- **Then** system returns only 2 completed todos

**Scenario 4.3: Data Isolation Verification**
- **Given** two different users each with todos
- **When** User A requests GET `/api/users/{user_a_id}/todos`
- **Then** system returns only User A's todos, never User B's todos

---

### User Story 5 - Todo Update (Priority: P2)

**Scenario 5.1: Full Update via PUT**
- **Given** authenticated user owns todo with id "todo-123"
- **When** PUT request to `/api/users/{user_id}/todos/todo-123` with new title, description, priority
- **Then** system updates all fields, returns 200 with updated todo and new updated_at timestamp

**Scenario 5.2: Partial Update via PATCH**
- **Given** authenticated user owns todo with id "todo-123"
- **When** PATCH request to `/api/users/{user_id}/todos/todo-123` with only {"priority": "low"}
- **Then** system updates only priority field, keeps other fields unchanged

**Scenario 5.3: Update Other User's Todo**
- **Given** todo belongs to User B
- **When** User A sends PUT request to `/api/users/{user_a_id}/todos/{user_b_todo_id}`
- **Then** system returns 403 Forbidden

---

### User Story 6 - Todo Completion Toggle (Priority: P2)

**Scenario 6.1: Mark Todo Complete**
- **Given** incomplete todo with id "todo-123"
- **When** PATCH request to `/api/users/{user_id}/todos/todo-123/complete` with {"completed": true}
- **Then** system sets completed=true, sets completed_at to current timestamp, returns updated todo

**Scenario 6.2: Mark Todo Incomplete**
- **Given** completed todo with id "todo-123"
- **When** PATCH request to `/api/users/{user_id}/todos/todo-123/complete` with {"completed": false}
- **Then** system sets completed=false, clears completed_at to null

---

### User Story 7 - Todo Deletion (Priority: P2)

**Scenario 7.1: Successful Deletion**
- **Given** authenticated user owns todo with id "todo-123"
- **When** DELETE request to `/api/users/{user_id}/todos/todo-123`
- **Then** system removes todo from database, returns 200 with success message

**Scenario 7.2: Delete Non-Existent Todo**
- **Given** todo id "non-existent" doesn't exist
- **When** DELETE request to `/api/users/{user_id}/todos/non-existent`
- **Then** system returns 404 Not Found

---

## Edge Cases

### Authentication Edge Cases
- **EC-001**: What happens when JWT token expires mid-session?
  - **Expected**: System returns 401 Unauthorized, client must re-authenticate
  
- **EC-002**: What happens when user attempts login with email in different case (Test@Example.com vs test@example.com)?
  - **Expected**: System treats emails case-insensitively for login

### Todo Management Edge Cases
- **EC-003**: What happens when user tries to create todo with title that is exactly 200 characters?
  - **Expected**: System accepts it (boundary condition)

- **EC-004**: What happens when description is exactly 1000 characters?
  - **Expected**: System accepts it (boundary condition)

- **EC-005**: What happens when user sends invalid priority value like "urgent"?
  - **Expected**: System returns 400 with validation error listing valid priorities

- **EC-006**: What happens when database connection is lost during todo creation?
  - **Expected**: System returns 503 Service Unavailable with retry-after header

- **EC-007**: What happens when user deletes a todo that's already been deleted (race condition)?
  - **Expected**: System returns 404 Not Found

### Data Integrity Edge Cases
- **EC-008**: What happens when user is deleted while they have active todos?
  - **Expected**: CASCADE DELETE removes all user's todos automatically

- **EC-009**: What happens when system receives request with malformed JSON?
  - **Expected**: FastAPI returns 422 Unprocessable Entity with parsing error details

---

## Success Criteria

### Authentication Success Criteria
- **SC-001**: 100% of valid registration requests create user accounts with bcrypt-hashed passwords
- **SC-002**: 100% of invalid registrations (bad email, weak password, duplicate email) are rejected with appropriate error codes
- **SC-003**: JWT tokens are generated with 7-day expiration and contain user_id claim
- **SC-004**: Rate limiting prevents more than 5 failed login attempts per minute per IP

### Todo Management Success Criteria
- **SC-005**: 100% of todo operations verify JWT user_id matches URL user_id parameter
- **SC-006**: 100% of unauthorized access attempts to other users' data return 403 Forbidden
- **SC-007**: Todo lists contain only todos belonging to authenticated user (verified via test suite)
- **SC-008**: All CRUD operations complete within 500ms average response time in local development

### Data Quality Success Criteria
- **SC-009**: All database constraints (foreign keys, check constraints) are enforced
- **SC-010**: Validation errors return 400 with clear, actionable error messages
- **SC-011**: All timestamps use UTC timezone (TIMESTAMP WITH TIME ZONE)

### Code Quality Success Criteria
- **SC-012**: Test coverage reaches minimum 80% across all modules
- **SC-013**: All endpoints documented in auto-generated OpenAPI spec
- **SC-014**: Code passes black formatting and ruff linting with zero errors

---

## Implementation Checklist

### Phase 1: Project Setup
- [ ] Initialize FastAPI project structure
- [ ] Set up Neon PostgreSQL database connection
- [ ] Configure Better Auth integration
- [ ] Set up SQLAlchemy with async support
- [ ] Configure Alembic for migrations
- [ ] Set up logging configuration
- [ ] Create .env file for configuration

### Phase 2: Database Schema
- [ ] Create users table migration
- [ ] Create todos table migration
- [ ] Create sessions table migration
- [ ] Add indexes for performance
- [ ] Run migrations on Neon database

### Phase 3: Authentication
- [ ] Implement signup endpoint
- [ ] Implement login endpoint
- [ ] Implement logout endpoint
- [ ] Create Better Auth middleware
- [ ] Implement rate limiting
- [ ] Add password hashing with bcrypt

### Phase 4: Todo CRUD
- [ ] Implement create todo endpoint
- [ ] Implement get todos endpoint with filtering
- [ ] Implement get single todo endpoint
- [ ] Implement update todo endpoint (PUT)
- [ ] Implement partial update endpoint (PATCH)
- [ ] Implement toggle complete endpoint
- [ ] Implement delete todo endpoint

### Phase 5: Testing
- [ ] Write unit tests for authentication
- [ ] Write unit tests for todo operations
- [ ] Write integration tests for API endpoints
- [ ] Write tests for data isolation
- [ ] Write tests for edge cases
- [ ] Achieve 80% code coverage

### Phase 6: Documentation & Polish
- [ ] Verify OpenAPI documentation
- [ ] Add docstrings to all functions
- [ ] Create API usage examples
- [ ] Set up health check endpoint
- [ ] Configure CORS properly
- [ ] Run final linting and formatting

---

## Notes

- This specification covers **backend API only** - no frontend development
- Authentication uses Better Auth library - consult their documentation for Python integration
- Neon PostgreSQL is serverless - ensure proper connection pooling configuration
- All endpoints return JSON responses
- Use FastAPI dependency injection for database sessions and authentication
- Consider using FastAPI background tasks for any async operations like email notifications (future enhancement)