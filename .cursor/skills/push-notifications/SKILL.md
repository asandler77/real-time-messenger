---
name: push-notifications
description: Guides Android-first push notification work. Use when a scaffold asks for push notifications, FCM, device tokens, notification permissions, or background alerts.
---

# Push Notifications

Use this project skill only when the active scaffold includes push notification work. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/nestjs-backend-agent.md`
- `.ai/agents/react-native-agent.md`
- `.ai/agents/websocket-agent.md`
- `.ai/scaffolds/features/013-push-notifications.md`

## Do

- Use Firebase Cloud Messaging for Android push delivery.
- Register and refresh the device token after authentication.
- Bind each device token to the authenticated backend user.
- Store device tokens server-side and update them when they rotate.
- Treat push as an alert that a new message exists, not as message state.
- Persist messages before dispatching push.
- Keep notification payloads free of sensitive content unless explicitly chosen.
- Handle notification permission denial without blocking the chat flow.
- Open the chat from notification taps, reload message history, then let WebSocket resume live updates.

## Quality Checks

- Test token registration and refresh with mocked mobile notification services.
- Test protected backend token registration with a valid JWT.
- Test that message persistence happens before the push dispatch boundary.
- Mock the FCM boundary; do not require real Firebase credentials in automated tests.

## Do Not

- Do not use notification payloads as the source of truth for chat messages.
- Do not log JWTs, FCM tokens, credentials, or sensitive message payloads.
- Do not make push delivery required for live in-app chat.
- Do not add iOS push, notification preferences, unread counts, rooms, or private conversations before the scaffold asks for them.
