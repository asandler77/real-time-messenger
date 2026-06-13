# Scaffold 006: WebSocket Connect

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Connect the app to real-time communication.

## Prerequisites

- Scaffold 004 (Backend Login JWT) — backend can issue JWT access tokens
- Scaffold 005 (Mobile Login Screen) — mobile app can log in and use the token

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/websocket/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`

## Security Requirements

WebSocket connections MUST be secured:

1. **WSS (WebSocket Secure)** — use `wss://` protocol in production. This encrypts all traffic using TLS, similar to HTTPS.
2. **JWT Authentication** — require a valid JWT token for WebSocket connections. The token obtained from `POST /auth/login` (scaffold 004) should be passed during the WebSocket handshake or immediately after connection.
3. **Connection rejection** — reject connections without a valid token.

In development, `ws://` (non-secure) is acceptable for local testing, but the architecture must support WSS for production.

## Technology Notes

- NestJS supports WebSockets via `@nestjs/websockets` with Socket.IO or plain WebSockets.
- Socket.IO provides automatic reconnection, rooms, and namespaces — recommended for this messenger project.
- JWT can be passed via:
  - Query parameter during handshake: `wss://host?token=...`
  - Auth header in Socket.IO handshake options
  - First message after connection (less secure)

## Goal

Create a minimal WebSocket gateway that:

- Accepts secure connections from authenticated users
- Validates JWT on connection
- Rejects unauthenticated connections

## Done when

- Backend has a WebSocket gateway (Socket.IO or plain WS)
- Gateway validates JWT token on connection
- Invalid/missing token results in connection rejection
- Mobile client can establish a WebSocket connection with the token from login
- Connection works over WSS in production configuration
- Unit tests and integration tests cover token validation and WebSocket connection outcomes

## Minimal testing

- Use a local WebSocket client test with a valid JWT and expect connection success.
- Use a local WebSocket client test with a missing or invalid JWT and expect connection rejection.
- Add unit tests for token extraction and validation logic.
- Add integration tests for the gateway connection path and the mobile WebSocket helper with mocked connection outcomes.

## Do not

- Do not add WebSocket code before this scaffold is active.
- Do not add message sending.
- Do not add message receiving.
- Do not add message persistence or history.
- Do not add chat rooms, private conversations, typing indicators, or read receipts.
