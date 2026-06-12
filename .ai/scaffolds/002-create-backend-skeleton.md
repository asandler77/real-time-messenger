# Scaffold 002: Create Backend Skeleton

Purpose: later create the first backend project structure.

Do not run this scaffold until Scaffold 001 is complete and the user asks to continue.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`
- Useful skill: `.cursor/skills/nestjs/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

Goal: create a minimal backend that can start locally and answer one simple HTTP request.

Done when:

- The backend project structure exists.
- The backend has a minimal health or hello endpoint.
- The backend can be started with a documented command.
- A local HTTP request receives a small text or JSON response from the backend.
- A minimal unit test and a minimal integration test are created for the starter backend.

Example expected check:

```bash
curl http://localhost:3000/
```

Automated testing should cover the health or hello endpoint with a unit test and a minimal HTTP integration test.

Example expected response:

```json
{ "message": "Backend is running" }
```

Do not add login, JWT, database, WebSocket, message sending, message receiving, Docker, Redis, or mobile UI in this scaffold.
