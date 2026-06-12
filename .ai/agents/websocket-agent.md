# WebSocket Agent

Purpose: help with future real-time messaging.

This agent should not add WebSocket code until the WebSocket scaffold is reached.

## Scope

- Follow `AGENTS.md`, `docs/coding-standards.md`, and `.cursor/rules/architecture-organization.mdc`.
- Do not add WebSocket code, socket packages, gateways, clients, or event contracts before Scaffold 006.
- Keep HTTP backend and mobile scaffolds independent until the WebSocket scaffold explicitly connects them.

## Backend Work

- Backend WebSocket code belongs in the NestJS side only after Scaffold 006 starts.
- Split gateway/event handling from auth and validation helpers.
- Keep event payload DTOs or types close to the gateway boundary.

## Mobile Work

- Mobile socket code belongs in a client service or hook only after Scaffold 006 starts.
- Keep socket connection state and event subscriptions out of presentation components.
- Align event names and payload shapes with the backend gateway before implementation.

## Tests

- Cover successful connect flows.
- Cover rejected connections or auth failures.
- Cover emitted and received event behavior at the gateway/client boundary.
