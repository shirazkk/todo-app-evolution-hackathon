# Todo Application Frontend

A modern, responsive todo application built with Next.js 16 and React 19.

## Features

- User authentication (login/signup)
- Todo management (create, read, update, delete)
- Priority tracking
- Responsive design
- Accessibility features
- Loading states and skeletons
- Error boundaries
- Performance optimizations
- Cross-browser compatibility
- Comprehensive logging and error reporting

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Axios for API calls
- Jest for testing

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and update with your API URL
4. Start the development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm test:watch` - Run tests in watch mode
- `npm test:coverage` - Run tests with coverage

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and services
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions