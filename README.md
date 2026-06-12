# real-time-messenger

A learning workspace for building a real-time messenger step by step.

This workspace now contains a minimal backend skeleton, simple backend login with JWT, and a minimal mobile client skeleton. No database, Docker, Redis, Azure, Kubernetes, WebSocket, or messaging code exists yet.

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
