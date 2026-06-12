---
name: jwt-auth
description: Guides JWT login, token issuing, token validation, mobile token handling, and auth tests. Use when a scaffold asks for backend login, protected access, authenticated sockets, or mobile token storage.
---

# JWT Auth

Use this project skill only when the active scaffold includes JWT authentication or token handling. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/nestjs-backend-agent.md`
- `.ai/agents/react-native-agent.md`
- Auth-related scaffolds such as 004, 005, 006, and 011

## Do

- Keep token issuing and token validation in clear backend boundaries.
- Use stable JWT payload fields such as `sub` and `username` when the scaffold needs user identity.
- Keep mobile token usage behind a small service, hook, or state boundary instead of scattering token handling through UI.
- Return simple unauthorized or validation errors that match the active scaffold.
- Keep secrets configurable and out of source-controlled examples.

## Quality Checks

- Test valid credentials and invalid credentials.
- Test protected backend behavior with a valid token, missing token, and invalid token when the scaffold adds protected access.
- Test mobile auth flows with mocked API responses and token storage or state boundaries.

## Do Not

- Do not add registration, refresh tokens, roles, password reset, or password persistence before the scaffold asks for them.
- Do not hardcode production secrets in code.
- Do not expose JWT values in logs, docs, snapshots, or error messages.
