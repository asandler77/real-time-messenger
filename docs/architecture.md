# Architecture

This document describes the architecture that exists today. See `docs/STATUS.md` for the current scaffold status.

The workspace has one NestJS backend application in `apps/backend` and one React Native mobile client in `apps/mobile`. The app is an MVP shared broadcast chat with locally persisted recent message history, JWT auth, and Android-first push alerts.

## Backend HTTP

The backend exposes the following HTTP endpoints:

```text
GET  /
POST /auth/login
GET  /messages/recent   (protected)
POST /push/device-token (protected)
```

- `GET /` returns a health response: `{ "message": "Backend is running" }`.
- `POST /auth/login` is the demo login. Credentials are `demo` / `demo`. A successful request returns a JWT access token and token type (`{ "accessToken": "<jwt>", "tokenType": "Bearer" }`).
- `GET /messages/recent` returns recent persisted chat history (`{ "messages": [...] }`). It is protected by `JwtAuthGuard` and requires a valid `Authorization: Bearer <jwt>` header.
- `POST /push/device-token` registers an authenticated device token for push delivery. It is protected by `JwtAuthGuard` and binds the token to the authenticated user.

Modules: `AuthModule` (login, JWT config, guard), `RealtimeModule` (gateway, message history, recent endpoint), and `PushModule` (device token store, connected-user tracking, push dispatch).

## Real-Time Messaging

The backend has an authenticated WebSocket gateway (`RealtimeModule`) for the MVP chat flow. The mobile app logs in, uses the JWT to connect, sends chat messages, and receives broadcast messages in the chat UI.

- Connections are authenticated in gateway middleware; unauthenticated clients are rejected.
- Incoming messages are validated (non-empty text within a max length) before they are accepted.
- Each accepted message is persisted, broadcast to all connected clients, and then triggers a push alert for offline recipients.

## Message Persistence

Broadcast messages are saved to local backend file storage (`MessageHistoryService`, backed by a JSON file under `apps/backend/var/`). The mobile chat loads recent history through the protected `GET /messages/recent` endpoint on login and after a notification tap, then lets the WebSocket connection resume live updates.

## Push Notifications

Push is Android-first and treated as an alert that a new message exists, not as message state.

- Device tokens are stored server-side per authenticated user (`DeviceTokenStoreService`).
- A connected-user tracker records which users have an active socket.
- After a message is persisted and broadcast, `PushNotificationService` dispatches alerts to recipients that are not currently connected.
- The transport is a no-op transport boundary (`NoopPushTransport`); no real FCM credentials are required for local development or tests.

## Mobile

The mobile client includes the login and chat screens for the broadcast chat flow and can run on the Android emulator from the CLI.

- Login posts to `/auth/login`, stores the JWT through a session storage boundary, and navigates into the chat flow.
- The chat screen connects the authenticated socket, loads recent history, sends messages, and renders incoming broadcasts.
- After login the app registers for push notifications, handles permission denial without blocking chat, and reloads history on notification tap.

## Testing

- Backend: Jest unit and spec tests across auth, realtime, and push, plus endpoint/E2E and penetration spec coverage.
- Mobile: Jest unit/integration tests for auth, messages, socket, session storage, and push handling.
- Client E2E: a Maestro Android smoke flow at `apps/mobile/.maestro/client-smoke.yaml`, run via `npm run e2e:maestro`. See `.ai/workflows/run-client-e2e.md`.
