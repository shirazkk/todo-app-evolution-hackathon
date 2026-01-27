**PROJECT REQUIREMENTS - FRONTEND IMPLEMENTATION**

**Tech Stack & Skills:**
- Use `frontend-design-skill` for creating modern, responsive UI components
- Use `nextjs-dev-skill` for Next.js implementation
- Framework: Next.js with App Router
- Styling: Tailwind CSS (or your preferred styling solution)

---

**1. HOMEPAGE STRUCTURE**

**Navbar:**
- Left side: Company logo
- Right side: 
  - If user NOT logged in: Display "Get Started" and "Sign Up" buttons
  - If user IS logged in: Display user profile avatar with dropdown menu
    - Dropdown should include: "View Profile" and "Logout" options

**Hero Section:**
- Compelling headline and call-to-action
- Brief description of the application

**About/Features Section:**
- Showcase todo management features and benefits

**Footer:**
- Standard footer with links, copyright, and relevant information

---

**2. AUTHENTICATION FLOW**

**Sign Up Process:**
- Create a signup form collecting: email and password
- On form submission:
  - Send POST request to FastAPI backend (`/api/auth/signup`) with email and password
  - Backend saves user to database and returns: `user_id`, `access_token`, and `token_expiry`
  - Frontend saves `access_token` and `token_expiry` to **localStorage**
  - Automatically redirect user to Dashboard after successful signup

**Login Process:**
- Create a login form collecting: email and password
- On form submission:
  - Send POST request to FastAPI backend (`/api/auth/login`)
  - Backend returns: `user_id`, `access_token`, and `token_expiry`
  - Frontend saves `access_token` and `token_expiry` to **localStorage**
  - Redirect user to Dashboard

**Auto Logout:**
- Implement token expiry check on protected routes
- When `access_token` expires, automatically log out user and redirect to login page
- Clear localStorage on logout

---

**3. DASHBOARD (PROTECTED ROUTE)**

**Route Protection:**
- Dashboard route: `/dashboard`
- Implement middleware/layout to check if user is authenticated (validate `access_token` in localStorage)
- If NOT authenticated: Redirect to `/login` page
- If authenticated: Allow access to Dashboard

**Dashboard Features:**
- Display user's todos in an organized, visually appealing layout
- Implement full CRUD operations for todos:
  - **Create:** Form to add new todo (send `user_id` + todo data to backend)
  - **Read:** Display all user's todos (fetch using `user_id` from backend)
  - **Update:** Edit existing todos (send `user_id` + `todo_id` + updated data)
  - **Delete:** Remove todos (send `user_id` + `todo_id`)
  - **Toggle Completion:** Checkbox or toggle button to mark todo as complete/incomplete (send user_id + todo_id to toggle status)

**API Integration:**
- All todo operations should send `user_id` along with the request to FastAPI backend
- Endpoints expected:
  - `POST /api/todos` - Create todo
  - `GET /api/todos?user_id={user_id}` - Get all user todos
  - `PUT /api/todos/{todo_id}` - Update todo
  - `DELETE /api/todos/{todo_id}` - Delete todo
  - `PATCH /api/todos/{todo_id}/toggle_completion` - Toggle todo completion status (completed ↔ not completed)

**Todo Display:**
- Visually differentiate completed vs incomplete todos (e.g., strikethrough text, different colors, opacity)
- Include a checkbox or toggle switch for quick completion status changes
- Show completion status clearly (e.g., checkmark icon, color indicator)

---

**4. ADDITIONAL PAGES**

**Login Page:** `/login`
- Email and password form
- Link to signup page for new users

**Profile Page:** `/profile` (optional, protected)
- Display user information
- Allow viewing/editing profile details

---

**IMPORTANT IMPLEMENTATION NOTES:**

1. **Use localStorage** for storing authentication tokens (access_token and token_expiry)
2. **Create reusable components** for navbar, forms, todo cards, etc.
3. **Implement proper error handling** for API calls with user-friendly error messages
4. **Add loading states** for async operations
5. **Make the UI responsive** for mobile, tablet, and desktop
6. **Use modern design principles**: clean layout, proper spacing, intuitive UX
7. **Validate forms** on the frontend before sending to backend

