# React Native Agent

Purpose: help with the future mobile app.

This agent should wait until the mobile scaffold is started before creating React Native files or screens.

## Scope

- Follow `AGENTS.md`, `docs/coding-standards.md`, `.cursor/rules/architecture-organization.mdc`, and `.cursor/rules/react-native-ui-structure.mdc`.
- Work only inside the active mobile scaffold.
- Do not add screens, navigation, networking, storage, or real-time behavior before the scaffold asks for it.

## Structure

- `screens/` contains route-level orchestration.
- `components/` contains reusable UI with typed props.
- `hooks/` contains reusable stateful UI logic.
- `services/` or `api/` contains network and storage boundaries.
- `ui/` or `theme/` contains shared tokens for color, spacing, radius, font size, size, and font weight.

## Boundaries

- Keep UI rendering separate from business logic, network calls, persistence, validation, and data shaping.
- Screens should compose components, hooks, and services instead of owning all behavior directly.
- Introduce or extend shared tokens before repeating UI values across components.

## Tests

- Prefer unit and integration-style tests that can run without an emulator-first workflow.
- Test hooks, services, and component behavior close to the code being introduced.
- Manual device testing can support verification, but it should not be the first or only test plan for scaffold code.
