# Scaffold 013: Push Notifications

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Use push notifications as an offline or background alert for new messages, then let WebSocket handle the live conversation once the app opens.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/websocket-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/push-notifications/SKILL.md`
- `.cursor/skills/react-native/SKILL.md`
- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`

## Prerequisites

- Scaffold 010 (Message Persistence) — message history is the source of truth
- Scaffold 011 (Security Basics) — protected backend and authenticated mobile state exist
- Scaffold 012 (Basic Testing) — MVP chat behavior has minimal automated coverage

## Goal

Add Android-first push notifications for MVP chat continuation.

Push should alert offline or background recipients that a new message exists. It should not replace WebSocket for real-time delivery or message history for durable state.

## Technology Notes

- Prefer Firebase Cloud Messaging with the HTTP v1 API or a server SDK.
- Request Android 13 `POST_NOTIFICATIONS` permission at runtime before registering for notifications.
- Register and refresh device tokens after authentication, then send the active token to the backend.
- Store user-device token bindings on the backend and update them when tokens rotate.
- Persist the message before dispatching push so history remains idempotent and authoritative.
- Keep sensitive message content out of notification payloads unless explicitly chosen.
- Tapping a notification should open the chat and reload message history before WebSocket resumes live updates.

## Done when

- Mobile requests notification permission and handles denial gracefully
- Mobile registers or refreshes a device token after auth
- Mobile sends the current device token to a protected backend endpoint
- Backend stores or updates the authenticated user's device token
- Backend sends push for offline or background recipients after message persistence
- Notification tap opens the chat and loads message history
- WebSocket remains the real-time path after the app opens
- Tests cover token registration and the push dispatch boundary

## Minimal testing

- Test mobile permission denial, token registration, token refresh, and protected token submission with mocked notification services.
- Test backend token registration with a valid JWT and update behavior for an existing device token.
- Test message persistence happens before the push dispatch boundary is called.
- Mock the FCM boundary in backend tests; do not require real Firebase credentials.
- Test notification tap routing by verifying chat/history reload behavior with mocked navigation inputs.

## Do not

- Do not use push notifications as the source of truth for messages
- Do not send push before the message is persisted
- Do not expose JWTs, credentials, or sensitive message content in payloads or logs
- Do not require real FCM credentials in automated tests
- Do not add iOS push support before Android-first behavior is working
- Do not add rooms, private conversations, unread counts, reactions, or notification preferences
