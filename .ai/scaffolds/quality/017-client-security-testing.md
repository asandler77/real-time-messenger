# Scaffold 017: Client Security Testing

Type: security testing

Status: see `docs/STATUS.md`

## Purpose

Add mobile client security checks for token storage, session handling, unauthorized errors, notification privacy, and app lifecycle behavior.

This scaffold is not real attacker tooling and does not include secret extraction.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/client-security-testing/SKILL.md`
- `.cursor/skills/react-native/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`
- `.cursor/skills/push-notifications/SKILL.md`

## Prerequisites

- Scaffold 011 (Security Basics) — mobile token storage boundary exists
- Scaffold 013 (Push Notifications) — notification behavior is the current post-MVP direction
- Scaffold 015 (Client E2E Testing) — mobile journey harness exists

## Goal

Add focused client-side security checks around observable mobile behavior and local app boundaries.

The goal is to catch token exposure, fragile session handling, and privacy regressions without reverse engineering or extracting secrets.

## Done when

- Token storage helper behavior is covered at the local app boundary
- JWT values are not shown in UI, snapshots, logs, or error messages
- Unauthorized and expired-session responses are handled consistently
- App background, foreground, and restart behavior is checked for session handling
- Notification permission denial remains safe and non-blocking
- Notification tap and payload privacy are checked when push behavior is in scope
- Tests avoid production credentials, secret extraction, and external services

## Minimal testing

- Run client security tests locally.
- Verify token storage helper behavior with mocked platform storage where appropriate.
- Verify unauthorized API or socket responses do not expose JWT values.
- Verify app restart or background behavior matches the chosen session rules.
- Verify notification payload and tap behavior do not expose private content when notifications are in scope.

## Do not

- Do not reverse engineer the app beyond local test scope
- Do not extract secrets, tokens, keystore material, or device credentials
- Do not require production services, production data, or real credentials
- Do not add real attacker tooling
- Do not add notification security checks before notification behavior is relevant
