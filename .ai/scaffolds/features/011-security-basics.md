# Scaffold 011: Security Basics

Type: feature

Status: see `docs/STATUS.md`

## Purpose

Add basic security rules for the MVP broadcast chat without building advanced auth features.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/nestjs-backend-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Skills

- `.cursor/skills/jwt-auth/SKILL.md`
- `.cursor/skills/websocket/SKILL.md`
- `.cursor/skills/nestjs/SKILL.md`

## Prerequisites

- Scaffold 004 (Backend Login JWT) — backend can issue JWT access tokens
- Scaffold 005 (Mobile Login Screen) — mobile app can store and use the JWT
- Scaffold 006 (WebSocket Connect) — WebSocket connection validates JWT
- Scaffold 010 (Message Persistence) — messages can be saved and loaded

## Goal

Protect the MVP login, WebSocket connection, and broadcast message flow with simple security basics.

This scaffold keeps the app minimal. It focuses on preventing obvious invalid or unsafe usage, not on full production security.

## Done when

- Backend validates JWT for protected HTTP endpoints used by the MVP
- Backend validates JWT for WebSocket connections
- WebSocket connections without a valid token are rejected
- Mobile app stores the JWT in a safer place than plain component state
- Backend rejects empty messages
- Backend rejects messages that are too long
- Backend does not broadcast invalid messages
- Backend returns simple unauthorized or validation errors when security checks fail
- Unit tests and integration tests cover JWT protection and message validation

## Minimal testing

- Use HTTP/API integration tests to verify protected MVP endpoints reject missing or invalid JWTs.
- Use WebSocket client integration tests to verify missing or invalid tokens are rejected and valid tokens connect.
- Use WebSocket client integration tests to send empty and over-limit messages and expect rejection without broadcast.
- Run backend unit tests for guards, token validation, and message validation rules.
- Run mobile unit tests for secure token storage helper behavior and unauthorized/error handling.

## Do not

- Do not add user registration
- Do not add refresh tokens
- Do not add roles or permissions
- Do not add password reset
- Do not add biometric login
- Do not add end-to-end encryption
- Do not add complex rate limiting
- Do not add private conversations
