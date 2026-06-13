# Architecture

This document describes the architecture that exists today. See `docs/STATUS.md` for the current scaffold status.

The workspace has one NestJS backend application in `apps/backend` and one React Native mobile client in `apps/mobile`.

## Backend HTTP

The backend exposes the root HTTP endpoint from Scaffold 002.

```text
GET /
```

It returns:

```json
{ "message": "Backend is running" }
```

The backend also exposes the demo login endpoint from Scaffold 004.

```text
POST /auth/login
```

The demo credentials are `demo` / `demo`. A successful request returns a JWT access token and token type.

## Real-Time Messaging

The backend has an authenticated WebSocket gateway for the current MVP chat flow. The mobile app logs in, uses the JWT to connect, sends chat messages, and receives ephemeral broadcast messages in the chat UI.

Messages are currently in-memory real-time events only. Database-backed message history belongs to Scaffold 010 and should not be assumed until `docs/STATUS.md` marks it complete.

## Mobile

The mobile client includes the login and chat screens needed for the current ephemeral broadcast chat flow and can run on the Android emulator from the CLI.
