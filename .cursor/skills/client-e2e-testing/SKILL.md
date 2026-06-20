---
name: client-e2e-testing
description: Guides mobile and client E2E tests. Use when adding Maestro flows, Android emulator checks, mobile user journey tests, login/send/history smoke flows, or client endpoint-style E2E coverage.
---

# Client E2E Testing

Use this project skill only when the active scaffold asks for mobile or client E2E testing. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/react-native-agent.md`
- `.ai/scaffolds/quality/015-client-e2e-testing.md`
- `.ai/workflows/run-client-e2e.md`
- `.cursor/skills/react-native/SKILL.md`

## Do

- Prefer Maestro first for current project mobile E2E flows.
- When asked to run client E2E tests, follow `.ai/workflows/run-client-e2e.md`.
- Keep flows in YAML and make each journey small enough to debug quickly.
- Add stable `testID` values or accessibility labels for controls that E2E flows need.
- Cover login, send message, and history reload smoke flows before broader journeys.
- Keep multi-device or multi-emulator scenarios limited to the smallest useful checks.
- Mock the backend only when the scaffold intentionally asks for a mocked client journey.
- Document any required local backend or emulator setup in the scaffold or README when the scaffold is implemented.

## Quality Checks

- Verify selectors are user-meaningful and stable, not tied to fragile visual layout.
- Keep emulator state deterministic between runs when practical.
- Prefer one reliable smoke path over many flaky flows.
- Confirm E2E checks remain client/mobile UI journeys, not backend endpoint tests.

## Do Not

- Do not add E2E infrastructure before the active scaffold asks for it.
- Do not make manual emulator testing the only verification path.
- Do not test backend endpoint contracts through mobile UI flows.
- Do not add broad multi-device coverage before a single-device smoke flow is stable.
