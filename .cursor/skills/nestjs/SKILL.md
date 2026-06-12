---
name: nestjs
description: Guides NestJS backend module, controller, service, DTO, and test boundaries. Use when a backend scaffold asks for NestJS API, service, auth, WebSocket gateway, persistence, or backend tests.
---

# NestJS

Use this project skill only after the active scaffold includes backend work. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/nestjs-backend-agent.md`
- `.cursor/rules/nestjs-backend-structure.mdc`
- Backend scaffolds such as 002, 004, 006, 010, and 011

## Do

- Keep features grouped by NestJS module.
- Keep controllers thin: routing, status behavior, and request/response boundaries.
- Put validation decisions and business behavior in services or focused helpers.
- Use DTOs for request and response shapes at HTTP or module boundaries.
- Extract providers or helpers when a service starts owning unrelated behavior.

## Quality Checks

- Add unit tests for service behavior when backend logic changes.
- Add integration-style tests for HTTP endpoints or gateway boundaries when contracts change.
- Verify routes, methods, response shapes, and error status codes against the active scaffold.

## Do Not

- Do not add persistence, auth, WebSocket, or infrastructure before the scaffold asks for it.
- Do not place business logic directly in controllers.
- Do not create broad abstractions for one-off scaffold code.
