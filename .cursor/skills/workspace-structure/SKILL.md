---
name: workspace-structure
description: Guides repository folder placement and AI guidance organization. Use when creating or updating workspace layout, docs, scaffold guidance, Cursor rules, project skills, or setup-only files.
---

# Workspace Structure

Use this project skill after confirming the active scaffold. It is local project guidance and remains subordinate to `AGENTS.md`, `.cursor/rules/`, and the active scaffold.

## Use With

- `.ai/agents/project-setup-agent.md`
- `.ai/scaffolds/setup/001-create-workspace.md`
- `.ai/workflows/create-small-feature.md`

## Do

- Keep guidance files concise and linked instead of duplicating the same rule in many places.
- Put new work in the folder owned by the active scaffold.
- Group scaffold files by purpose under `.ai/scaffolds/setup/`, `.ai/scaffolds/features/`, or `.ai/scaffolds/quality/`.
- Use `.cursor/skills/<skill-name>/SKILL.md` for discoverable project skills.
- Keep `.cursor/skills/**/SKILL.md` as the only project skill source; do not recreate legacy bridge skill files.
- Keep generated output and dependencies out of planning and review unless directly relevant.

## Quality Checks

- Confirm new guidance links point to the canonical source.
- Confirm setup-only changes do not introduce application source code or app features.
- Keep skill files concise and under 500 lines.

## Do Not

- Do not add application code during setup-only scaffolds.
- Do not edit `node_modules`, `dist`, `build`, `.cxx`, or other generated folders.
- Do not move files across app boundaries without a scaffold reason.
