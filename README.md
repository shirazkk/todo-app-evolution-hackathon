# Ai-Native Hackathons: Todo Application

Welcome to the Ai-Native Hackathon Project - a comprehensive todo application developed in 5 phases using spec-driven development methodologies.

## 🎯 **Project Overview**

This project implements a full-stack todo application with AI-powered features, built using modern Python technologies, FastAPI, Neon PostgreSQL, and AI integration. The application follows a spec-driven development approach across 5 distinct phases.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   FastAPI       │───▶│  Neon PostgreSQL│
│   (React/Next)  │    │   Backend       │    │   (Serverless)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                            │    │    │
                            ▼    ▼    ▼
                       ┌─────────────────┐
                       │  SQLAlchemy     │
                       │  ORM (Async)    │
                       └─────────────────┘
                            │    │
                            ▼    ▼
                       ┌─────────────────┐
                       │  Pydantic       │
                       │  Validation     │
                       └─────────────────┘
```

## 📋 **Phase 1: In-Memory Python Console App**

**Status**: ✅ **COMPLETED**

### Objective
Build a command-line todo application that stores tasks in memory using the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code.

### Tech Stack
- Python 3.11+
- Claude Code
- Spec-Kit Plus
- UV package manager

### Features Implemented
- **Add Todo**: Create new todos with title, description, and priority
- **Delete Todo**: Remove todos by ID
- **Update Todo**: Modify todo details
- **View Todos**: List all todos with filtering options
- **Mark Complete**: Toggle completion status
- **In-Memory Storage**: All data stored in memory (for console app)

### Key Components
- `src/todo_app/models.py` - Todo data models
- `src/todo_app/storage.py` - In-memory storage implementation
- `src/todo_app/todo_manager.py` - Core todo management logic
- `src/todo_app/cli.py` - Command-line interface
- `specs/0-console-todo-management/spec.md` - Console app specification
- `specs/0-console-todo-management/plan.md` - Implementation plan
- `specs/0-console-todo-management/tasks.md` - Task breakdown

### Success Criteria Met
- ✅ All 5 Basic Level features implemented (Add, Delete, Update, View, Mark Complete)
- ✅ Command-line interface functional
- ✅ In-memory storage working
- ✅ Proper error handling
- ✅ Unit tests passing

---

## 🌐 **Phase 2: Full-Stack Web Application**

**Status**: ✅ **COMPLETED**

### Objective
Migrate from console app to a full-stack web application with authentication, database persistence, and REST API.

### Tech Stack
- **Backend**: FastAPI, SQLAlchemy 2.0+, asyncpg
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT with bcrypt hashing
- **Validation**: Pydantic v2
- **Migration**: Alembic

### Features Implemented
- **Authentication System**: User signup/login/logout with JWT tokens
- **Todo Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Data Isolation**: Users can only access their own todos
- **Security**: Password hashing, rate limiting, input validation
- **Filtering & Sorting**: Todos can be filtered by status and sorted by various fields
- **API Documentation**: Interactive OpenAPI/Swagger docs at `/docs`

### Key Components
- `app/main.py` - FastAPI application entry point
- `app/models/user.py` - User SQLAlchemy model
- `app/models/todo.py` - Todo SQLAlchemy model
- `app/models/session.py` - Session model for auth
- `app/schemas/auth.py` - Authentication Pydantic schemas
- `app/schemas/todo.py` - Todo Pydantic schemas
- `app/services/auth_service.py` - Authentication business logic
- `app/services/todo_service.py` - Todo business logic
- `app/api/routes/auth.py` - Authentication endpoints
- `app/api/routes/todos.py` - Todo endpoints
- `app/core/security.py` - Security utilities (password hashing, JWT)
- `app/database.py` - Database connection with async support
- `alembic/` - Database migration files

### Database Schema
- **users** table: Stores user accounts with encrypted passwords
- **todos** table: Stores todo items linked to users
- **sessions** table: For authentication session management

### API Endpoints
```
Authentication:
POST   /api/auth/signup              - Register new user
POST   /api/auth/login               - Login and get JWT token
POST   /api/auth/logout              - Logout
GET    /api/auth/me                  - Get current user info

Todo Management:
POST   /api/users/{user_id}/todos    - Create todo
GET    /api/users/{user_id}/todos    - Get all todos (with filters)
GET    /api/users/{user_id}/todos/{todo_id} - Get single todo
PUT    /api/users/{user_id}/todos/{todo_id} - Full update
PATCH  /api/users/{user_id}/todos/{todo_id} - Partial update
PATCH  /api/users/{user_id}/todos/{todo_id}/complete - Toggle completion
DELETE /api/users/{user_id}/todos/{todo_id} - Delete todo
```

### Security Features
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 7-day expiration
- Rate limiting on auth endpoints (5 attempts/min)
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- User authorization and data isolation

### Success Criteria Met
- ✅ Migrated from SQLite to Neon PostgreSQL with async support
- ✅ All 79 tasks completed successfully
- ✅ Authentication system fully functional
- ✅ Todo CRUD operations working
- ✅ Data isolation between users enforced
- ✅ API endpoints accessible with proper documentation
- ✅ Database migrations working
- ✅ Ready for production deployment

---

## 🤖 **Phase 3: AI-Powered Todo Chatbot**

**Status**: 🔄 **IN PROGRESS / NOT COMPLETE YET**

### Objective
Integrate an AI chatbot that can understand natural language and help users manage their todos.

### Planned Features
- **Natural Language Processing**: Parse user commands like "Remind me to buy groceries tomorrow"
- **AI-Powered Suggestions**: Smart todo suggestions based on patterns
- **Voice Integration**: Speech-to-text for hands-free todo creation
- **Context Awareness**: Remember user preferences and context
- **Smart Prioritization**: AI-driven priority suggestions

### Planned Tech Stack
- **AI Framework**: OpenAI GPT or similar LLM
- **Chat Interface**: WebSocket for real-time communication
- **Natural Language Processing**: spaCy, NLTK, or transformers
- **Voice Processing**: Speech recognition libraries

### Planned Components
- `app/api/routes/chat.py` - Chatbot endpoints
- `app/services/ai_service.py` - AI processing service
- `app/core/nlp.py` - Natural language processing utilities
- AI model training and fine-tuning scripts

---

## 🚀 **Phase 4: Local Kubernetes Deployment**

**Status**: ❌ **NOT STARTED YET**

### Objective
Deploy the application locally using Kubernetes with Docker, Minikube, Helm, and kubectl-ai.

### Planned Features
- **Containerization**: Docker containers for all services
- **Orchestration**: Kubernetes deployment with Minikube
- **Service Discovery**: Proper service-to-service communication
- **Load Balancing**: Traffic distribution across multiple pods
- **Persistent Storage**: Database persistence in Kubernetes
- **Monitoring**: Prometheus and Grafana integration

### Planned Tech Stack
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes, Minikube
- **Packaging**: Helm charts
- **CLI**: kubectl-ai, kagent
- **Monitoring**: Prometheus, Grafana

### Planned Components
- `k8s/` - Kubernetes manifests
- `charts/` - Helm charts
- `docker-compose.yml` - Local development setup
- `Dockerfile` - Container definitions

---

## ☁️ **Phase 5: Advanced Cloud Deployment**

**Status**: ❌ **NOT STARTED YET**

### Objective
Deploy to production cloud environment with Kafka, Dapr, and DigitalOcean DOKS.

### Planned Features
- **Event Streaming**: Kafka for real-time todo updates
- **Microservices**: Dapr for distributed application runtime
- **Cloud Native**: DigitalOcean Kubernetes Service (DOKS)
- **Auto Scaling**: Dynamic scaling based on demand
- **High Availability**: Multi-region deployment
- **Observability**: Advanced monitoring and logging

### Planned Tech Stack
- **Messaging**: Apache Kafka for event streaming
- **Distributed**: Dapr (Distributed Application Runtime)
- **Cloud**: DigitalOcean Kubernetes Service (DOKS)
- **Monitoring**: ELK Stack, Datadog, or similar
- **Security**: Advanced authentication and authorization

### Planned Components
- `cloud/` - Cloud deployment configurations
- `kafka/` - Event streaming setup
- `dapr/` - Dapr configuration files
- `monitoring/` - Production monitoring setup

---

## 🛠️ **Getting Started**

### Prerequisites
- Python 3.11+
- PostgreSQL database (Neon account recommended)
- Node.js (for frontend in Phase 3)
- Docker (for containerization in Phase 4)

### Phase 2 Backend Setup (Current)

1. **Clone the repository**
```bash
git clone <repository-url>
cd hackathon-2-todo-application/backend
```

2. **Install dependencies**
```bash
pip install uv
uv sync
```

3. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run database migrations**
```bash
alembic upgrade head
```

5. **Start the application**
```bash
uvicorn app.main:app --reload
```

6. **Access the API**
- API documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string with asyncpg driver
- `SECRET_KEY`: JWT secret key (generate a strong random key)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_DAYS`: Token expiration (default: 7)
- `RATE_LIMIT_PER_MINUTE`: Rate limit for auth endpoints (default: 5)

---

## 🧪 **Testing**

### Backend Tests
```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

### API Testing
- Use the interactive API documentation at `/docs`
- Test with Postman collection (included in project)
- Automated integration tests in `tests/` directory

---

## 📊 **Database Migration from SQLite to Neon PostgreSQL**

### The Challenge
Initially, the application used SQLite which doesn't support async operations, causing the error:
```
sqlalchemy.exc.InvalidRequestError: The asyncio extension requires an async driver to be used. The loaded 'pysqlite' is not async.
```

### The Solution
- Migrated to `postgresql+asyncpg://` driver with Neon PostgreSQL
- Updated SQLAlchemy configuration for async support
- Fixed all database connection patterns
- Updated Alembic for async PostgreSQL migrations
- Maintained all existing functionality while gaining async performance

---

## 🚀 **Production Deployment**

### Ready for Production
- ✅ Neon PostgreSQL with serverless scaling
- ✅ JWT authentication with secure tokens
- ✅ Rate limiting and security measures
- ✅ Comprehensive error handling
- ✅ Health check endpoints
- ✅ Structured logging
- ✅ CORS configuration

### Deployment Checklist
- [ ] Use strong SECRET_KEY in production
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and alerting
- [ ] Implement backup strategies
- [ ] Configure SSL certificates
- [ ] Set up domain and DNS
- [ ] Configure environment-specific settings

---

## 🤝 **Contributing**

This project follows the spec-driven development methodology:
1. Write specifications first
2. Generate implementation plans
3. Break into testable tasks
4. Implement with Claude Code
5. Validate against success criteria

---

## 📄 **License**

This project is part of the Ai-Native Hackathons and is open-source for educational purposes.

---

## 🏆 **Hackathon Goals**

1. **Learn**: Master modern Python web development with FastAPI
2. **Build**: Create a production-ready application
3. **Deploy**: Experience cloud-native deployment patterns
4. **Integrate**: Implement AI-powered features
5. **Scale**: Deploy with Kubernetes and microservices

---

## 📞 **Support**

For questions about this project:
- Check the API documentation at `/docs`
- Review the specifications in the `specs/` directory
- Look at the implementation details in the task breakdowns

**Current Phase**: Phase 2 - Full-Stack Web Application (✅ COMPLETED)
**Next Phase**: Phase 3 - AI-Powered Todo Chatbot (🔄 IN PROGRESS)