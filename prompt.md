Create a comprehensive constitution for my Hackathon II Todo App project.

Follow this exact structure:

# Todo App Evolution Constitution
<!-- Hackathon II: From CLI to Cloud-Native AI Systems -->

## Core Principles
I. Spec-Driven Development (NON-NEGOTIABLE) - No manual coding, specs first, Claude Code generates all code
II. Iterative Evolution - 5 phases: Console → Web → AI Chatbot → Local K8s → Cloud
III. Clean Architecture - Separation of concerns, single responsibility, dependency injection
IV. Code Quality Standards - PEP 8, type hints, max 30 lines/function, descriptive names
V. Reusable Intelligence - Claude Code skills/subagents in .claude/, version controlled
VI. Cloud-Native Ready - No hardcoded values, env vars, stateless, health checks, structured logging

## Technology Stack
Phase I: Python 3.13+, UV, in-memory storage, CLI
Phase II: + Next.js 16, FastAPI, SQLModel, Neon PostgreSQL, Better Auth/JWT
Phase III: + OpenAI Agents SDK, MCP SDK, ChatKit, conversations DB
Phase IV: + Docker, Minikube, Helm, kubectl-ai, kagent, Gordon
Phase V: + Kafka/Redpanda, Dapr, Cloud K8s (DOKS/GKE/AKS), GitHub Actions

## Development Workflow
Feature Cycle: Write spec → Claude reviews → Generate code → Test → Iterate on spec if needed
Spec-Kit: /specify → /plan → /tasks → /implement
Commits: <type>(<phase>): <description> (e.g., "feat(phase1): add task creation")
Git: One repo, preserve old phases, tag completions (v1.0-phase1)

## Phase-Specific Guidelines
Phase I: MVC (models.py, todo_manager.py, main.py), validate input, clear menus
Phase II: Monorepo (frontend/, backend/), JWT auth, API in lib/api.ts, .env files
Phase III: MCP server, stateless chat endpoint, persist conversations, ChatKit domain allowlist
Phase IV: Multi-stage Dockerfiles, Helm charts, health endpoints, kubectl-ai for debugging
Phase V: Kafka topics (task-events, reminders), Dapr components, microservices, CI/CD

## Non-Negotiables
- No manual code (spec-driven only)
- No localStorage/sessionStorage
- No hardcoded secrets
- Auth required (Phase II+)
- User data isolation
- No print() in business logic
- Env vars for config
- Health checks
- User-friendly errors

## Testing
Phase I: Manual checklist
Phase II+: Automated tests (pytest, API tests)
All tests from acceptance criteria

## Governance
Constitution = single source of truth
CLAUDE.md = runtime guidance
AGENTS.md = agent behavior
Version traceability required

**Version**: 1.0.0 | **Ratified**: 2025-01-17 | **Last Amended**: 2025-01-17

Make it clear, actionable, and authoritative. Use MUST/SHOULD/MAY. Include examples. 200-300 lines total.