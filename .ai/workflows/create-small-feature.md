# Create Small Feature Workflow

Purpose: keep feature work small and easy to review.

Use this checklist when implementing one small outcome inside the active scaffold.

## Checklist

- Plan: confirm the active scaffold from `docs/development-plan.md`, `.ai/scaffolds/`, or the user request.
- Plan: use `.ai/agents/task-planner-agent.md` to name the smallest useful result, target files, and test expectation.
- Implement: use the relevant specialist agent from `.ai/README.md`; when the active scaffold lists project skill(s), read and apply the matching `.cursor/skills/<skill-name>/SKILL.md` before implementation.
- Implement: keep changes inside the scaffold boundary and do not add future scaffold features.
- Test: run or document the minimal tests required by the scaffold.
- Review: use `.ai/workflows/review-code.md` and `.ai/agents/code-review-agent.md`.
- Advance: update scaffold status only when implementation, tests, and review are complete.
