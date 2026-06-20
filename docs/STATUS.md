# Project Status

This file is the single source of truth for scaffold progress. Update it when a scaffold is completed, reopened, or when the next active scaffold changes.

## Current Position

- Last completed scaffold: Scaffold 017, Client Security Testing
- Current active scaffold: Complete
- Next scaffold after current: none

## Implemented So Far

- Scaffold 001, Create Workspace: initial repository and guidance structure.
- Scaffold 002, Create Backend Skeleton: minimal NestJS backend with root health response.
- Scaffold 003, Create Mobile Skeleton: minimal React Native mobile app.
- Scaffold 004, Backend Login JWT: demo `POST /auth/login` flow that issues JWT access tokens.
- Scaffold 005, Mobile Login Screen: mobile login UI, API helper, token handling, and navigation into the chat flow.
- Scaffold 006, WebSocket Connect: authenticated real-time connection between backend and mobile.
- Scaffold 007, Send Message: mobile message input and server-side message handling.
- Scaffold 008, Receive Message: ephemeral broadcast messages appear in the chat UI.
- Scaffold 009, Error Management: simple MVP errors for login, backend availability, WebSocket connection, and message sending.
- Scaffold 010, Message Persistence: broadcast messages are saved to local backend storage and recent history loads into the mobile chat.
- Scaffold 011, Security Basics: protected MVP HTTP and WebSocket access, backend message validation, and safer mobile JWT storage boundary.
- Scaffold 012, Basic Testing: final minimal MVP test set for backend auth, protected history, WebSocket messaging, mobile flows, and error states.
- Scaffold 013, Push Notifications: Android-first push registration boundary, protected backend device token storage, offline recipient dispatch after message persistence, and mobile notification permission/token handling.
- Scaffold 014, Backend Endpoint E2E Testing: backend HTTP/API and WebSocket E2E coverage for auth login, protected history, push device token registration, JWT rejection, Alice/Bob messaging, and persisted history.
- Scaffold 015, Client E2E Testing: Android-first Maestro smoke flow for demo login, chat visibility, message sending, and recent history reload after app restart.
- Scaffold 016, Backend Penetration Testing: safe local backend security coverage for protected HTTP endpoints, JWT tampering/expiry/shape failures, WebSocket auth rejection, malformed message payloads, and push registration abuse boundaries.
- Scaffold 017, Client Security Testing: focused mobile Jest coverage for token storage cleanup, JWT-safe UI/error boundaries, unauthorized history and push registration handling, socket error sanitization, notification permission denial/unavailable handling, and notification tap privacy.

## Not Yet In Scope

- The MVP scaffold backlog is complete.
- Future next step: Dockerize the backend for local and CI-friendly startup.
- Future next step: Configure GitHub CI to run backend and mobile lint, unit, integration, E2E, and security test suites.

The current chat flow is a shared broadcast chat with locally persisted recent message history.
