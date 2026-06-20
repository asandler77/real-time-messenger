---
name: client-security-testing
description: Guides mobile and client security tests. Use when adding checks for token storage boundaries, session handling, unauthorized errors, notification payload privacy, app restart/background behavior, or secure client flows.
---

# Client Security Testing

Use this project skill only when the active scaffold asks for mobile or client security testing. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/react-native-agent.md`
- `.ai/scaffolds/quality/017-client-security-testing.md`
- `.cursor/skills/react-native/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`
- `.cursor/skills/push-notifications/SKILL.md`

## Do

- Test the token storage boundary through the app's secure storage helper or session service.
- Verify JWT values are not shown in UI, snapshots, logs, or error messages.
- Cover unauthorized and expired-session handling from mocked API or socket responses.
- Check app background, foreground, and restart behavior for session continuity or sign-out decisions.
- Test notification permission denial and notification tap privacy when push notifications are in scope.
- Keep tests within the local app and documented test surfaces.

## Quality Checks

- Prefer unit or integration-style checks for storage/session helpers before emulator-only flows.
- Mock platform storage and notification boundaries unless the active scaffold asks for device behavior.
- Confirm privacy assertions check observable app behavior, not implementation guesses.
- Keep security tests aligned with the current shipped client behavior.

## Do Not

- Do not reverse engineer the app beyond local test scope.
- Do not extract secrets, tokens, keystore material, or device credentials.
- Do not require production credentials or external services.
- Do not add notification security checks before notifications are relevant to the active scaffold.
