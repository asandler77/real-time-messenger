# Scaffold 010: Message Persistence

Purpose: save broadcast chat messages so the MVP keeps message history after restart.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/websocket-agent.md`
- Useful skills: `.cursor/skills/nestjs/SKILL.md`, `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/websocket/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Prerequisites

- Scaffold 007 (Send Message) — messages can be sent through WebSocket
- Scaffold 008 (Receive Message) — messages can be displayed in the chat UI
- Scaffold 009 (Error Management) — basic errors are shown to the user

## Goal

Persist messages from the broadcast chat and load recent message history when the app opens.

This scaffold keeps the MVP as one shared broadcast chat. It does not introduce rooms or private conversations.

## Done when

- Backend saves each valid broadcast message
- Backend exposes a simple way to load recent message history
- Mobile app loads recent messages after login or WebSocket connection
- Mobile app displays loaded messages in the chat UI
- New messages still arrive in real time through WebSocket
- Messages include text, sender information, and timestamp
- Message history survives backend restart
- Unit tests and integration tests cover saving messages and loading history

## Minimal testing

- Use HTTP/API integration tests to save or seed messages and load recent message history with a valid JWT.
- Use a WebSocket integration test to send a new message and verify it is persisted and broadcast.
- Run backend unit tests for message validation and persistence service behavior.
- Run mobile unit tests for history loading state, rendering persisted messages, and appending real-time messages.
- Add an integration-style mobile API/helper test that maps history responses into chat state.

## Do not

- Do not add chat rooms
- Do not add private conversations
- Do not add unread counts
- Do not add message search
- Do not add file or image attachments
- Do not add message editing or deletion
- Do not add complex pagination unless needed for the minimal history check
