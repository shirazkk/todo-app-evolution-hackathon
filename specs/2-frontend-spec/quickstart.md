# Quickstart Guide: Frontend for Todo Application

## Setting Up the Frontend Development Environment

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to backend API endpoints
- Git for version control

### Clone and Initialize
```bash
git clone <repository-url>
cd frontend
npm install
```

### Environment Configuration
Create a `.env.local` file with the following:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=supersecret
NEXT_PUBLIC_APP_NAME="Todo Application"
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application

### Running Tests
```bash
npm run test
npm run test:watch
```

### Building for Production
```bash
npm run build
npm run start
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run test`: Run unit tests
- `npm run test:watch`: Run tests in watch mode

### Project Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (admin)/
│   │   ├── admin-login/
│   │   └── admin/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── admin/
│   ├── error/
│   ├── todos/
│   └── ui/
├── lib/
│   ├── api.ts
│   └── types.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useTodos.ts
│   ├── useApiCache.ts
│   └── useErrorHandling.ts
├── middleware.ts
└── public/
```

### Key Dependencies
- Next.js 16+ with App Router
- React 19+
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query (TanStack Query)
- Zod for validation
- Axios for HTTP requests

### First Steps
1. Start the backend server
2. Configure your environment variables
3. Run `npm run dev` to start the frontend
4. Navigate to the signup page to create an account
5. Begin using the todo management features