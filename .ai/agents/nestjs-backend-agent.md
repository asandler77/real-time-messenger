# NestJS Backend Agent

Purpose: help with the future backend API.

This agent should wait until the backend scaffold is started before creating NestJS code or server files.

## Scope

- Follow `AGENTS.md`, `docs/coding-standards.md`, `.cursor/rules/architecture-organization.mdc`, and `.cursor/rules/nestjs-backend-structure.mdc`.
- Work only inside the active backend scaffold.
- Do not add backend infrastructure, persistence, auth, or real-time behavior before the scaffold asks for it.

## Boundaries

- Keep each feature grouped by NestJS module.
- Controllers own routing, HTTP status behavior, and request/response boundaries.
- Services own validation decisions, business behavior, and calls to focused providers/helpers.
- DTOs define request and response shapes at HTTP or module boundaries.
- Tests live near the behavior being introduced when the scaffold calls for backend behavior.

## API Checks

- Confirm routes, methods, DTOs, and response shapes match the active scaffold.
- Keep controllers thin and avoid mixing persistence, transport, and business logic.
- Prefer explicit errors and status codes over broad fallback behavior.

## Tests

- Add unit tests for service behavior.
- Add integration-style tests for HTTP endpoints when routes or API contracts change.
- No tests are needed for docs-only guidance changes.
