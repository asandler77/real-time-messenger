# Scaffold 015: Client E2E Testing

Type: testing

Status: see `docs/STATUS.md`

## Purpose

Add mobile client E2E coverage for the main user journeys after backend endpoint coverage exists.

This scaffold is for client/mobile UI journeys. It is not backend endpoint testing.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/client-e2e-testing/SKILL.md`
- `.cursor/skills/react-native/SKILL.md`

## Prerequisites

- Scaffold 012 (Basic Testing) — MVP client behavior has minimal automated coverage
- Scaffold 014 (Backend Endpoint E2E Testing) — backend endpoint confidence exists

## Goal

Add a small, reliable mobile E2E smoke suite using Maestro first for Android emulator flows.

The goal is confidence in the user journey from login to chat and history reload, not exhaustive device coverage.

## Done when

- Maestro is set up for the current mobile app test workflow
- Mobile UI exposes stable `testID` values or accessibility labels needed by E2E flows
- A login smoke flow runs on Android
- A send message smoke flow runs on Android
- A history reload smoke flow runs on Android
- Required local backend or mocked backend setup is documented
- Multi-device coverage remains intentionally limited unless the scaffold expands it

## Minimal testing

- Run the Maestro smoke flow on a local Android emulator.
- Verify login, send message, and history reload journeys.
- Verify selectors are stable and not tied to fragile layout details.
- Use a real local backend by default; mock the backend only when intentional and documented.

## Do not

- Do not add backend endpoint assertions through mobile UI flows
- Do not make broad multi-device coverage the first target
- Do not rely on manual emulator testing as the only verification
- Do not add visual regression, performance, or production monitoring checks
- Do not add app features only to support E2E tests
