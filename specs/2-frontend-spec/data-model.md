# Data Model: Frontend for Todo Application

## Entity Definitions

### User Entity
- **id**: string (unique identifier, UUID format)
- **email**: string (valid email format, unique)
- **username**: string (unique, 3-30 alphanumeric characters plus underscores/hyphens)
- **role**: 'user' | 'admin' (enum, default: 'user')
- **createdAt**: Date (timestamp, ISO 8601 format)
- **updatedAt**: Date (timestamp, ISO 8601 format)

### Todo Entity
- **id**: string (unique identifier, UUID format)
- **title**: string (required, 1-255 characters)
- **description**: string (optional, 0-1000 characters)
- **completed**: boolean (default: false)
- **ownerId**: string (foreign key to User.id)
- **createdAt**: Date (timestamp, ISO 8601 format)
- **updatedAt**: Date (timestamp, ISO 8601 format)

### Validation Rules

#### User Validation
- Email must conform to valid email format (zod.email())
- Username must be 3-30 characters (zod.string().min(3).max(30))
- Username must contain only alphanumeric characters, underscores, and hyphens (zod.string().regex(/^[a-zA-Z0-9_-]+$/))
- Role must be either 'user' or 'admin' (zod.enum(['user', 'admin']))

#### Todo Validation
- Title must be 1-255 characters (zod.string().min(1).max(255))
- Description must be 0-1000 characters (zod.string().max(1000).optional())
- Completed must be boolean (zod.boolean())

### State Transitions

#### Todo State Transitions
- **Pending** → **Completed**: When user marks todo as complete
- **Completed** → **Pending**: When user marks todo as incomplete

### Relationships
- **User** (1) ←→ (Many) **Todo**: One user can own many todos
- Foreign key: Todo.ownerId references User.id

### Data Lifecycle

#### User Lifecycle
1. User registers → User.created
2. User updates profile → User.updated
3. User account deactivated → User.status = inactive (soft delete)

#### Todo Lifecycle
1. User creates todo → Todo.created
2. User modifies todo → Todo.updated
3. User deletes todo → Todo.deleted (soft delete)

### Indexes
- User.email (unique index for authentication)
- User.username (unique index for identification)
- Todo.ownerId (index for efficient querying by user)
- Todo.createdAt (index for chronological sorting)

### Security Considerations
- User emails are case-insensitive but stored in normalized form
- Todo access is restricted to owner and admin users
- Admin users can view all todos but cannot modify them