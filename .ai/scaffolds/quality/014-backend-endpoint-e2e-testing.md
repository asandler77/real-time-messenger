# Scaffold 014: Backend Endpoint E2E Testing

Type: testing

Status: see `docs/STATUS.md`

## Purpose

Add backend HTTP/API and WebSocket E2E coverage for the post-MVP app boundaries.

This scaffold is for backend endpoint and gateway behavior only. It is not a mobile UI E2E scaffold.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/websocket-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/backend-endpoint-testing/SKILL.md`
- `.cursor/skills/nestjs/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`
- `.cursor/skills/jwt-auth/SKILL.md`

## Prerequisites

- Scaffold 011 (Security Basics) — protected HTTP and WebSocket access exists
- Scaffold 012 (Basic Testing) — MVP behavior has minimal automated coverage
- Scaffold 013 (Push Notifications) — post-MVP feature boundary is known

## Goal

Add reliable E2E tests around backend API routes, protected access, message history, and authenticated WebSocket messaging.

The goal is endpoint confidence at real NestJS module boundaries, not full application UI coverage.

## Done when

- HTTP E2E tests cover auth success and auth failure behavior
- Protected HTTP endpoints reject missing or invalid JWTs and accept valid JWTs
- Message history endpoint tests assert request and response shape
- WebSocket E2E tests cover authenticated Alice/Bob connect, send, and receive flow
- WebSocket tests cover missing or invalid token rejection
- Persistence fixtures are isolated between history and messaging tests
- Tests avoid production services and external credentials

## Minimal testing

- Run backend endpoint E2E tests locally.
- Verify `supertest` coverage for HTTP route contracts and status codes.
- Verify `socket.io-client` coverage for authenticated WebSocket connection and message flow.
- Verify valid, invalid, malformed, and missing JWT cases for protected boundaries.
- Verify message history tests use isolated persistence fixtures.

## Do not

- Do not add mobile UI E2E tests in this scaffold
- Do not require production services, production data, or real credentials
- Do not add broad load, performance, or security scanning tests
- Do not depend on test execution order
- Do not add app features to make tests pass
