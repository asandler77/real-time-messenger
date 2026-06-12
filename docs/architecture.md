# Architecture

This document will describe the project architecture as it grows.

For now, the workspace has one minimal backend application in `apps/backend` and one minimal mobile client in `apps/mobile`.

The backend exposes a single root HTTP endpoint for Scaffold 002:

```bash
curl http://localhost:3000/
```

It returns:

```json
{ "message": "Backend is running" }
```

For Scaffold 004, the backend also exposes a demo login endpoint:

```text
POST /auth/login
```

The demo credentials are `demo` / `demo`. A successful request returns a JWT access token and token type.

The mobile client has one starter screen for Scaffold 003 and can run on the Android emulator from the CLI.

Mobile login UI, database, WebSocket, and messaging features will be added in later scaffolds.
