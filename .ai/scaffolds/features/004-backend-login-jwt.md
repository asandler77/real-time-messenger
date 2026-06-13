# Scaffold 004: Backend Login JWT

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Add simple backend login with JWT.

## Prerequisites

- Scaffold 002 (Create Backend Skeleton) is complete.
- This scaffold is active.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`

## Goal

Create a minimal backend login endpoint that returns a JWT for demo credentials.

## Done when

- The backend has a minimal `POST /auth/login` endpoint.
- The endpoint accepts a username and password in JSON.
- Valid demo credentials return a JWT access token.
- Invalid credentials return an unauthorized response.
- The login endpoint can be checked with a documented local command.
- Unit tests and integration tests cover successful and failed login.

## Minimal testing

- Send `POST /auth/login` with valid demo credentials and expect a JWT access token.
- Send `POST /auth/login` with invalid credentials and expect an unauthorized response.
- Add unit tests for login validation and integration tests for the HTTP endpoint.

Demo credentials:

```text
username: demo
password: demo
```

## Do not

- Do not add authentication code before this scaffold is active.
- Do not add registration, password storage, database, roles, refresh tokens, mobile login UI, WebSocket, message sending, or message receiving.
