# Scaffold 005: Mobile Login Screen

Purpose: add the first mobile login screen that connects to the backend.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md`
- Useful skills: `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/jwt-auth/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Goal

Create a login screen in the mobile app that authenticates users against the backend `POST /auth/login` endpoint (scaffold 004).

## Done when

- Mobile app has a Login screen with username and password input fields
- Login screen has a "Login" button
- Pressing "Login" calls `POST /auth/login` with entered credentials
- Successful login saves the JWT token (e.g., in AsyncStorage or state)
- Successful login navigates to a simple "Home" or "Chat" placeholder screen
- Invalid credentials show an error message to the user
- Loading state is shown while the request is in progress
- Unit tests and integration-style tests cover the login screen, API helper, token save, navigation, error, and loading states

## Technical Notes

- Keep the backend base URL configurable for local development and tests
- Demo credentials: `demo` / `demo`
- Store the token securely for later use in WebSocket connection (scaffold 006)

## Minimal testing

- Run mobile unit tests for rendering username/password fields, Login button, loading state, and error state.
- Test the login API helper with mocked success and unauthorized responses.
- Add an integration-style screen test that submits demo credentials, stores the returned token, and expects navigation to the placeholder screen.
- Add an integration-style screen test for invalid credentials that expects the error message.

## Do not

- Do not add user registration
- Do not add "Forgot password" functionality
- Do not add biometric authentication
- Do not add chat UI or message functionality
- Do not add WebSocket connection (that's scaffold 006)
