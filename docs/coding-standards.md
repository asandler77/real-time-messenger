# Coding Standards

This project grows one scaffold at a time. Keep each change inside the active scaffold and avoid building future app features early.

## File Organization

- Keep files small and focused on one responsibility.
- Separate UI rendering from logic, network calls, persistence, validation, and data shaping.
- Let screens and controllers orchestrate; move reusable behavior into components, hooks, services, DTOs, or helpers.
- Extract shared code only when it reduces real duplication or matches an established pattern.

## Mobile UI

- Prefer this shape as the mobile app grows:
  - `screens/` for route-level screens.
  - `components/` for reusable UI.
  - `hooks/` for reusable stateful UI logic.
  - `services/` or `api/` for network and storage boundaries.
  - `ui/` or `theme/` for shared design tokens.
- Use typed props for components and keep presentation components easy to test without an emulator.
- When a value is shared across components, define it in a theme/tokens file instead of repeating hardcoded colors, spacing, radii, or font sizes.
- Suggested token groups: `space`, `size`, `radius`, `fontSize`, `color`, and `fontWeight`.

## Backend

- Keep NestJS features grouped by module.
- Controllers should stay thin and delegate behavior to services.
- Use DTOs for request and response shapes at HTTP boundaries.
- Keep service methods focused; extract helpers/providers when one service starts owning unrelated behavior.
