# Scaffold 001: Create Workspace

Type: setup

Status: see `docs/STATUS.md`

## Purpose

Create the initial project folders and AI guidance files.

## Prerequisites

- None.

## Recommended agents

- Plan/setup: `.ai/agents/task-planner-agent.md`, `.ai/agents/project-setup-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/workspace-structure/SKILL.md`

## Goal

Create the initial repository structure for a scaffolded learning project before adding backend, mobile, login, WebSocket, or messaging code.

## Done when

- The repository has the initial app, docs, AI guidance, and scaffold folders.
- The top-level safety rules and scaffold guidance map exist.
- The first development plan and coding standards documents exist.
- Future work can be chosen from ordered scaffold files.

## Minimal testing

- Verify the guidance links point to files that exist.
- Confirm setup-only changes do not introduce application features.

## Do not

- Do not add backend application code.
- Do not add mobile application code.
- Do not add login, JWT, WebSocket, message sending, or message receiving.
- Do not add infrastructure such as Docker, Redis, Azure, or Kubernetes.
