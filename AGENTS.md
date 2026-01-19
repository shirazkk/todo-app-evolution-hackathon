# AGENTS.md - Cross-Agent Truth for Todo App Evolution

## Overview
This document defines the standard operating procedures for all agents in the Todo App Evolution project. It serves as the single source of truth for agent behavior, tool usage, and coding standards across all phases.

## Agent Behavior Standards

### General Principles
- **Spec-Driven First**: Always read and follow specifications before implementing
- **Clean Architecture**: Maintain separation of concerns (models, services, controllers)
- **Type Safety**: Use type hints everywhere (TypeScript for frontend, Python type hints for backend)
- **Error Handling**: Return values from business logic, no printing in core functions
- **Validation**: Validate all inputs at boundaries

### Communication Protocols
- **Cross-Agent Coordination**: Share state via agreed-upon data structures
- **Context Passing**: Pass relevant context between agent interactions
- **Error Propagation**: Use consistent error formats across agents
- **Logging Standards**: Use structured logging with consistent field names

## Tool Usage Guidelines

### Code Generation Agents
- **Frontend Agent** (`nextjs-dev-agent`): Use for Next.js component generation
  - Generate server components by default
  - Use TypeScript with strict typing
  - Implement responsive design with Tailwind CSS
  - Follow Next.js 16 App Router conventions

- **Backend Agent** (`fastapi-dev-agent`): Use for API endpoint generation
  - Implement async/await patterns consistently
  - Use Pydantic for request/response validation
  - Follow RESTful API design principles
  - Implement proper authentication/authorization

- **Database Agent** (`database-designer-agent`): Use for SQLModel generation
  - Generate models with proper relationships
  - Include created_at/updated_at timestamps
  - Add appropriate indexes and constraints
  - Follow Neon DB best practices

### Code Standards
- **Frontend (Next.js)**:
  - Use Server Components by default
  - Client components only when interactivity is needed
  - Strict TypeScript with no implicit any
  - Tailwind CSS with consistent design system
  - Proper SEO metadata implementation

- **Backend (FastAPI)**:
  - Async patterns throughout
  - Pydantic models for all data validation
  - Dependency injection for services
  - Proper error handling with HTTPException
  - Security headers and CORS configuration

- **Database (SQLModel)**:
  - UUID primary keys for security
  - Proper foreign key relationships
  - Timestamp fields on all tables
  - Indexes on frequently queried fields
  - Connection pooling configuration

## Agent Interaction Patterns

### Phase 1 (Console App) Agents
- Focus on in-memory storage patterns
- Validate input with clear error messages
- Implement full CRUD operations
- Follow MVC pattern (models, managers, main)

### Phase 2 (Web App) Agents
- Coordinate between frontend and backend
- Implement authentication flow
- Set up database connections
- Create API contracts between services

### Phase 3+ (AI, K8s, Cloud) Agents
- Maintain backward compatibility
- Implement proper logging and monitoring
- Follow cloud-native patterns
- Design for scalability and resilience

## Quality Standards

### Code Quality
- Maximum 30 lines per function/method
- Descriptive variable and function names
- Consistent error handling patterns
- Comprehensive type annotations
- Proper documentation with docstrings

### Testing Standards
- Unit tests for all business logic
- Integration tests for API endpoints
- Type checking with strict mode
- Linting with project-specific rules
- Performance benchmarks where applicable

### Security Considerations
- Input validation at all boundaries
- Proper authentication and authorization
- Secure session management
- Protection against common vulnerabilities
- Safe error message handling

## Error Handling Patterns

### Business Logic Layer
- Return error objects/values rather than throwing
- Validate inputs before processing
- Use specific error types with clear messages
- Maintain state consistency during errors

### API Layer
- Use appropriate HTTP status codes
- Consistent error response format
- Log errors without exposing internals
- Graceful degradation when possible

### Database Layer
- Handle connection failures gracefully
- Implement proper transaction management
- Use connection pooling efficiently
- Validate data before persistence

## Performance Guidelines

### Frontend Performance
- Leverage Next.js image optimization
- Implement proper caching strategies
- Use code splitting effectively
- Optimize bundle sizes
- Implement loading states appropriately

### Backend Performance
- Use async operations for I/O
- Implement proper database indexing
- Cache expensive operations
- Use background tasks for long operations
- Optimize query patterns

## Agent Coordination

### Data Consistency
- Maintain consistent data schemas across agents
- Use shared validation rules
- Implement proper serialization/deserialization
- Handle data migrations between phases

### Configuration Management
- Use environment variables for configuration
- Maintain consistent naming conventions
- Separate development/production configurations
- Secure handling of sensitive information

## Cross-Phase Standards

### Backward Compatibility
- Maintain API compatibility when possible
- Implement proper versioning strategies
- Plan deprecations thoughtfully
- Document breaking changes clearly

### Evolution Patterns
- Build for incremental feature addition
- Maintain clean separation of concerns
- Design extensible architectures
- Plan for horizontal scaling

This document should be referenced by all agents to ensure consistent behavior and quality across the entire project lifecycle.