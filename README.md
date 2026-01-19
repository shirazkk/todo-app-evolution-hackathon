# Todo App Evolution - Hackathon II

## Project Overview
This is a 5-phase hackathon project where a simple console todo app evolves into a cloud-native, AI-powered distributed system. This project follows spec-driven development using Claude Code and Spec-Kit Plus.

## Phases
- **Phase I**: Console App (Python, in-memory storage) ✓ COMPLETED
- **Phase II**: Web App (Next.js, FastAPI, SQLModel, Neon DB) ✓ COMPLETED
- **Phase III**: AI Chatbot (OpenAI Agents SDK, MCP SDK, ChatKit)
- **Phase IV**: Local K8s (Docker, Minikube, Helm, kubectl-ai, kagent)
- **Phase V**: Cloud Deploy (Kafka, Dapr, DigitalOcean DOKS)

## Current Status
- [x] Project setup and constitution
- [x] Phase I: Console App
- [x] Phase II: Full-Stack Web Application with Authentication

## Phase II: Full-Stack Web Application

### Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Todo Management**: Create, read, update, delete, and mark todos as complete
- **Responsive UI**: Modern web interface built with Next.js and Tailwind CSS
- **Secure API**: FastAPI backend with proper authentication middleware
- **Data Isolation**: Users can only access their own todos

### Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13+
- **Database**: SQLModel with Neon PostgreSQL
- **Authentication**: JWT-based with secure password hashing
- **Validation**: Pydantic/Zod for data validation

### Prerequisites
- Node.js 18+ for frontend
- Python 3.13+ for backend
- PostgreSQL (or Neon DB account)
- Poetry or pip for Python dependencies

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shirazkk/todo-app-evolution-hackathon.git
cd todo-app-evolution-hackathon
```

### Setup Instructions

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv
   ```

3. Set up environment variables:
   ```bash
   # Create .env file in backend directory
   echo "DATABASE_URL=postgresql://username:password@localhost/dbname" > .env
   echo "SECRET_KEY=your-super-secret-key-here" >> .env
   ```

4. Run the backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` to access the application

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout (placeholder)

#### Todo Management
- `POST /api/tasks/` - Create a new todo
- `GET /api/tasks/` - Get all todos for current user
- `GET /api/tasks/{id}` - Get a specific todo
- `PUT /api/tasks/{id}` - Update a todo
- `PATCH /api/tasks/{id}/complete` - Mark todo as complete/incomplete
- `DELETE /api/tasks/{id}` - Delete a todo
- `GET /api/tasks/user/{user_id}` - Get todos for specific user

#### Health Check
- `GET /health` - Health check endpoint

### Testing with Postman

We've included a Postman collection (`postman_collection.json`) that tests the complete authentication flow:

1. Import the `postman_collection.json` file into Postman
2. Set up an environment with `baseUrl` variable pointing to your API (e.g., `http://localhost:8000`)
3. Run the collection to test:
   - Health check
   - User registration
   - User login
   - Get current user info
   - Create, read, update, and delete todos
   - Mark todos as complete/incomplete

### Security Features

- Passwords are securely hashed using bcrypt
- JWT tokens with 7-day expiration
- Authentication middleware protects all todo endpoints
- Data isolation ensures users can only access their own todos
- Input validation on both frontend and backend

### Architecture

The application follows clean architecture principles:
- **Frontend**: React components with Next.js App Router
- **Backend**: FastAPI with dependency injection and proper separation of concerns
- **Database**: SQLModel models with Neon PostgreSQL
- **Authentication**: JWT-based with middleware protection

### Running Tests

The complete user journey can be tested via:
1. User registration
2. Login
3. Adding todos
4. Marking todos as complete
5. Deleting todos
6. Logout

This flow is automated in the Postman collection.

### Environment Variables

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT signing
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 7 days)

### Troubleshooting

- If the backend doesn't start, ensure all Python dependencies are installed
- If the frontend can't connect to the backend, check that both are running on their respective ports
- If authentication fails, verify that the SECRET_KEY is consistent between restarts
- Check that the database connection string is correct

## Development

This project uses spec-driven development. To add new features:

1. Create a specification using `/sp.specify`
2. Generate a plan using `/sp.plan`
3. Break into tasks using `/sp.tasks`
4. Implement using `/sp.implement`

## Contributing

This project follows spec-driven development practices. All changes should be guided by specifications that are reviewed and validated before implementation.