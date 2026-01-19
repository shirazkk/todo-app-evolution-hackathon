# Feature Specification: Web-Based Todo Management with Authentication

**Feature Branch**: `1-web-todo-management`
**Created**: 2026-01-19
**Status**: Draft
**Input**: User description: "Create complete specification for Phase II first feature: "Web-Based Todo Management with Authentication"

@specs/phase2/features

This is the foundational feature that transforms Phase I console app into a full-stack web application.

## Spec Requirements:

### Feature Overview:
- Transform console todo app to web-based multi-user application
- Add user authentication (signup/login)
- Persistent storage in Neon PostgreSQL
- RESTful API with JWT protection
- Responsive Next.js frontend

### User Stories:
1. As a new user, I want to sign up with email/password so I can have my own todo account
2. As a returning user, I want to log in to access my todos
3. As a logged-in user, I want to add todos with title, description, and priority
4. As a logged-in user, I want to view all my todos (only mine, not other users')
5. As a logged-in user, I want to update my todo details
6. As a logged-in user, I want to delete my todos
7. As a logged-in user, I want to mark todos as complete/incomplete
8. As a user, I want to filter todos by status (all/pending/completed)

### Acceptance Criteria:

**Authentication:**
- Signup: email (valid format), password (min 8 chars), name (required)
- Login: email + password, returns JWT token
- Token stored in httpOnly cookie
- Token expires after 7 days
- Protected routes redirect to login if not authenticated
- Logout clears token and redirects to login

**Todo CRUD Operations:**
- Create: Title required (max 200 chars), description optional (max 1000 chars), priority (High/Medium/Low)
- Read: List shows only current user's todos, sorted by created_at descending
- Update: Can modify title, description, priority
- Delete: Removes todo permanently with confirmation
- Complete: Toggle completed status, show visual indicator

**Data Isolation:**
- Each user sees ONLY their own todos
- API validates user_id from JWT matches request
- Attempting to access other user's todos returns 403 Forbidden

**UI/UX:**
- Responsive design (mobile, tablet, desktop)
- Loading states during API calls
- Success/error messages for all actions
- Form validation with inline errors
- Keyboard shortcuts (Enter to submit, Esc to cancel)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration and Authentication (Priority: P1)

As a new user, I want to sign up with email/password so I can have my own todo account.

**Why this priority**: This is the foundational functionality that enables all other features - users must be able to register and authenticate to access the todo management system.

**Independent Test**: Can be fully tested by providing valid registration details and verifying that an account is created with proper authentication token.

**Acceptance Scenarios**:

1. **Given** user is on the signup page, **When** user enters valid email, password (min 8 chars with 1 uppercase, 1 lowercase, 1 number), and name (2-100 chars), **Then** system creates new account with hashed password and logs user in with JWT token stored in httpOnly cookie
2. **Given** user enters invalid email format, **When** user submits signup, **Then** system returns 400 validation error with message "Invalid email format" without creating account
3. **Given** user enters duplicate email, **When** user submits signup, **Then** system returns 409 conflict error with message "Email already registered" without creating account
4. **Given** user enters weak password (less than 8 chars, no special requirements met), **When** user submits signup, **Then** system returns 400 validation error with message "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"

---

### User Story 2 - Todo Management (Priority: P1)

As a logged-in user, I want to add, view, update, and delete todos with title, description, and priority.

**Why this priority**: This is the core functionality that users will interact with most frequently - the primary reason for the application.

**Independent Test**: Can be fully tested by performing all CRUD operations on todos with proper authentication and verifying data isolation.

**Acceptance Scenarios**:

1. **Given** user is logged in with valid JWT token, **When** user creates a new todo with title (1-200 chars) and optional description (up to 1000 chars), **Then** system creates todo associated with user_id from JWT and returns complete todo object with auto-generated ID and timestamps
2. **Given** user has created todos, **When** user requests todo list via GET /api/{user_id}/todos, **Then** system validates JWT matches user_id and returns only todos belonging to the current user, sorted by created_at descending
3. **Given** user wants to update a todo, **When** user sends PUT request to /api/{user_id}/todos/{todo_id} with modified details, **Then** system validates user owns the todo and updates only that specific todo, returning updated object
4. **Given** user wants to delete a todo, **When** user sends DELETE request to /api/{user_id}/todos/{todo_id} with confirmation, **Then** system validates ownership and removes todo permanently, returning success confirmation

---

### User Story 3 - Todo Status Management (Priority: P2)

As a logged-in user, I want to mark todos as complete/incomplete and filter todos by status.

**Why this priority**: Essential functionality for todo management - users need to track completion status and filter their tasks.

**Independent Test**: Can be fully tested by toggling completion status on todos and applying filters to verify correct display.

**Acceptance Scenarios**:

1. **Given** user has an incomplete todo, **When** user sends PATCH request to /api/{user_id}/todos/{todo_id}/complete with completed=true, **Then** system updates completion status to true and returns updated todo with visual indicator
2. **Given** user wants to filter todos, **When** user requests /api/{user_id}/todos?status=pending, **Then** system returns only incomplete todos for the authenticated user
3. **Given** user has completed todos, **When** user sends PATCH request to /api/{user_id}/todos/{todo_id}/complete with completed=false, **Then** system updates status to false and filters respond accordingly
4. **Given** user wants to see all todos, **When** user requests /api/{user_id}/todos without status param, **Then** system returns all todos for the user regardless of completion status

---

### Edge Cases

- What happens when a user tries to access another user's todo?
- How does system handle expired JWT tokens during API calls?
- What occurs when user tries to create a todo with an empty title?
- How does system handle very long titles or descriptions?
- What happens when network connectivity is lost during API calls?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate that user email is in valid email format (standard RFC 5322 format) during signup/login
- **FR-002**: System MUST validate that user password is at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, and 1 numeric digit during signup
- **FR-003**: System MUST validate that todo title is between 1-200 characters and not consist solely of whitespace
- **FR-004**: System MUST validate that todo description does not exceed 1000 characters when provided
- **FR-005**: System MUST generate JWT tokens with 7-day expiration upon successful authentication
- **FR-006**: System MUST store JWT tokens in httpOnly, secure, SameSite=strict cookies to prevent XSS and CSRF attacks
- **FR-007**: System MUST verify JWT tokens and user_id claims for all protected API endpoints
- **FR-008**: System MUST return 403 Forbidden when users attempt to access other users' data by validating JWT user_id matches requested resource user_id
- **FR-009**: System MUST associate each todo with the authenticated user ID from the JWT token
- **FR-010**: System MUST provide sorting capability for todo lists by creation date (descending by default) and priority level
- **FR-011**: System MUST allow filtering of todos by completion status (all, pending, completed) via query parameters
- **FR-012**: System MUST provide responsive UI that works on mobile (320px-768px), tablet (768px-1024px), and desktop (1024px+) screen sizes
- **FR-013**: System MUST show appropriate loading states during API operations with skeleton screens or spinners
- **FR-014**: System MUST provide clear success/error feedback for all user actions with appropriate toast notifications or banners
- **FR-015**: System MUST hash passwords using bcrypt with 12 rounds before storing in database
- **FR-016**: System MUST implement rate limiting of 5 attempts per minute on authentication endpoints to prevent brute force attacks
- **FR-017**: System MUST implement proper CORS configuration allowing only the frontend domain to access API endpoints

### Key Entities *(include if feature involves data)*

- **User**: Represents a registered user with email, password hash, name, and authentication details
- **Todo**: Represents a single todo item with title, description, priority, completion status, and user association
- **JWT Token**: Authentication token with expiration, user identity, and security claims

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully register and authenticate within 60 seconds on first attempt
- **SC-002**: System rejects 100% of invalid registration attempts (invalid emails, weak passwords, duplicate emails)
- **SC-003**: System prevents 100% of unauthorized access attempts to other users' data with 403 Forbidden responses
- **SC-004**: Users can create, read, update, and delete todos with average response times under 500ms (local development)
- **SC-005**: Todo lists load with proper user data isolation verified (100% of users see only their own todos)
- **SC-006**: All UI components are responsive and usable on mobile (320px+), tablet, and desktop screen sizes
- **SC-007**: Users receive clear feedback for all actions (success, error, loading states) within 1 second of action
- **SC-008**: Authentication tokens are properly managed with 7-day expiration and secure cookie settings
- **SC-009**: Passwords are securely hashed using bcrypt with 12 rounds before storage (verification test)
- **SC-010**: Rate limiting prevents more than 5 failed authentication attempts per minute per IP address