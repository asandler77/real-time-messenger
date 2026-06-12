---
name: react-native
description: Guides React Native mobile screen, component, hook, service, token, and test boundaries. Use when a mobile scaffold asks for screens, login UI, chat UI, socket client code, or mobile tests.
---

# React Native

Use this project skill only after the active scaffold includes mobile work. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/react-native-agent.md`
- `.cursor/rules/react-native-ui-structure.mdc`
- Mobile scaffolds such as 003, 005, 006, 007, 008, and 009

## Do

- Keep screens as route-level orchestration, not large all-in-one components.
- Move reusable UI into `components/`, stateful behavior into `hooks/`, and network or storage work into `services/` or `api/`.
- Use `ui/` or `theme/` for shared tokens such as `space`, `size`, `radius`, `fontSize`, `color`, and `fontWeight`.
- Use typed props and exported helper return types when practical.
- Keep side effects out of presentation components.

## Quality Checks

- Prefer unit and integration-style tests that run without an emulator-first workflow.
- Test component behavior, hooks, and API or storage boundaries close to the code introduced.
- Mock network, storage, and socket boundaries in mobile tests unless the scaffold explicitly asks for device testing.

## Do Not

- Do not add screens, navigation flows, storage, networking, or socket behavior before the scaffold asks for it.
- Do not repeat hardcoded UI values across files when a shared token should exist.
- Do not make manual emulator testing the only verification path.
