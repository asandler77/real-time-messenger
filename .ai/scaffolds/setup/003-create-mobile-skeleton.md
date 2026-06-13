# Scaffold 003: Create Mobile Skeleton

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Create the first mobile app project structure.

## Prerequisites

- Scaffold 001 (Create Workspace) is complete.
- This scaffold is active.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/react-native/SKILL.md`

## Goal

Create a minimal mobile client with a testable starter screen.

## Done when

- The mobile project structure exists.
- The mobile client has one minimal starter screen.
- The install and run commands are documented.
- A minimal unit test and a minimal integration-style component test are created for the starter screen.

Example expected check:

```bash
npm test
```

Automated testing should verify that the starter screen renders expected text without requiring an emulator or manual app launch.

## Minimal testing

- Run the starter mobile tests.
- Verify the starter screen renders expected text without requiring an emulator or manual app launch.

## Do not

- Do not create React Native files before this scaffold is active.
- Do not add login UI, chat UI, JWT, WebSocket, message sending, or message receiving.
