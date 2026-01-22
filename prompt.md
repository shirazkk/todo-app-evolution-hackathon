

Context:
- The backend is already fully implemented and stable.
- The frontend will be built using Next.js.
- The goal is to connect the frontend with the existing backend APIs.


Your task:
Generate a complete FRONTEND SPECIFICATION 

Scope of frontend features:
1. Authentication
   - Login component
   - Signup component
   - Proper form validation
   - Secure handling of auth tokens / sessions /cokkies 
   - Error and loading states

2. Todos
   - Create, read, update, delete todos UI 
   - UI components for todo list and todo items
   - State management and  API call from backend 
   - skelton, loading, and error states 

3. Admin Dashboard
   - View all users
   - View users’ todos
   - Admin-only access control
   - Clear separation between admin and normal user UI

Requirements:
- Use Next.js best practices (App Router if applicable)
- Clearly define:
  - Page structure
  - Component structure
  - Data flow between frontend and backend
  - API integration strategy
  - Auth and role-based access handling
- Assume backend APIs already exist; do NOT redesign the backend.
- Do NOT write implementation code yet.

Agent Reference:
- When reasoning about Next.js architecture, patterns, and frontend best practices, use the Claude Code subagent **"nextjs-dev-agent"** in .claude/agents folder

Output format:
1. Frontend Specification (high-level behavior and rules)
2. Architecture & Folder Structure


Rules:
- Be explicit and unambiguous.
- Prefer clarity over brevity.
- Do not make assumptions beyond the given scope.
- This output will be used as the single source of truth for frontend specs 