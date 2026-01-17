<!-- SYNC IMPACT REPORT
Version change: N/A → 1.0.0
Modified principles: None (new constitution)
Added sections: All sections
Removed sections: None
Templates requiring updates: ✅ updated - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Todo App Evolution Constitution
<!-- Hackathon II: From CLI to Cloud-Native AI Systems -->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
No manual coding, specs first, Claude Code generates all code. All implementations must originate from specifications that are reviewed and validated before code generation.
<!-- Rationale: Ensures consistent, predictable development process and enables AI-assisted development -->

### II. Iterative Evolution
5 phases: Console → Web → AI Chatbot → Local K8s → Cloud. Each phase builds upon the previous one while maintaining backward compatibility where possible.
<!-- Rationale: Enables progressive complexity addition while preserving working functionality -->

### III. Clean Architecture
Separation of concerns, single responsibility, dependency injection. Business logic must be isolated from presentation and infrastructure layers.
<!-- Rationale: Maintains code quality and testability across all phases of development -->

### IV. Code Quality Standards
PEP 8, type hints, max 30 lines/function, descriptive names. All code must follow established Python standards and maintain high readability.
<!-- Rationale: Ensures maintainability and reduces cognitive load for developers -->

### V. Reusable Intelligence
Claude Code skills/subagents in .claude/, version controlled. All AI-generated components must be stored in version control for reproducibility.
<!-- Rationale: Creates institutional knowledge and enables reuse across projects -->

### VI. Cloud-Native Ready
No hardcoded values, env vars, stateless, health checks, structured logging. Applications must be deployable in containerized environments from the start.
<!-- Rationale: Enables seamless evolution to cloud deployments in later phases -->

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
