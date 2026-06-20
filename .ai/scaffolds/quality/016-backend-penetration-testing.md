# Scaffold 016: Backend Penetration Testing

Type: security testing

Status: see `docs/STATUS.md`

## Purpose

Add a safe local backend security test suite for auth, protected HTTP endpoints, WebSocket auth, validation, and malformed payloads.

This scaffold is not an external or destructive penetration test.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/websocket-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/backend-penetration-testing/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`
- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`

## Prerequisites

- Scaffold 011 (Security Basics) — auth and validation boundaries exist
- Scaffold 014 (Backend Endpoint E2E Testing) — endpoint and gateway E2E harness exists

## Goal

Add deterministic local tests that exercise obvious backend security failure paths without attacking external systems.

The goal is practical security confidence for the current MVP and post-MVP backend boundaries, not comprehensive adversarial testing.

## Done when

- Protected HTTP endpoints reject unauthorized access consistently
- JWT tampering, malformed tokens, and expired tokens are covered where supported
- WebSocket auth rejects missing, malformed, invalid, or expired tokens
- Empty, overlong, malformed, or unexpected message payloads are rejected
- Invalid payloads are not persisted or broadcast
- Persistence abuse checks use isolated local fixtures
- Simple rate or abuse checks are covered only if the app has that behavior in scope

## Minimal testing

- Run the backend security test suite locally.
- Verify unauthorized HTTP and WebSocket access is rejected.
- Verify token tampering and expired-token cases return safe errors.
- Verify malformed message payloads fail without persistence or broadcast.
- Verify no test reads credentials, calls external services, or performs destructive actions.

## Do not

- Do not run external scanners or network attacks without explicit user approval
- Do not perform destructive tests, denial-of-service tests, or credential attacks
- Do not read `.env`, SSH keys, tokens, or credentials
- Do not require production services, production data, or real secrets
- Do not add real attacker tooling before a scaffold explicitly asks for it
