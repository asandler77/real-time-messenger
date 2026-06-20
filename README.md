# real-time-messenger

A learning workspace for building a real-time messenger step by step.

See `docs/STATUS.md` for the current scaffold status and what has been implemented. The app is currently an MVP shared broadcast chat with locally persisted recent message history.

## Backend

The backend lives in `apps/backend`.

Install dependencies:

```bash
cd apps/backend
npm install
```

Start the backend:

```bash
npm start
```

Check that it responds:

```powershell
Invoke-RestMethod http://localhost:3000/
```

Expected response:

```json
{ "message": "Backend is running" }
```

Check the demo login endpoint:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/auth/login `
  -ContentType 'application/json' `
  -Body '{"username":"demo","password":"demo"}'
```

Expected response shape:

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer"
}
```

Real-time chat currently uses the authenticated WebSocket gateway described in `docs/architecture.md`.

Run backend tests:

```bash
cd apps/backend
npm test
```

## Mobile

The mobile client lives in `apps/mobile`.

Install dependencies:

```bash
cd apps/mobile
npm install
```

List available Android emulators:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds
```

Start the Android emulator:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_5_API_31
```

Start Metro in one terminal:

```bash
npm start
```

Run the mobile client on Android from another terminal:

```bash
npm run android
```

Run mobile tests:

```bash
cd apps/mobile
npm test
```

Run the Android client E2E smoke flow with Maestro after starting the backend,
Metro, an Android emulator, and installing the app:

```powershell
cd apps/mobile
npm run e2e:maestro
```

The Maestro CLI is a system tool; install it separately and verify
`maestro --version` before running the flow. See `apps/mobile/README.md` for the
full local setup notes.
