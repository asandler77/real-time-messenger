# Review Code Workflow

Purpose: review a change before moving to the next scaffold.

Use this checklist before marking a scaffold step complete or moving to the next scaffold.

## Checklist

- Plan: identify the active scaffold and compare the change with its goal, done criteria, and "do not" list.
- Review: use `.ai/agents/code-review-agent.md` with the applicable `.cursor/rules/` and `docs/coding-standards.md`.
- Specialist check: include the relevant backend, mobile, WebSocket, or setup agent guidance from `.ai/README.md`; if the scaffold lists project skill(s), read the matching `.cursor/skills/<skill-name>/SKILL.md` before review.
- Scope: confirm the change does not add future scaffold features, infrastructure, packages, or abstractions early.
- Test: verify the scaffold's minimal tests ran, or record why tests are not needed for docs-only changes.
- Findings: lead with bugs, regressions, scaffold-boundary violations, and missing tests.
- Advance: update `docs/development-plan.md` only after the scaffold is clearly implemented and reviewed.
