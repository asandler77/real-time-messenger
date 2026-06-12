# Scaffold 003: Create Mobile Skeleton

Purpose: later create the first mobile app project structure.

Do not create React Native files until this scaffold is active.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md`
- Useful skill: `.cursor/skills/react-native/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

Goal: create a minimal mobile client with a testable starter screen.

Done when:

- The mobile project structure exists.
- The mobile client has one minimal starter screen.
- The install and run commands are documented.
- A minimal unit test and a minimal integration-style component test are created for the starter screen.

Example expected check:

```bash
npm test
```

Automated testing should verify that the starter screen renders expected text without requiring an emulator or manual app launch.

Do not add login UI, chat UI, JWT, WebSocket, message sending, or message receiving in this scaffold.
