# Run Client E2E Workflow

Purpose: standard local workflow for running Android client E2E smoke tests with Maestro.

Use this workflow when asked to run client E2E tests, especially after scaffolds or changes touching login, chat UI, history reload, push notification tap/navigation, or auth/session UI. It is not required for backend-only changes unless requested.

## Prerequisites

- Backend is running on `localhost:3000`.
- Metro is running on `localhost:8081`.
- An Android emulator or device is available in `adb devices`.
- The app is installed on the emulator or device.
- Maestro CLI is installed and available as `maestro`.
- Local dev backend has test credentials `demo` / `demo`.

## Commands

```powershell
cd apps/mobile
npm run e2e:maestro
```

## Failure Handling

- Missing CLI: report that `maestro` is unavailable and suggest installing or adding it to `PATH`.
- Missing emulator/device: report that no device is visible in `adb devices` and suggest starting an emulator or connecting a device.
- Backend unavailable: report that `localhost:3000` is not reachable and suggest starting the backend.
- App not installed: report that the target app is missing and suggest installing it with the local mobile run command.
- Selector or `testID` failure: report the failing selector separately and suggest checking the UI element or Maestro flow.

Do not hide a failed run. Include the short next action with the failure.

## Report Format

- Result: pass or fail.
- Device: Android device id when available.
- Command: exact command run.
- Missing prerequisite: any missing CLI, device, backend, Metro, app install, or credentials.
