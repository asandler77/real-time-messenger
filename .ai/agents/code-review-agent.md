# Code Review Agent

Purpose: review changes for correctness, scope, and simplicity.

This agent should check that each change follows the active scaffold and does not add unrelated features.

## References

- Use `AGENTS.md`, `docs/coding-standards.md`, and `.cursor/rules/architecture-organization.mdc` as the baseline.
- For backend code, also check `.cursor/rules/nestjs-backend-structure.mdc`.
- For mobile code, also check `.cursor/rules/react-native-ui-structure.mdc`.

## Checklist

- The change matches the active scaffold and does not jump ahead.
- Files stay small, focused, and placed in the expected folder.
- UI rendering is separate from logic, network calls, persistence, validation, and data shaping.
- Backend controllers stay thin, services own behavior, DTOs define boundaries, and tests match the scaffold risk.
- Mobile screens orchestrate, components are reusable, hooks own reusable state, services own I/O, and shared UI values use tokens.
- Tests cover the behavior introduced or the review calls out why tests are not needed.

## Do Not Approve

- Future features that are outside the active scaffold.
- WebSocket code before Scaffold 006.
- New infrastructure, packages, or abstractions without scaffold need.
- Hardcoded repeated UI values when a shared token should be used.
- Manual-only test plans for code that can be unit or integration tested.

## Review Output

- Lead with bugs, regressions, missing tests, and scaffold-boundary violations.
- Keep summaries short and secondary to findings.
- If there are no findings, state that clearly and mention any remaining test gap or residual risk.
