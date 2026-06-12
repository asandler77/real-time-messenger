# Scaffold 008: Receive Message

Purpose: add the ability to receive chat messages from other users in real-time.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md`
- Useful skills: `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/react-native/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Prerequisites

- Scaffold 006 (WebSocket Connect) — authenticated WebSocket connection
- Scaffold 007 (Send Message) — messages can be sent and broadcast by server

## Goal

Display incoming messages from other users in real-time as they are broadcast by the server.

## Done when

- Mobile app listens for incoming `message` events on WebSocket
- Incoming messages appear in the chat UI automatically (no refresh needed)
- Messages show the text content and sender information
- Messages show timestamp
- Chat UI scrolls to show new messages
- Own messages and others' messages are visually distinguishable
- Messages display correctly when multiple users are connected
- Unit tests and integration tests cover incoming message handling and display updates

## Technical Notes

- Use Socket.IO `on('message', ...)` to listen for incoming messages
- Store messages in component state or a simple state manager
- Messages are ephemeral (lost on app restart) — no persistence yet
- Consider using FlatList for efficient message rendering

## Example Listener

```typescript
// Mobile client listens
socket.on('message', (data: IncomingMessage) => {
  setMessages(prev => [...prev, data]);
});

// IncomingMessage type
type IncomingMessage = {
  text: string;
  timestamp: string;
  userId: string;
  username?: string;
};
```

## Minimal testing

- Use two local WebSocket clients in an integration test: emit a message from one client and expect the other client to receive it.
- Use a single-client WebSocket integration test to verify server broadcast behavior when appropriate for the implementation.
- Run mobile unit tests for the message listener, state update, sender styling, timestamp rendering, and scroll trigger.
- Run an integration-style mobile test with a mocked socket event to verify that an incoming message appears in the chat UI.

## Do not

- Do not add message persistence or history
- Do not add push notifications
- Do not add unread message counts
- Do not add message search
- Do not add reactions or replies
- Do not add "user is typing" indicators
