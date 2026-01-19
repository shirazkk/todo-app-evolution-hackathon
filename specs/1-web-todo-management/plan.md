# Implementation Plan: Web-Based Todo Management with Authentication

## Architecture Overview

### System Components
- **Frontend**: Next.js 16 application with TypeScript and Tailwind CSS
- **Backend**: FastAPI server with SQLModel and PostgreSQL
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens

### Communication Flow
- User → Next.js App → API Requests → FastAPI → Neon DB
- Server Components for data fetching
- Client Components for interactivity

### Authentication Flow
- User visits app → Redirect to login if not authenticated
- Login form → Credentials → JWT generation → Store in httpOnly cookie
- Protected routes → JWT verification → Access granted/denied
- Logout → Token invalidation → Redirect to login

### Data Flow
- Request → Validation (Pydantic/Zod) → Business Logic → Database → Response

## Technology Decisions

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State**: React hooks (useState, useEffect)
- **API Client**: Custom fetch wrapper with JWT

### Backend
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Auth**: Better Auth with JWT
- **Validation**: Pydantic models
- **Database Driver**: asyncpg (async PostgreSQL)

### Database
- **Provider**: Neon Serverless PostgreSQL
- **Tables**: users, tasks
- **Indexes**: user_id, email, completed

## Component Breakdown

### Database Layer - Use `database-designer-agent` and `postgresql-sqlmodel` skill
1. User model (SQLModel)
2. Task model (SQLModel) 
3. Database engine setup 
4. Connection pooling 
5. Migration strategy 

### Backend Layer - Use `fastapi-dev-agent` and `fastapi` skill
1. FastAPI application setup 
2. CORS middleware 
3. JWT authentication middleware 
4. Auth routes (signup, login, logout, me) 
5. Task routes (CRUD + complete) 
6. Pydantic schemas (request/response) 
7. Error handlers (404, 403, 500) 
8. Health check endpoint 

### Frontend Layer - Use `nextjs-dev-agent` and `frontend-design` skill
1. App layout with auth check
2. Login page (server component) 
3. Signup page (server component) 
4. Tasks page (server component for list, client for interactions) 
5. TodoList component (client) 
6. TodoItem component (client) 
7. TodoForm component (client) 
8. API client utility (JWT handling) 

## Implementation Sequence

### Phase 1: Foundation (Day 1)
1. Create monorepo structure (frontend/, backend/)
2. Initialize Next.js project with TypeScript
3. Initialize FastAPI project with UV
4. Configure environment variables (.env.example)

### Phase 2: Database (Day 2) - - Use `nextjs-dev-agent` and `frontend-design` skill
1. Set up Neon database account
2. Create database connection in backend/db.py 
3. Define User model (SQLModel) 
4. Define Task model (SQLModel) 
5. Test database connection
6. Create tables in Neon

### Phase 3: Backend Auth (Day 3)
1. Install Better Auth dependencies
2. Set up JWT secret key
3. Create auth routes (signup, login) - Use `fastapi-dev-agent` and `api-contract-designer-agent`
4. Implement password hashing (bcrypt) - Use `fastapi-dev-agent` for security implementation
5. Create JWT token generation - Use `fastapi-dev-agent` and `api-contract-designer-agent`
6. Create JWT verification middleware - Use `fastapi-dev-agent` for middleware implementation
7. Test auth flow with Postman/curl

### Phase 4: Backend Tasks API (Day 4)
1. Create task routes file - Use `fastapi-dev-agent` and `fastapi`skill
2. Implement POST /api/{user_id}/tasks - Use `fastapi-dev-agent` and `fasapi` skill
3. Implement GET /api/{user_id}/tasks (with filtering) - Use `fastapi-dev-agent` and `fastapi`skill
4. Implement PUT /api/{user_id}/tasks/{id} - Use `fastapi-dev-agent` and `fastapi`skill
5. Implement DELETE /api/{user_id}/tasks/{id} - Use `fastapi-dev-agent` and `fastapi`skill
6. Implement PATCH /api/{user_id}/tasks/{id}/complete - Use `fastapi-dev-agent` and `fastapi`skill
7. Add JWT middleware to all task routes - Use `fastapi-dev-agent` for middleware implementation
8. Add user_id validation (JWT user matches URL user) - Use `fastapi-dev-agent` for security validation
9. Test all endpoints with Postman

### Phase 5: Frontend Auth (Day 5)
1. Install Better Auth client
2. Create auth context/provider - Use `nextjs-dev-agent` and `frontend-design` skill
3. Create LoginForm component - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
4. Create SignupForm component - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
5. Create login page - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
6. Create signup page - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
7. Implement auth API client calls - Use `nextjs-dev-agent` for API integration
8. Test login/signup flow

### Phase 6: Frontend Tasks UI (Day 6)
1. Create tasks page (protected route) - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
2. Create TodoList component - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
3. Create TodoItem component - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
4. Create TodoForm component (add/edit) - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
5. Implement API client for tasks - Use `nextjs-dev-agent` for API integration
6. Add loading states - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
7. Add error handling - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
8. Add success messages - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill

### Phase 7: Integration & Polish (Day 7)
1. Connect frontend to backend API - Use `nextjs-dev-agent` and `fastapi-dev-agent` for integration
2. Test complete user flows - Use `nextjs-dev-agent`, `fastapi-dev-agent`, and `api-contract-designer-agent` for testing
3. Add form validation (Zod schemas) - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
4. Improve error messages - Use `nextjs-dev-agent`, `fastapi-dev-agent`, `frontend-design` skill, and `next-react` skill
5. Add responsive design - Use `frontend-design` skill and `nextjs-dev-agent` for responsive patterns
6. Test on mobile/tablet - Use `frontend-design` skill for device-specific testing

## File Structure

```
hackathon-todo/

├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx (redirect to /tasks or /login)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── lib/
│   │   ├── api.ts (API client)
│   │   └── auth.ts (auth utilities)
│   ├── types/
│   │   └── index.ts (TypeScript types)
│   ├── .env.local
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── main.py
│   ├── models.py (User, Task)
│   ├── db.py (database connection)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── tasks.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── jwt_auth.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py (LoginRequest, SignupRequest, TokenResponse)
│   │   └── tasks.py (TaskCreate, TaskUpdate, TaskResponse)
│   ├── utils/
│   │   ├── __init__.py
│   │   └── security.py (password hashing, JWT)
│   ├── .env
│   ├── .env.example
│   └── pyproject.toml
└── README.md
```

## Data Models

### User (SQLModel):
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str = Field(max_length=100)
    password_hash: str
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    tasks: List["Task"] = Relationship(back_populates="user")
```

### Task (SQLModel):
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default="Medium")  # High, Medium, Low
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    user: "User" = Relationship(back_populates="tasks")
```

## API Contracts

### Authentication
- All auth endpoints return 200 on success, 400/401 on failure
- JWT token valid for 7 days
- Token stored in httpOnly cookie

### Task Endpoints
- All require valid JWT in Authorization header
- Return 401 if token missing/invalid
- Return 403 if user_id doesn't match JWT
- Return 404 if task not found
- Return 200 with data on success

## Security Measures

### Password Security
- Hash with bcrypt (12 rounds)
- Never store plain text
- Min 8 characters with 1 uppercase, 1 lowercase, 1 number enforced

### JWT Security
- Sign with HS256 algorithm
- Include user_id in payload
- Set expiration (7 days)
- Verify signature on every request

### API Security
- CORS whitelist (only frontend domain)
- Rate limiting on auth endpoints (5 attempts per minute)
- Input validation (Pydantic)
- SQL injection prevention (SQLModel parameterized queries)

### Frontend Security
- No secrets in client code
- XSS prevention (React auto-escaping)
- CSRF protection (Better Auth handles)

## Testing Strategy

### Backend Tests
- Auth flow: signup, login, invalid credentials
- CRUD operations: create, read, update, delete, complete
- Authorization: user can't access other user's tasks
- Validation: invalid inputs rejected

### Frontend Tests
- Form validation working
- API calls successful
- Error states displayed
- Loading states shown

### Integration Tests
- Complete user journey: signup → login → add task → complete → delete → logout

## Dependencies to Install

### Frontend:
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-auth": "latest",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Backend:
```toml
[project]
dependencies = [
    "fastapi>=0.110.0",
    "sqlmodel>=0.0.16",
    "better-auth>=1.0.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "python-multipart>=0.0.9",
    "asyncpg>=0.29.0",
    "uvicorn[standard]>=0.27.0"
]
```

## Environment Setup Commands

```bash
# Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with actual values
npm run dev

# Backend
cd backend
uv sync
cp .env.example .env
# Edit .env with actual values
uv run uvicorn main:app --reload
```

## Success Criteria

- [ ] User can signup with email/password
- [ ] User can login and receive JWT
- [ ] JWT stored securely in cookie
- [ ] User redirected to tasks page after login
- [ ] User can add task with title, description, priority
- [ ] User can view only their tasks
- [ ] User can update task details
- [ ] User can mark task complete/incomplete
- [ ] User can delete task
- [ ] User can filter by status (all/pending/completed)
- [ ] User can logout
- [ ] UI responsive on mobile/desktop
- [ ] Form validation working
- [ ] Error messages clear and helpful
- [ ] Loading states during API calls

## Technical Context

- **Feature**: Web-Based Todo Management with Authentication for Phase II (Full-Stack Web Application)
- **Location**: frontend/ and backend/ directories
- **Technology Stack**: Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth
- **Architecture**: Full-stack monorepo with separation of frontend and backend
- **Data Model**: User and Todo entities with proper relationships
- **Authentication**: JWT-based with Better Auth integration
- **Validation**: Backend with Pydantic, frontend with Zod

### Unknowns:
- Specific UI/UX requirements for the web interface
- Error handling approach for frontend/backend communication
- Specific design system or component library to use

### Agent & Skill Integration:
- **Frontend Development**: Use `nextjs-dev-agent` and `frontend-design` skill for Next.js component generation and App Router implementation
- **Backend Development**: Use `fastapi-dev-agent` and `fastapi`skill for API endpoint creation and authentication implementation
- **Database Design**: Use `database-designer-agent` for SQLModel entity creation and Neon DB schema design
- **API Contract Design**: Use `api-contract-designer-agent` and `fastapi` skill for endpoint specification and validation
- **Frontend Design**: Leverage `frontend-design` skill for modern UI/UX patterns and responsive design
- **Next.js & React**: Apply `next-react` skill for advanced component patterns and performance optimization
- **Database Integration**: Use `postgresql-sqlmodel` skill for advanced PostgreSQL features and optimization

## Constitution Check

Based on the project constitution principles:

- ✅ Spec-Driven Development: Following the spec created in specs/1-web-todo-management/spec.md
- ✅ Clean Architecture: Separating models, services, controllers, and presentation
- ✅ Code Quality Standards: Using type hints, PEP 8 compliance, descriptive names
- ✅ Cloud-Native Ready: Using environment variables for configuration
- ✅ No print() in business logic: Business logic will return values, not print directly

## Gates

- [x] Research: Next.js 16 App Router patterns and best practices
- [x] Research: FastAPI authentication with Better Auth
- [x] Research: SQLModel integration with Neon PostgreSQL
- [x] Research: JWT token management and security best practices

## Phase 0: Outline & Research

### Research Findings

#### Decision: Frontend Architecture Pattern
- **Rationale**: Using Next.js 16 with App Router, server components by default, client components only when interactivity is needed
- **Alternatives considered**: Client-side rendering, static site generation, traditional page router
- **Chosen approach**: App Router with server components for data fetching, client components for interactivity

#### Decision: Authentication Method
- **Rationale**: Using Better Auth for comprehensive authentication solution with JWT tokens
- **Alternatives considered**: Custom JWT implementation, other auth libraries
- **Chosen approach**: Better Auth for security, features, and maintenance

#### Decision: Database Connection
- **Rationale**: Using SQLModel with Neon PostgreSQL for type safety and async operations
- **Alternatives considered**: SQLAlchemy ORM, Tortoise ORM, Prisma
- **Chosen approach**: SQLModel for integration with FastAPI and type safety

## Phase 1: Design & Contracts

### Data Model

- **User Entity**:
  - id: UUID (primary key, auto-generated)
  - email: str (unique, indexed, validated)
  - name: str (required, max 100 chars)
  - password_hash: str (securely hashed with bcrypt)
  - is_active: bool (default True)
  - is_verified: bool (default False)
  - created_at: datetime
  - updated_at: datetime

- **Todo Entity**:
  - id: UUID (primary key, auto-generated)
  - user_id: UUID (foreign key to User, indexed)
  - title: str (required, max 200 chars)
  - description: str (optional, max 1000 chars)
  - priority: str (enum: 'High', 'Medium', 'Low', default 'Medium')
  - completed: bool (default False, indexed)
  - created_at: datetime
  - updated_at: datetime

### API Contracts

#### Authentication Endpoints
- **POST /api/auth/signup**: Create user account
  - Input: {email: string, password: string, name: string}
  - Response: 201 Created with {access_token: string, token_type: "bearer"}
  - Validation: Email format, password strength, name length
  - Error: 400 Bad Request, 409 Conflict

- **POST /api/auth/login**: Authenticate user
  - Input: {email: string, password: string}
  - Response: 200 OK with {access_token: string, token_type: "bearer"}
  - Validation: Email/password match
  - Error: 401 Unauthorized

- **POST /api/auth/logout**: Logout user
  - Response: 200 OK
  - Clears token from client

#### Todo Management Endpoints
- **GET /api/{user_id}/todos**: List user's todos
  - Query params: status (all|pending|completed), sort (created_at|priority)
  - Response: 200 OK with {todos: Todo[], count: number}
  - Authorization: JWT token with matching user_id
  - Error: 403 Forbidden

- **POST /api/{user_id}/todos**: Create new todo
  - Input: {title: string, description?: string, priority: string}
  - Response: 201 Created with Todo object
  - Authorization: JWT token with matching user_id
  - Error: 400 Bad Request, 403 Forbidden

- **GET /api/{user_id}/todos/{id}**: Get specific todo
  - Response: 200 OK with Todo object
  - Authorization: JWT token with matching user_id
  - Error: 403 Forbidden, 404 Not Found

- **PUT /api/{user_id}/todos/{id}**: Update todo
  - Input: {title?: string, description?: string, priority?: string}
  - Response: 200 OK with updated Todo object
  - Authorization: JWT token with matching user_id
  - Error: 400 Bad Request, 403 Forbidden, 404 Not Found

- **DELETE /api/{user_id}/todos/{id}**: Delete todo
  - Response: 200 OK with {message: "Todo deleted successfully"}
  - Authorization: JWT token with matching user_id
  - Error: 403 Forbidden, 404 Not Found

- **PATCH /api/{user_id}/todos/{id}/complete**: Toggle completion
  - Input: {completed: boolean}
  - Response: 200 OK with updated Todo object
  - Authorization: JWT token with matching user_id
  - Error: 400 Bad Request, 403 Forbidden, 404 Not Found

### Quickstart Guide

1. Clone the repository
2. Set up environment variables (DATABASE_URL, JWT_SECRET_KEY, etc.)
3. Run database migrations
4. Start backend: `cd backend && uvicorn main:app --reload`
5. Start frontend: `cd frontend && npm run dev`
6. Access the application at http://localhost:3000

## Phase 2: Implementation Tasks

1. Set up project structure (monorepo with frontend/ and backend/) - Use general development approach
2. Configure database connection to Neon DB - Use `database-designer-agent` and `postgresql-sqlmodel` skill
3. Create User and Todo models with SQLModel - Use `database-designer-agent` and `postgresql-sqlmodel` skill
4. Implement authentication endpoints with Better Auth - Use `fastapi-dev-agent` and `api-contract-designer-agent`
5. Create todo management API endpoints - Use `fastapi-dev-agent` and `api-contract-designer-agent`
6. Develop frontend components with Next.js - Use `nextjs-dev-agent`, `frontend-design` skill, and `next-react` skill
7. Connect frontend to backend API - Use `nextjs-dev-agent` and `fastapi-dev-agent` for integration
8. Implement responsive design and UI - Use `frontend-design` skill and `nextjs-dev-agent`
9. Add form validation and error handling - Use `nextjs-dev-agent`, `fastapi-dev-agent`, `frontend-design` skill, and `next-react` skill
10. Test complete user flows - Use all agents and skills for comprehensive testing

## Security Considerations

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- httpOnly, secure, SameSite=strict cookies for tokens
- Rate limiting on authentication endpoints (5 attempts/minute)
- CORS configured for frontend domain only
- Input validation on all endpoints
- SQL injection prevention through parameterized queries

## Performance Targets

- API response time < 500ms (local development)
- Database queries optimized with proper indexing
- Connection pooling for database operations
- Efficient data fetching with server components
- Image optimization with Next.js Image component

## Testing Strategy

- Unit tests for business logic and validation
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Security tests for authentication and authorization
- Performance tests for API response times