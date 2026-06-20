---
name: backend-penetration-testing
description: Guides safe local backend penetration and security tests. Use when adding backend security coverage for auth, JWT, protected HTTP endpoints, WebSocket auth, validation, malformed payloads, or abuse checks.
---

# Backend Penetration Testing

Use this project skill only when the active scaffold asks for backend penetration or security tests. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/nestjs-backend-agent.md`
- `.ai/agents/websocket-agent.md`
- `.ai/scaffolds/quality/016-backend-penetration-testing.md`
- `.cursor/skills/jwt-auth/SKILL.md`
- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`

## Do

- Keep tests safe, local, and scoped to the repository app.
- Focus on unauthorized access, token tampering, expired tokens, and protected route behavior.
- Test WebSocket auth rejection for missing, malformed, invalid, or expired JWTs.
- Test empty, overlong, malformed, or unexpected message payloads.
- Check that invalid payloads are not persisted or broadcast.
- Add simple rate or abuse checks only when the active scaffold includes that behavior.
- Use explicit local fixtures and fake tokens; do not read credentials or environment secrets.

## Quality Checks

- Verify tests are deterministic and do not attack external services.
- Assert expected security responses without leaking token material.
- Keep destructive, load-heavy, or network scanning behavior out of automated tests.
- Make persistence abuse checks isolate their local test data.

## Do Not

- Do not run external scanners or network tests without explicit user approval.
- Do not perform destructive tests, denial-of-service tests, or credential attacks.
- Do not read `.env`, SSH keys, tokens, or credentials.
- Do not add real attacker tooling before the scaffold explicitly asks for it.
