# Implementation Plan: Web-Based Todo Management API (Backend Only)

**Feature Branch**: `1-web-todo-management-backend`
**Created**: 2026-01-20
**Status**: Draft
**Scope**: Backend API Implementation Only

---

## Architecture Overview

### System Components
- **Backend API**: FastAPI server with async support
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **ORM**: SQLAlchemy 2.0+ (async)
- **Validation**: Pydantic v2
- **Migration**: Alembic

### Communication Flow
```
API Client (Postman/Thunder Client/curl)
    ↓
FastAPI Router
    ↓
Better Auth Middleware (JWT verification)
    ↓
Pydantic Validation
    ↓
Business Logic Layer
    ↓
SQLAlchemy ORM (Async)
    ↓
Neon PostgreSQL Database
```

### Authentication Flow
```
1. Client → POST /api/auth/signup → Create user → Return JWT token
2. Client → POST /api/auth/login → Validate credentials → Return JWT token
3. Client → Protected endpoint with Authorization: Bearer <token>
4. Middleware → Verify JWT → Extract user_id → Allow/Deny access
5. Client → POST /api/auth/logout → Invalidate token → Success
```

### Data Flow
```
Request → FastAPI Route → Pydantic Validation → Service Layer → 
Repository Layer → SQLAlchemy → Database → Response
```

---

## Technology Stack

### Core Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI 0.110+
- **ASGI Server**: Uvicorn with standard extras
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLAlchemy 2.0+ (async support)
- **Migration**: Alembic

### Authentication & Security
- **Auth Library**: Better Auth (Python integration)
- **JWT**: python-jose[cryptography]
- **Password Hashing**: passlib[bcrypt] with bcrypt
- **Rate Limiting**: slowapi

### Validation & Data
- **Request/Response Validation**: Pydantic v2
- **Environment Variables**: python-dotenv
- **Database Driver**: asyncpg (async PostgreSQL driver)

### Development Tools
- **Package Manager**: uv (fast Python package installer)
- **Code Formatting**: black
- **Linting**: ruff
- **Type Checking**: mypy
- **Testing**: pytest, pytest-asyncio, httpx

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI application entry point
│   ├── config.py                    # Configuration and environment variables
│   ├── database.py                  # Database connection and session management
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                  # User SQLAlchemy model
│   │   └── todo.py                  # Todo SQLAlchemy model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                  # Auth request/response schemas
│   │   └── todo.py                  # Todo request/response schemas
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                  # Dependency injection (DB session, current user)
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py              # Authentication endpoints
│   │       └── todos.py             # Todo CRUD endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py              # Password hashing, JWT creation/verification
│   │   └── middleware.py            # Custom middleware (logging, rate limiting)
│   │
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py          # Business logic for authentication
│       └── todo_service.py          # Business logic for todos
│
├── alembic/
│   ├── versions/                     # Migration files
│   ├── env.py                        # Alembic environment
│   └── alembic.ini                   # Alembic configuration
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                   # Pytest fixtures
│   ├── test_auth.py                  # Authentication tests
│   ├── test_todos.py                 # Todo CRUD tests
│   └── test_integration.py           # Integration tests
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Example environment variables
├── pyproject.toml                    # Project dependencies (uv/pip)
├── requirements.txt                  # Frozen dependencies
├── .gitignore
└── README.md
```

---

## Implementation Sequence

### Phase 1: Project Foundation

**Objective**: Set up project structure, dependencies, and basic FastAPI application

**Tasks**:
1. ✅ Initialize project directory structure
   ```bash
   mkdir -p backend/app/{models,schemas,api/routes,core,services}
   mkdir -p backend/tests
   mkdir -p backend/alembic/versions
   ```

2. ✅ Create `pyproject.toml` with dependencies
   ```toml
   [project]
   name = "todo-api"
   version = "0.1.0"
   requires-python = ">=3.11"
   dependencies = [
       "fastapi>=0.110.0",
       "uvicorn[standard]>=0.27.0",
       "sqlalchemy>=2.0.0",
       "asyncpg>=0.29.0",
       "alembic>=1.13.0",
       "pydantic>=2.0.0",
       "pydantic-settings>=2.0.0",
       "python-jose[cryptography]>=3.3.0",
       "passlib[bcrypt]>=1.7.4",
       "python-multipart>=0.0.9",
       "python-dotenv>=1.0.0",
       "slowapi>=0.1.9",
   ]
   
   [project.optional-dependencies]
   dev = [
       "pytest>=7.4.0",
       "pytest-asyncio>=0.21.0",
       "httpx>=0.25.0",
       "black>=23.0.0",
       "ruff>=0.1.0",
       "mypy>=1.7.0",
   ]
   ```

3. ✅ Create `.env.example` with configuration template
   ```env
   # Database
   DATABASE_URL=postgresql+asyncpg://user:password@host/database
   
   # Security
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_DAYS=7
   
   # API
   API_V1_PREFIX=/api
   PROJECT_NAME=Todo API
   
   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
   
   # Rate Limiting
   RATE_LIMIT_PER_MINUTE=5
   ```

4. ✅ Create `app/config.py` for settings management
   ```python
   from pydantic_settings import BaseSettings
   
   class Settings(BaseSettings):
       DATABASE_URL: str
       SECRET_KEY: str
       ALGORITHM: str = "HS256"
       ACCESS_TOKEN_EXPIRE_DAYS: int = 7
       # ... other settings
       
       class Config:
           env_file = ".env"
   
   settings = Settings()
   ```

5. ✅ Create basic `app/main.py` FastAPI application
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   
   app = FastAPI(title="Todo API")
   
   # Add CORS middleware
   # Add health check endpoint
   ```

6. ✅ Install dependencies with uv
   ```bash
   cd backend
   uv sync
   ```

7. ✅ Test basic FastAPI setup
   ```bash
   uv run uvicorn app.main:app --reload
   # Visit http://localhost:8000/docs
   ```

**Deliverables**:
- Project structure created
- Dependencies installed
- Basic FastAPI app running
- Configuration management working

---

### Phase 2: Database Setup

**Objective**: Configure Neon PostgreSQL connection and create database models

**Tasks**:
1. ✅ Set up Neon PostgreSQL database
   - Create database on Neon.tech
   - Copy connection string
   - Add to `.env` file

2. ✅ Create `app/database.py` for async database session
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
   from sqlalchemy.orm import sessionmaker, declarative_base
   
   Base = declarative_base()
   
   engine = create_async_engine(DATABASE_URL, echo=True)
   async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
   
   async def get_db():
       async with async_session() as session:
           yield session
   ```

3. ✅ Create `app/models/user.py` - User model
   ```python
   from sqlalchemy import Column, String, Boolean, DateTime
   from sqlalchemy.dialects.postgresql import UUID
   from app.database import Base
   import uuid
   from datetime import datetime
   
   class User(Base):
       __tablename__ = "users"
       
       id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
       email = Column(String(255), unique=True, nullable=False, index=True)
       password_hash = Column(String(255), nullable=False)
       name = Column(String(100), nullable=False)
       created_at = Column(DateTime, default=datetime.utcnow)
       updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
   ```

4. ✅ Create `app/models/todo.py` - Todo model
   ```python
   from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
   from sqlalchemy.dialects.postgresql import UUID
   from sqlalchemy.orm import relationship
   from app.database import Base
   
   class Todo(Base):
       __tablename__ = "todos"
       
       id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
       user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
       title = Column(String(200), nullable=False)
       description = Column(Text, nullable=True)
       priority = Column(String(10), default="medium", nullable=False)
       completed = Column(Boolean, default=False, index=True)
       created_at = Column(DateTime, default=datetime.utcnow, index=True)
       updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
       completed_at = Column(DateTime, nullable=True)
       
       user = relationship("User", backref="todos")
   ```

5. ✅ Initialize Alembic for migrations
   ```bash
   alembic init alembic
   ```

6. ✅ Configure `alembic/env.py` for async support
   - Import models
   - Configure async engine
   - Set target metadata

7. ✅ Create initial migration
   ```bash
   alembic revision --autogenerate -m "Create users and todos tables"
   ```

8. ✅ Run migration on Neon database
   ```bash
   alembic upgrade head
   ```

9. ✅ Verify tables created in Neon dashboard

**Deliverables**:
- Database connection working
- User and Todo models created
- Alembic migrations configured
- Tables created in Neon database

---

### Phase 3: Authentication Implementation 

**Objective**: Implement user registration, login, and JWT token management

**Tasks**:
1. ✅ Create `app/core/security.py` for security utilities
   ```python
   from passlib.context import CryptContext
   from jose import jwt
   from datetime import datetime, timedelta
   
   pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
   
   def verify_password(plain_password: str, hashed_password: str) -> bool:
       return pwd_context.verify(plain_password, hashed_password)
   
   def get_password_hash(password: str) -> str:
       return pwd_context.hash(password)
   
   def create_access_token(data: dict, expires_delta: timedelta) -> str:
       # JWT creation logic
       pass
   
   def verify_token(token: str) -> dict:
       # JWT verification logic
       pass
   ```

2. ✅ Create `app/schemas/auth.py` for authentication schemas
   ```python
   from pydantic import BaseModel, EmailStr, Field, field_validator
   
   class SignupRequest(BaseModel):
       email: EmailStr
       password: str = Field(min_length=8, max_length=128)
       name: str = Field(min_length=2, max_length=100)
       
       @field_validator('password')
       @classmethod
       def validate_password(cls, v: str) -> str:
           # Password strength validation
           pass
   
   class LoginRequest(BaseModel):
       email: EmailStr
       password: str
   
   class TokenResponse(BaseModel):
       access_token: str
       token_type: str = "bearer"
       expires_at: datetime
   
   class UserResponse(BaseModel):
       id: str
       email: str
       name: str
       created_at: datetime
   ```

3. ✅ Create `app/services/auth_service.py` for business logic
   ```python
   from sqlalchemy.ext.asyncio import AsyncSession
   from app.models.user import User
   from app.core.security import get_password_hash, verify_password
   
   async def create_user(db: AsyncSession, email: str, password: str, name: str) -> User:
       # Create user with hashed password
       pass
   
   async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
       # Verify credentials
       pass
   
   async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
       # Query user by email
       pass
   ```

4. ✅ Create `app/api/deps.py` for dependency injection
   ```python
   from fastapi import Depends, HTTPException, status
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
   from sqlalchemy.ext.asyncio import AsyncSession
   from app.database import get_db
   from app.core.security import verify_token
   
   security = HTTPBearer()
   
   async def get_current_user(
       credentials: HTTPAuthorizationCredentials = Depends(security),
       db: AsyncSession = Depends(get_db)
   ) -> User:
       # Verify JWT and return current user
       pass
   ```

5. ✅ Create `app/api/routes/auth.py` - Authentication endpoints
   ```python
   from fastapi import APIRouter, Depends, HTTPException, status
   from sqlalchemy.ext.asyncio import AsyncSession
   
   router = APIRouter(prefix="/auth", tags=["authentication"])
   
   @router.post("/signup", response_model=AuthResponse, status_code=201)
   async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
       # Check if email exists
       # Create user
       # Generate JWT token
       # Return user + token
       pass
   
   @router.post("/login", response_model=AuthResponse)
   async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
       # Authenticate user
       # Generate JWT token
       # Return user + token
       pass
   
   @router.post("/logout", status_code=200)
   async def logout(current_user: User = Depends(get_current_user)):
       # In stateless JWT, just return success
       # Client should delete token
       return {"message": "Successfully logged out"}
   
   @router.get("/me", response_model=UserResponse)
   async def get_current_user_info(current_user: User = Depends(get_current_user)):
       return current_user
   ```

6. ✅ Add rate limiting middleware in `app/core/middleware.py`
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   
   # Apply to auth endpoints: @limiter.limit("5/minute")
   ```

7. ✅ Register auth routes in `app/main.py`
   ```python
   from app.api.routes import auth
   
   app.include_router(auth.router, prefix="/api")
   ```

8. ✅ Test authentication with Postman/curl
   - Test signup with valid data
   - Test signup with duplicate email (409)
   - Test signup with weak password (400)
   - Test login with valid credentials
   - Test login with invalid credentials (401)
   - Test rate limiting (429)
   - Test /me endpoint with valid token
   - Test /me endpoint with invalid token (401)

**Deliverables**:
- User registration working
- Login returning JWT tokens
- Token verification working
- Rate limiting implemented
- All auth endpoints tested

---

### Phase 4: Todo CRUD Implementation 

**Objective**: Implement complete todo management API with proper authorization

**Tasks**:
1. ✅ Create `app/schemas/todo.py` for todo schemas
   ```python
   from pydantic import BaseModel, Field, field_validator
   from typing import Optional, Literal
   from datetime import datetime
   
   class CreateTodoRequest(BaseModel):
       title: str = Field(min_length=1, max_length=200)
       description: Optional[str] = Field(None, max_length=1000)
       priority: Literal['high', 'medium', 'low'] = 'medium'
   
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
   
   class TodoResponse(BaseModel):
       id: str
       user_id: str
       title: str
       description: Optional[str]
       priority: str
       completed: bool
       created_at: datetime
       updated_at: datetime
       completed_at: Optional[datetime]
       
       class Config:
           from_attributes = True
   
   class TodoListResponse(BaseModel):
       todos: list[TodoResponse]
       total: int
       filters_applied: dict
   ```

2. ✅ Create `app/services/todo_service.py` for business logic
   ```python
   from sqlalchemy.ext.asyncio import AsyncSession
   from sqlalchemy import select, and_
   from app.models.todo import Todo
   from typing import Optional
   
   async def create_todo(
       db: AsyncSession,
       user_id: str,
       title: str,
       description: Optional[str],
       priority: str
   ) -> Todo:
       # Create todo associated with user
       pass
   
   async def get_user_todos(
       db: AsyncSession,
       user_id: str,
       status: Optional[str] = None,
       sort_by: str = "created_at",
       order: str = "desc"
   ) -> list[Todo]:
       # Query todos with filters
       pass
   
   async def get_todo_by_id(
       db: AsyncSession,
       todo_id: str,
       user_id: str
   ) -> Todo | None:
       # Get specific todo, verify ownership
       pass
   
   async def update_todo(
       db: AsyncSession,
       todo_id: str,
       user_id: str,
       **updates
   ) -> Todo:
       # Update todo fields
       pass
   
   async def delete_todo(
       db: AsyncSession,
       todo_id: str,
       user_id: str
   ) -> bool:
       # Delete todo
       pass
   
   async def toggle_completion(
       db: AsyncSession,
       todo_id: str,
       user_id: str,
       completed: bool
   ) -> Todo:
       # Update completion status
       pass
   ```

3. ✅ Create `app/api/routes/todos.py` - Todo endpoints
   ```python
   from fastapi import APIRouter, Depends, HTTPException, status, Query
   from sqlalchemy.ext.asyncio import AsyncSession
   from app.api.deps import get_current_user, get_db
   from app.models.user import User
   from typing import Optional, Literal
   
   router = APIRouter(prefix="/users/{user_id}/todos", tags=["todos"])
   
   @router.post("", response_model=TodoResponse, status_code=201)
   async def create_todo(
       user_id: str,
       request: CreateTodoRequest,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify user_id matches current_user.id
       # Create todo
       pass
   
   @router.get("", response_model=TodoListResponse)
   async def get_todos(
       user_id: str,
       status: Optional[Literal['all', 'pending', 'completed']] = Query('all'),
       sort_by: Optional[Literal['created_at', 'priority', 'title']] = Query('created_at'),
       order: Optional[Literal['asc', 'desc']] = Query('desc'),
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify user_id matches current_user.id
       # Get filtered todos
       pass
   
   @router.get("/{todo_id}", response_model=TodoResponse)
   async def get_todo(
       user_id: str,
       todo_id: str,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify ownership
       # Return todo
       pass
   
   @router.put("/{todo_id}", response_model=TodoResponse)
   async def update_todo_full(
       user_id: str,
       todo_id: str,
       request: UpdateTodoRequest,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify ownership
       # Update all fields
       pass
   
   @router.patch("/{todo_id}", response_model=TodoResponse)
   async def update_todo_partial(
       user_id: str,
       todo_id: str,
       request: PartialUpdateTodoRequest,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify ownership
       # Update only provided fields
       pass
   
   @router.patch("/{todo_id}/complete", response_model=TodoResponse)
   async def toggle_complete(
       user_id: str,
       todo_id: str,
       request: ToggleCompleteRequest,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify ownership
       # Toggle completion
       pass
   
   @router.delete("/{todo_id}", status_code=200)
   async def delete_todo(
       user_id: str,
       todo_id: str,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Verify ownership
       # Delete todo
       return {"message": "Todo deleted successfully", "deleted_id": todo_id}
   ```

4. ✅ Implement user_id verification logic
   ```python
   def verify_user_access(current_user_id: str, requested_user_id: str):
       if current_user_id != requested_user_id:
           raise HTTPException(
               status_code=status.HTTP_403_FORBIDDEN,
               detail="Not authorized to access this resource"
           )
   ```

5. ✅ Register todo routes in `app/main.py`
   ```python
   from app.api.routes import todos
   
   app.include_router(todos.router, prefix="/api")
   ```

6. ✅ Test all todo endpoints with Postman/curl
   - Create todo with valid data
   - Create todo with empty title (400)
   - Create todo with title too long (400)
   - Create todo with wrong user_id (403)
   - Get all todos for user
   - Filter todos by status (pending/completed)
   - Sort todos by priority
   - Get single todo
   - Get todo belonging to other user (403)
   - Update todo (PUT) with valid data
   - Partial update (PATCH) with some fields
   - Toggle completion status
   - Delete todo
   - Delete non-existent todo (404)

**Deliverables**:
- All CRUD endpoints implemented
- Authorization checks working
- Filtering and sorting working
- All endpoints tested

---

### Phase 5: Error Handling & Middleware

**Objective**: Add robust error handling, logging, and middleware

**Tasks**:
1. ✅ Create global exception handlers in `app/main.py`
   ```python
   from fastapi.responses import JSONResponse
   from fastapi.exceptions import RequestValidationError
   
   @app.exception_handler(RequestValidationError)
   async def validation_exception_handler(request, exc):
       return JSONResponse(
           status_code=400,
           content={
               "error": "Validation Error",
               "details": exc.errors()
           }
       )
   
   @app.exception_handler(Exception)
   async def general_exception_handler(request, exc):
       # Log error
       return JSONResponse(
           status_code=500,
           content={"error": "Internal Server Error"}
       )
   ```

2. ✅ Add request logging middleware
   ```python
   import logging
   import time
   from fastapi import Request
   
   @app.middleware("http")
   async def log_requests(request: Request, call_next):
       start_time = time.time()
       response = await call_next(request)
       duration = time.time() - start_time
       
       logging.info(
           f"{request.method} {request.url.path} "
           f"completed in {duration:.2f}s with status {response.status_code}"
       )
       return response
   ```

3. ✅ Configure structured logging
   ```python
   import logging
   import json
   
   logging.basicConfig(
       level=logging.INFO,
       format='%(message)s',
       handlers=[logging.StreamHandler()]
   )
   ```

4. ✅ Add CORS middleware configuration
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=settings.ALLOWED_ORIGINS.split(","),
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

5. ✅ Create health check endpoint
   ```python
   @app.get("/health")
   async def health_check():
       return {
           "status": "healthy",
           "timestamp": datetime.utcnow().isoformat()
       }
   ```

6. ✅ Add database health check
   ```python
   @app.get("/health/db")
   async def database_health(db: AsyncSession = Depends(get_db)):
       try:
           await db.execute(select(1))
           return {"status": "healthy", "database": "connected"}
       except Exception as e:
           return JSONResponse(
               status_code=503,
               content={"status": "unhealthy", "error": str(e)}
           )
   ```

7. ✅ Test error scenarios
   - Invalid JSON payload (422)
   - Missing required fields (422)
   - Database connection failure (503)
   - Unauthorized access (401)
   - Forbidden access (403)
   - Not found (404)

**Deliverables**:
- Global error handling implemented
- Request logging working
- Health checks functional
- CORS configured

---

### Phase 6: Testing & Documentation

**Objective**: Write comprehensive tests and finalize documentation

**Tasks**:
1. ✅ Create `tests/conftest.py` with fixtures
   ```python
   import pytest
   from httpx import AsyncClient
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
   from app.main import app
   from app.database import Base
   
   @pytest.fixture
   async def test_db():
       # Create test database
       pass
   
   @pytest.fixture
   async def client(test_db):
       async with AsyncClient(app=app, base_url="http://test") as ac:
           yield ac
   
   @pytest.fixture
   async def auth_headers(client):
       # Create test user and return auth headers
       pass
   ```

2. ✅ Create `tests/test_auth.py`
   ```python
   import pytest
   
   @pytest.mark.asyncio
   async def test_signup_success(client):
       # Test successful signup
       pass
   
   @pytest.mark.asyncio
   async def test_signup_duplicate_email(client):
       # Test duplicate email rejection
       pass
   
   @pytest.mark.asyncio
   async def test_login_success(client):
       # Test successful login
       pass
   
   @pytest.mark.asyncio
   async def test_login_invalid_credentials(client):
       # Test login failure
       pass
   
   @pytest.mark.asyncio
   async def test_rate_limiting(client):
       # Test rate limit enforcement
       pass
   ```

3. ✅ Create `tests/test_todos.py`
   ```python
   @pytest.mark.asyncio
   async def test_create_todo(client, auth_headers):
       # Test todo creation
       pass
   
   @pytest.mark.asyncio
   async def test_get_todos_filtered(client, auth_headers):
       # Test filtering
       pass
   
   @pytest.mark.asyncio
   async def test_data_isolation(client):
       # Test users can't access each other's todos
       pass
   
   @pytest.mark.asyncio
   async def test_update_todo(client, auth_headers):
       # Test update
       pass
   
   @pytest.mark.asyncio
   async def test_delete_todo(client, auth_headers):
       # Test deletion
       pass
   ```

4. ✅ Run tests and achieve 80% coverage
   ```bash
   pytest --cov=app --cov-report=html --cov-report=term
   ```

5. ✅ Update `README.md` with complete documentation
   - Project overview
   - Tech stack
   - Prerequisites
   - Installation instructions
   - Environment variables
   - Running the application
   - API documentation (link to /docs)
   - Testing instructions
   - Deployment notes

6. ✅ Verify OpenAPI documentation at `/docs`
   - All endpoints documented
   - Request/response schemas visible
   - Authentication described
   - Examples provided

7. ✅ Add docstrings to all functions
   ```python
   async def create_todo(db: AsyncSession, user_id: str, title: str, ...) -> Todo:
       """
       Create a new todo for the specified user.
       
       Args:
           db: Database session
           user_id: UUID of the user creating the todo
           title: Title of the todo (1-200 characters)
           description: Optional description (max 1000 characters)
           priority: Priority level (high, medium, low)
           
       Returns:
           Created Todo object
           
       Raises:
           HTTPException: If validation fails
       """
       pass
   ```

8. ✅ Run linting and formatting
   ```bash
   black app/ tests/
   ruff check app/ tests/
   mypy app/
   ```

**Deliverables**:
- Comprehensive test suite with 80%+ coverage
- Complete API documentation
- All code formatted and linted
- README with setup instructions

---

### Phase 7: Production Readiness

**Objective**: Prepare application for deployment

**Tasks**:
1. ✅ Add production environment configuration
   ```python
   class Settings(BaseSettings):
       ENVIRONMENT: str = "development"  # development, staging, production
       DEBUG: bool = False
       
       @property
       def is_production(self) -> bool:
           return self.ENVIRONMENT == "production"
   ```

2. ✅ Configure production database connection pooling
   ```python
   if settings.is_production:
       engine = create_async_engine(
           DATABASE_URL,
           pool_size=20,
           max_overflow=10,
           pool_pre_ping=True,
           echo=False
       )
   ```

3. ✅ Add request timeout middleware
   ```python
   from starlette.middleware.base import BaseHTTPMiddleware
   import asyncio
   
   class TimeoutMiddleware(BaseHTTPMiddleware):
       async def dispatch(self, request, call_next):
           try:
               return await asyncio.wait_for(call_next(request), timeout=30.0)
           except asyncio.TimeoutError:
               return JSONResponse(
                   status_code=504,
                   content={"error": "Request timeout"}
               )
   ```

4. ✅ Implement database connection retry logic
   ```python
   from tenacity import retry, stop_after_attempt, wait_exponential
   
   @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
   async def connect_to_database():
       # Connection logic with retry
       pass
   ```

5. ✅ Create `docker-compose.yml` for local development (optional)
   ```yaml
   version: '3.8'
   services:
     api:
       build: .
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - SECRET_KEY=${SECRET_KEY}
       depends_on:
         - db
   ```

6. ✅ Create `Dockerfile` for containerization
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY pyproject.toml .
   RUN pip install uv && uv sync
   
   COPY . .
   
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

7. ✅ Add security headers middleware
   ```python
   @app.middleware("http")
   async def add_security_headers(request: Request, call_next):
       response = await call_next(request)
       response.headers["X-Content-Type-Options"] = "nosniff"
       response.headers["X-Frame-Options"] = "DENY"
       response.headers["X-XSS-Protection"] = "1; mode=block"
       return response
   ```

8. ✅ Create deployment checklist
   - [ ] Update SECRET_KEY to production value
   - [ ] Set ENVIRONMENT=production
   - [ ] Configure production DATABASE_URL
   - [ ] Set DEBUG=False
   - [ ] Configure ALLOWED_ORIGINS with actual frontend URL
   - [ ] Run database migrations on production
   - [ ] Test health checks
   - [ ] Configure monitoring/logging service
   - [ ] Set up backup strategy for database

**Deliverables**:
- Production-ready configuration
- Docker containerization
- Security hardening complete
- Deployment checklist

---

## Development Workflow

### Daily Development Process

1. **Start development server**:
   ```bash
   cd backend
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

3. **Run tests**:
   ```bash
   pytest -v
   pytest --cov=app --cov-report=html
   ```

4. **Format code**:
   ```bash
   black app/ tests/
   ruff check app/ tests/ --fix
   ```

5. **Type checking**:
   ```bash
   mypy app/
   ```

6. **Database migrations**:
   ```bash
   # Create migration
   alembic revision --autogenerate -m "Description"
   
   # Apply migration
   alembic upgrade head
   
   # Rollback
   alembic downgrade -1
   ```

---

## Testing Strategy

### Unit Tests
- **Services**: Test business logic independently
- **Utilities**: Test password hashing, JWT creation/verification
- **Validators**: Test Pydantic models and custom validators

### Integration Tests
- **API Endpoints**: Test complete request/response flow
- **Database Operations**: Test CRUD operations
- **Authentication Flow**: Test signup → login → protected endpoint

### Security Tests
- **Authorization**: Test user can't access other users' data
- **Rate Limiting**: Test authentication rate limits
- **Input Validation**: Test malicious inputs rejected

### Test Coverage Goals
- Overall: 80%+
- Services: 90%+
- Routes: 85%+
- Models: 70%+

---

## API Testing with Postman

### Collection Structure

```
Todo API
├── Authentication
│   ├── Signup
│   ├── Login
│   ├── Get Current User
│   └── Logout
├── Todos
│   ├── Create Todo
│   ├── Get All Todos
│   ├── Get Todo by ID
│   ├── Update Todo (PUT)
│   ├── Update Todo (PATCH)
│   ├── Toggle Complete
│   └── Delete Todo
└── Health
    ├── Health Check
    └── Database Health
```

### Environment Variables
```
base_url: http://localhost:8000
token: {{access_token}}  # Auto-updated from login response
user_id: {{current_user_id}}  # Auto-updated from login response
```

---

## Dependencies Summary

### Production Dependencies
```toml
fastapi = "^0.110.0"           # Web framework
uvicorn = "^0.27.0"            # ASGI server
sqlalchemy = "^2.0.0"          # ORM (async)
asyncpg = "^0.29.0"            # PostgreSQL driver
alembic = "^1.13.0"            # Database migrations
pydantic = "^2.0.0"            # Data validation
pydantic-settings = "^2.0.0"   # Settings management
python-jose = "^3.3.0"         # JWT handling
passlib = "^1.7.4"             # Password hashing
python-multipart = "^0.0.9"    # Form data parsing
python-dotenv = "^1.0.0"       # Environment variables
slowapi = "^0.1.9"             # Rate limiting
```

### Development Dependencies
```toml
pytest = "^7.4.0"              # Testing framework
pytest-asyncio = "^0.21.0"     # Async test support
httpx = "^0.25.0"              # HTTP client for tests
black = "^23.0.0"              # Code formatting
ruff = "^0.1.0"                # Fast linting
mypy = "^1.7.0"                # Static type checking
```

---

## Success Criteria Checklist

### Authentication
- [ ] User can signup with email/password/name
- [ ] Duplicate email returns 409 Conflict
- [ ] Weak password returns 400 Bad Request
- [ ] User can login with valid credentials
- [ ] Invalid credentials return 401 Unauthorized
- [ ] Login returns JWT token with 7-day expiration
- [ ] Rate limiting blocks after 5 failed attempts
- [ ] Protected endpoints require valid JWT token
- [ ] Invalid/expired token returns 401 Unauthorized

### Todo Management
- [ ] User can create todo with title, description, priority
- [ ] Empty title returns 400 Bad Request
- [ ] Title > 200 chars returns 400 Bad Request
- [ ] User can view all their todos
- [ ] Todos are sorted by created_at DESC by default
- [ ] User can filter todos by status (pending/completed)
- [ ] User can sort todos by created_at, priority, title
- [ ] User can update todo (PUT for full, PATCH for partial)
- [ ] User can toggle completion status
- [ ] completed_at timestamp set when marked complete
- [ ] User can delete todo
- [ ] Deleted todo returns 404 on subsequent requests

### Authorization & Data Isolation
- [ ] User can only access their own todos
- [ ] Accessing other user's todo returns 403 Forbidden
- [ ] user_id in URL must match JWT user_id claim
- [ ] Database enforces foreign key constraints
- [ ] CASCADE DELETE removes all todos when user deleted

### API Quality
- [ ] All endpoints respond < 500ms (95th percentile)
- [ ] OpenAPI documentation complete at /docs
- [ ] Health check endpoint functional
- [ ] Database health check functional
- [ ] CORS configured for allowed origins
- [ ] Error responses include helpful messages
- [ ] Validation errors include field details

### Code Quality
- [ ] Code passes black formatting (zero errors)
- [ ] Code passes ruff linting (zero errors)
- [ ] Type hints on all functions
- [ ] Docstrings on all public functions
- [ ] Test coverage ≥ 80%
- [ ] All tests passing

### Security
- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] JWT tokens signed with HS256
- [ ] No secrets in code or version control
- [ ] SQL injection prevented via parameterized queries
- [ ] Input validation on all endpoints
- [ ] Security headers added (X-Frame-Options, etc.)

---

## Troubleshooting Guide

### Common Issues

**Issue**: Database connection fails
```
Solution:
1. Check DATABASE_URL in .env
2. Verify Neon database is running
3. Test connection: psql $DATABASE_URL
4. Check network connectivity
```

**Issue**: JWT token verification fails
```
Solution:
1. Verify SECRET_KEY matches between creation and verification
2. Check token hasn't expired
3. Ensure Bearer prefix in Authorization header
4. Verify token format: "Bearer <token>"
```

**Issue**: Alembic migrations fail
```
Solution:
1. Check database connection
2. Verify models imported in env.py
3. Run: alembic revision --autogenerate
4. Review migration file before applying
```

**Issue**: Tests fail with database errors
```
Solution:
1. Use separate test database
2. Ensure test fixtures clean up data
3. Check async session handling
4. Verify transaction rollback
```

---

## Next Steps After Backend Completion

1. **Frontend Development**:
   - Create Next.js application
   - Implement authentication flow
   - Build todo management UI
   - Connect to backend API

2. **Deployment**:
   - Deploy backend to Render/Railway/Fly.io
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Configure monitoring and logging

3. **Enhancements**:
   - Add todo categories/tags
   - Implement due dates and reminders
   - Add todo sharing functionality
   - Implement search functionality
   - Add bulk operations

---

## Technical Context

- **Feature**: Web-Based Todo Management API (Backend Only)
- **Location**: `backend/` directory
- **Technology Stack**: Python 3.11+, FastAPI, SQLAlchemy, Neon PostgreSQL, Better Auth
- **Architecture**: RESTful API with JWT authentication
- **Database**: Async PostgreSQL with connection pooling
- **Validation**: Pydantic v2 for request/response schemas
- **Testing**: pytest with async support

### Key Constraints
- Backend only - no frontend in this implementation
- Must support async operations throughout
- Database must be Neon Serverless PostgreSQL
- Authentication via Better Auth with JWT
- All passwords hashed with bcrypt (12 rounds)
- Response times < 500ms for 95% of requests

### Future Considerations
- Frontend will connect to these endpoints
- May need to add pagination for todo lists
- Consider adding WebSocket support for real-time updates
- May need to add email verification for signups
- Consider adding OAuth providers (Google, GitHub)

---

## Constitution Compliance

✅ **Spec-Driven Development**: Following specification from `specs/1-web-todo-management-backend/spec.md`

✅ **Clean Architecture**: 
- Models (database entities)
- Schemas (Pydantic validation)
- Services (business logic)
- Routes (API endpoints)
- Dependencies (dependency injection)

✅ **Code Quality Standards**:
- Type hints on all functions
- PEP 8 compliance via black/ruff
- Descriptive variable names
- Docstrings (Google style)
- 80%+ test coverage

✅ **Cloud-Native Ready**:
- Environment-based configuration
- Containerized with Docker
- Stateless API (JWT tokens)
- Scalable database connection pooling

✅ **Security First**:
- Password hashing with bcrypt
- JWT token-based auth
- Input validation
- Rate limiting
- CORS configuration
- SQL injection prevention

---

## Completion Criteria

This implementation is complete when:

1. All API endpoints are implemented and tested
2. Authentication works end-to-end
3. Data isolation is enforced (users can't access others' todos)
4. All tests pass with ≥80% coverage
5. Code passes linting and formatting checks
6. Documentation is complete (README + docstrings)
7. Application runs without errors
8. OpenAPI documentation is accurate
9. Health checks are functional
10. Production configuration is ready

**Current Phase**: Phase 0 (Planning Complete)