# Scaffold 012: Basic Testing

Purpose: add minimal tests for the main MVP broadcast chat flow.

## Recommended agents

- Plan/review: `.ai/agents/task-planner-agent.md`, `.ai/agents/code-review-agent.md`
- Useful skills: use the `.cursor/skills/<skill-name>/SKILL.md` file(s) for the code area being tested.
- Review: `.ai/workflows/review-code.md`

## Prerequisites

- Scaffold 004 (Backend Login JWT) — login endpoint exists
- Scaffold 006 (WebSocket Connect) — authenticated WebSocket connection works
- Scaffold 007 (Send Message) — messages can be sent
- Scaffold 008 (Receive Message) — messages can be received
- Scaffold 009 (Error Management) — basic errors are handled
- Scaffold 010 (Message Persistence) — message history can be loaded
- Scaffold 011 (Security Basics) — basic auth and message validation exist

## Goal

Add a small test set that confirms the MVP works from login to real-time messaging and history loading.

The goal is confidence in the core flow, not full test coverage.

## Done when

- Backend has a minimal test for successful login
- Backend has a minimal test for invalid login
- Backend has a minimal test for protected message history access
- Backend has a minimal test for rejecting invalid messages
- WebSocket message send and receive flow is covered by an automated integration test
- Mobile app has unit tests and integration-style tests for login, send, receive, disconnect error, and history reload
- Test commands are documented in the project README or scaffold notes

## Minimal testing

1. Run backend tests
2. Expect login success and login failure tests to pass
3. Expect protected message history test to pass
4. Expect invalid message test to pass
5. Run WebSocket integration tests for authenticated connect, send, receive, and invalid message rejection
6. Run mobile unit tests for screens, state, API helpers, socket helpers, and error states
7. Run mobile integration-style tests with mocked API/socket boundaries for login, send, receive, disconnect error, and history reload

## Do not

- Do not aim for full test coverage
- Do not add end-to-end test infrastructure unless necessary
- Do not add CI/CD
- Do not add visual regression tests
- Do not add performance tests
- Do not test future features that are not part of the MVP
- Do not refactor application code only to make tests more complex
