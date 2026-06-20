---
name: backend-endpoint-testing
description: Guides backend HTTP/API and WebSocket E2E tests. Use when adding NestJS endpoint tests with supertest, socket.io-client, auth endpoints, protected endpoints, WebSocket flows, or persistence history endpoint coverage.
---

# Backend Endpoint Testing

Use this project skill only when the active scaffold asks for backend HTTP/API or WebSocket E2E tests. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/nestjs-backend-agent.md`
- `.ai/agents/websocket-agent.md`
- `.ai/scaffolds/quality/014-backend-endpoint-e2e-testing.md`
- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`

## Do

- Test real NestJS module boundaries instead of isolated controller-only behavior.
- Use `supertest` for HTTP endpoint contracts and `socket.io-client` for gateway behavior.
- Cover auth endpoints, protected endpoints, and the message history endpoint.
- Test valid JWT, missing JWT, malformed JWT, and invalid JWT behavior where the route is protected.
- Assert request and response shapes, status codes, and stable error bodies.
- Cover the Alice/Bob WebSocket flow with authenticated clients sending and receiving messages.
- Isolate persistence fixtures so history tests do not depend on prior test order.

## Quality Checks

- Keep endpoint tests focused on externally observable API or gateway behavior.
- Prefer in-memory or local test fixtures over production-like services.
- Verify test setup does not require real credentials, external networks, or production infrastructure.
- Reset app state, sockets, and persistence between tests.

## Do Not

- Do not add production services or infrastructure only for tests.
- Do not depend on test execution order.
- Do not expose JWTs or secrets in snapshots, logs, or docs.
- Do not turn backend endpoint tests into mobile UI E2E tests.
