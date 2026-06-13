# Scaffold 009: Error Management

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Add simple and understandable error handling for the MVP broadcast chat.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/websocket-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/react-native/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`

## Prerequisites

- Scaffold 005 (Mobile Login Screen) — user can log in and see login errors
- Scaffold 006 (WebSocket Connect) — app can connect to WebSocket
- Scaffold 007 (Send Message) — messages can be sent
- Scaffold 008 (Receive Message) — messages can be received

## Goal

Make the main MVP flow easier to understand when something goes wrong.

The app should show clear errors for login, backend availability, WebSocket connection, and message sending.

## Done when

- Backend returns consistent error responses for known MVP errors
- Mobile app shows a clear error when login fails
- Mobile app shows a clear error when the backend is unavailable
- Mobile app shows connection status or an error when WebSocket is disconnected
- Mobile app prevents sending messages while disconnected
- Mobile app shows a simple error when message sending fails
- Errors are written in simple user-facing language
- Unit tests and integration tests cover backend errors and mobile error states

## Minimal testing

- Send HTTP requests that trigger known backend errors and verify consistent error responses.
- Use WebSocket client tests to verify disconnected or rejected connection handling.
- Run mobile unit tests for login error, backend unavailable error, disconnected state, disabled send button, and send failure message.
- Add integration tests for service/controller/gateway error paths and mobile API/helper error mapping.

## Do not

- Do not add advanced logging services
- Do not add monitoring dashboards
- Do not add crash reporting
- Do not add retry queues
- Do not add offline mode
- Do not add message persistence
- Do not redesign the UI beyond simple error messages
