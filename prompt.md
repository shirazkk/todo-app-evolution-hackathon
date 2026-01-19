# Prompt for Creating Plan (sp.plan) 📋

```
Now create a detailed technical plan for implementing the "Web-Based Todo Management" feature.


Based on the specification, generate a comprehensive implementation plan that breaks down HOW to build this feature.

## Plan Requirements:

### 1. Architecture Overview
- System components: Frontend, Backend, Database, Auth
- Communication flow: User → Next.js → FastAPI → Neon DB
- Authentication flow: Login → JWT → Protected routes
- Data flow: Request → Validation → Database → Response

### 2. Technology Decisions

**Frontend:**
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- Forms: React Hook Form + Zod validation
- State: React hooks (useState, useEffect)
- API Client: Custom fetch wrapper with JWT

**Backend:**
- Framework: FastAPI
- ORM: SQLModel
- Auth: Better Auth with JWT
- Validation: Pydantic models
- Database Driver: asyncpg (async PostgreSQL)

**Database:**
- Provider: Neon Serverless PostgreSQL
- Tables: users, tasks
- Indexes: user_id, email, completed

### 3. Component Breakdown

**Database Layer:**
1. User model (SQLModel)
2. Task model (SQLModel)
3. Database engine setup
4. Connection pooling
5. Migration strategy

**Backend Layer:**
1. FastAPI application setup
2. CORS middleware
3. JWT authentication middleware
4. Auth routes (signup, login, logout, me)
5. Task routes (CRUD + complete)
6. Pydantic schemas (request/response)
7. Error handlers (404, 403, 500)
8. Health check endpoint

**Frontend Layer:**
1. App layout with auth check
2. Login page (server component)
3. Signup page (server component)
4. Tasks page (server component for list, client for interactions)
5. TodoList component (client)
6. TodoItem component (client)
7. TodoForm component (client)
8. API client utility (JWT handling)

### 4. Implementation Sequence

**Phase 1: Foundation (Day 1)**
1. Create monorepo structure (frontend/, backend/)
2. Initialize Next.js project with TypeScript
3. Initialize FastAPI project with UV
4. Configure environment variables (.env.example)

**Phase 2: Database (Day 2)**
1. Set up Neon database account
2. Create database connection in backend/db.py
3. Define User model (SQLModel)
4. Define Task model (SQLModel)
5. Test database connection
6. Create tables in Neon

**Phase 3: Backend Auth (Day 3)**
1. Install Better Auth dependencies
2. Set up JWT secret key
3. Create auth routes (signup, login)
4. Implement password hashing (bcrypt)
5. Create JWT token generation
6. Create JWT verification middleware
7. Test auth flow with Postman/curl

**Phase 4: Backend Tasks API (Day 4)**
1. Create task routes file
2. Implement POST /api/{user_id}/tasks
3. Implement GET /api/{user_id}/tasks (with filtering)
4. Implement PUT /api/{user_id}/tasks/{id}
5. Implement DELETE /api/{user_id}/tasks/{id}
6. Implement PATCH /api/{user_id}/tasks/{id}/complete
7. Add JWT middleware to all task routes
8. Add user_id validation (JWT user matches URL user)
9. Test all endpoints with Postman

**Phase 5: Frontend Auth (Day 5)**
1. Install Better Auth client
2. Create auth context/provider
3. Create LoginForm component
4. Create SignupForm component
5. Create login page
6. Create signup page
7. Implement auth API client calls
8. Test login/signup flow

**Phase 6: Frontend Tasks UI (Day 6)**
1. Create tasks page (protected route)
2. Create TodoList component
3. Create TodoItem component
4. Create TodoForm component (add/edit)
5. Implement API client for tasks
6. Add loading states
7. Add error handling
8. Add success messages

**Phase 7: Integration & Polish (Day 7)**
1. Connect frontend to backend API
2. Test complete user flows
3. Add form validation (Zod schemas)
4. Improve error messages
5. Add responsive design
6. Test on mobile/tablet

### 5. File Structure

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

### 6. Data Models

**User (SQLModel):**
```python
class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)
    
    tasks: list["Task"] = Relationship(back_populates="user")
```

**Task (SQLModel):**
```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None)
    priority: str = Field(default="Medium")  # High, Medium, Low
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    user: User = Relationship(back_populates="tasks")
```

### 7. API Contracts

**Authentication:**
- All auth endpoints return 200 on success, 400/401 on failure
- JWT token valid for 7 days
- Token stored in httpOnly cookie

**Task Endpoints:**
- All require valid JWT in Authorization header
- Return 401 if token missing/invalid
- Return 403 if user_id doesn't match JWT
- Return 404 if task not found
- Return 200 with data on success

### 8. Security Measures

1. **Password Security:**
   - Hash with bcrypt (12 rounds)
   - Never store plain text
   - Min 8 characters enforced

2. **JWT Security:**
   - Sign with HS256 algorithm
   - Include user_id in payload
   - Set expiration (7 days)
   - Verify signature on every request

3. **API Security:**
   - CORS whitelist (only frontend domain)
   - Rate limiting on auth endpoints
   - Input validation (Pydantic)
   - SQL injection prevention (SQLModel parameterized queries)

4. **Frontend Security:**
   - No secrets in client code
   - XSS prevention (React auto-escaping)
   - CSRF protection (Better Auth handles)

### 9. Testing Strategy

**Backend Tests:**
- Auth flow: signup, login, invalid credentials
- CRUD operations: create, read, update, delete, complete
- Authorization: user can't access other user's tasks
- Validation: invalid inputs rejected

**Frontend Tests:**
- Form validation working
- API calls successful
- Error states displayed
- Loading states shown

**Integration Tests:**
- Complete user journey: signup → login → add task → complete → delete → logout


### 10. Dependencies to Install

**Frontend:**
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-auth": "latest",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

**Backend:**
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

### 12. Environment Setup Commands

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

### 13. Success Criteria

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

Generate this complete plan now.
```