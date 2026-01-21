# Todo API - Full-Stack Web Application Backend

This is the backend API for a multi-user todo management system built as part of the hackathon project. It provides a complete REST API with authentication, todo management, and data isolation between users.

## Tech Stack

- **Language**: Python 3.11+
- **API Framework**: FastAPI
- **Database**: PostgreSQL (Neon Serverless) with SQLAlchemy 2.0+ (async)
- **Authentication**: JWT-based with custom security utilities
- **ORM**: SQLAlchemy 2.0+ (async)
- **Migration Tool**: Alembic
- **Validation**: Pydantic v2
- **Password Hashing**: bcrypt
- **Rate Limiting**: slowapi

## Features

### Authentication
- User registration with email/password
- User login with JWT token generation
- Protected endpoints requiring valid JWT tokens
- Rate limiting on authentication endpoints (5 attempts per minute)

### Todo Management
- Create todos with title, description, and priority
- Retrieve all user's todos with filtering and sorting options
- Update todos (full update with PUT, partial update with PATCH)
- Mark todos as complete/incomplete
- Delete todos
- Data isolation - users can only access their own todos

### Security & Data Protection
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 7-day expiration
- Input validation on all endpoints
- Rate limiting to prevent abuse
- Data isolation between users enforced at the application level

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

#### POST `/api/auth/login`
Authenticate user and return JWT token

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### POST `/api/auth/logout`
Logout user (stateless - client manages token)

#### GET `/api/auth/me`
Get current user info (requires valid JWT token)

### Todo Endpoints (require JWT authentication)

#### POST `/api/users/{user_id}/todos`
Create a new todo

#### GET `/api/users/{user_id}/todos`
Retrieve all user's todos with optional filtering

Query Parameters:
- `status`: "all", "pending", "completed"
- `sort_by`: "created_at", "priority", "title"
- `order`: "desc", "asc"

#### GET `/api/users/{user_id}/todos/{todo_id}`
Retrieve a specific todo

#### PUT `/api/users/{user_id}/todos/{todo_id}`
Full update of a todo

#### PATCH `/api/users/{user_id}/todos/{todo_id}`
Partial update of a todo

#### PATCH `/api/users/{user_id}/todos/{todo_id}/complete`
Toggle completion status

#### DELETE `/api/users/{user_id}/todos/{todo_id}`
Delete a todo

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL database (or Neon account for serverless PostgreSQL)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -e .
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database connection string and other settings

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`

## Database Setup

The application uses SQLAlchemy with async support and Alembic for migrations. The initial schema includes:

- `users` table: Stores user accounts with hashed passwords
- `todos` table: Stores todo items linked to users
- `sessions` table: For potential future session management

## Environment Variables

- `DATABASE_URL`: Database connection string (supports PostgreSQL with asyncpg)
- `SECRET_KEY`: Secret key for JWT signing
- `ALGORITHM`: Algorithm for JWT encoding (default: HS256)
- `ACCESS_TOKEN_EXPIRE_DAYS`: JWT expiration time in days (default: 7)
- `API_V1_PREFIX`: API prefix (default: /api)
- `PROJECT_NAME`: Project name (default: Todo API)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- `RATE_LIMIT_PER_MINUTE`: Rate limit for auth endpoints (default: 5)

## Testing

The API includes comprehensive test coverage with pytest. To run tests:

```bash
pytest
```

## Architecture

The application follows a clean architecture pattern:

- **Models**: SQLAlchemy ORM models in `app/models/`
- **Schemas**: Pydantic validation models in `app/schemas/`
- **Services**: Business logic in `app/services/`
- **Routes**: API endpoints in `app/api/routes/`
- **Core**: Utilities and security functions in `app/core/`
- **Database**: Database configuration in `app/database.py`

## Security Considerations

- Passwords are hashed using bcrypt with a cost factor of 12
- JWT tokens are used for authentication with proper expiration
- Input validation is performed using Pydantic
- Rate limiting prevents authentication brute-force attacks
- Data isolation ensures users can only access their own data
- CORS is configured to restrict cross-origin requests

## Production Deployment

For production deployment:

1. Use a strong, randomly generated `SECRET_KEY`
2. Configure proper database connection pooling
3. Enable HTTPS
4. Set appropriate CORS origins
5. Monitor and log appropriately
6. Set up backup strategies for the database

## License

This project is part of a hackathon and is open-source.