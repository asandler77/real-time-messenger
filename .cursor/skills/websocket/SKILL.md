---
name: websocket
description: Guides authenticated WebSocket gateway, client, event payload, connection state, and socket test boundaries. Use when a scaffold asks for WebSocket connection, send/receive messaging, or real-time errors.
---

# WebSocket

Use this project skill only when the active scaffold includes WebSocket work. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/websocket-agent.md`
- `.ai/agents/nestjs-backend-agent.md`
- `.ai/agents/react-native-agent.md`
- WebSocket scaffolds such as 006, 007, 008, and 009

## Do

- Keep backend gateway, auth validation, event payload types, and message handling in focused files.
- Keep mobile socket connection logic in a service or hook, not inside presentation components.
- Define event names and payload shapes once per boundary and keep backend/mobile expectations aligned.
- Support secure production configuration while allowing local development settings during scaffolds.
- Handle connect, disconnect, and auth failure states explicitly.

## Quality Checks

- Test successful connection with a valid token.
- Test rejection for missing or invalid token.
- Test emitted and received event behavior at the gateway/client boundary when the scaffold adds events.
- Mock mobile socket outcomes for client-side unit or integration-style tests.

## Do Not

- Do not add WebSocket code before Scaffold 006.
- Do not add send or receive message behavior before the matching scaffold.
- Do not introduce rooms, private conversations, typing indicators, read receipts, or persistence early.
