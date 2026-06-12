# AI Guidance Map

This folder connects the project guidance files. The system is declarative: files do not launch agents or workflows automatically. Choose the active scaffold first, then use the matching agent, skill, workflow, and rules as references.

Project skills under `.cursor/skills/` are local guidance for Cursor discovery. Treat them as subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## How the files relate

- `AGENTS.md` defines repository-wide agent boundaries and safety rules.
- `docs/` explains the project plan, architecture, and coding standards.
- `.cursor/rules/` contains Cursor rules that should be followed during implementation and review.
- `.ai/scaffolds/` defines the ordered learning steps and their done criteria.
- `.ai/agents/` defines focused roles for planning, setup, backend, mobile, WebSocket, and review work.
- `.cursor/skills/` contains discoverable local project skills for scaffold topics.
- `.ai/skills/` contains legacy bridge references to the matching project skills.
- `.ai/workflows/` gives repeatable checklists for small implementation work and review.

## Scaffold Guidance Matrix

| Scaffold | Recommended agent(s) | Useful skill(s) | Review workflow |
| --- | --- | --- | --- |
| 001 Create Workspace | `.ai/agents/task-planner-agent.md`, `.ai/agents/project-setup-agent.md` | `.cursor/skills/workspace-structure/SKILL.md` | `.ai/workflows/review-code.md` |
| 002 Backend Skeleton | `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md` | `.cursor/skills/nestjs/SKILL.md` | `.ai/workflows/review-code.md` |
| 003 Mobile Skeleton | `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md` | `.cursor/skills/react-native/SKILL.md` | `.ai/workflows/review-code.md` |
| 004 Backend Login JWT | `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md` | `.cursor/skills/nestjs/SKILL.md`, `.cursor/skills/jwt-auth/SKILL.md` | `.ai/workflows/review-code.md` |
| 005 Mobile Login Screen | `.ai/agents/task-planner-agent.md`, `.ai/agents/react-native-agent.md` | `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/jwt-auth/SKILL.md` | `.ai/workflows/review-code.md` |
| 006 WebSocket Connect | `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md` | `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/jwt-auth/SKILL.md` | `.ai/workflows/review-code.md` |
| 007 Send Message | `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/nestjs-backend-agent.md` | `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/nestjs/SKILL.md` | `.ai/workflows/review-code.md` |
| 008 Receive Message | `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md` | `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/react-native/SKILL.md` | `.ai/workflows/review-code.md` |
| 009 Error Management | `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/websocket-agent.md` | `.cursor/skills/nestjs/SKILL.md`, `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/websocket/SKILL.md` | `.ai/workflows/review-code.md` |
| 010 Message Persistence | `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/websocket-agent.md` | `.cursor/skills/nestjs/SKILL.md`, `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/websocket/SKILL.md` | `.ai/workflows/review-code.md` |
| 011 Security Basics | `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md` | `.cursor/skills/jwt-auth/SKILL.md`, `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/nestjs/SKILL.md` | `.ai/workflows/review-code.md` |
| 012 Basic Testing | `.ai/agents/task-planner-agent.md`, `.ai/agents/code-review-agent.md` | Use the skill(s) for the code area being tested | `.ai/workflows/review-code.md` |

For implementation, start with `.ai/workflows/create-small-feature.md`. Before advancing to the next scaffold, use `.ai/workflows/review-code.md` with `.ai/agents/code-review-agent.md`.
