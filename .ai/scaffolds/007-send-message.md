# Scaffold 007: Send Message

Purpose: add the ability to send a chat message through WebSocket.

## Recommended agents

- Plan/implement: `.ai/agents/task-planner-agent.md`, `.ai/agents/websocket-agent.md`, `.ai/agents/react-native-agent.md`, `.ai/agents/nestjs-backend-agent.md`
- Useful skills: `.cursor/skills/websocket/SKILL.md`, `.cursor/skills/react-native/SKILL.md`, `.cursor/skills/nestjs/SKILL.md`
- Review: `.ai/agents/code-review-agent.md` with `.ai/workflows/review-code.md`

## Prerequisites

- Scaffold 005 (Mobile Login Screen) — user can log in and get JWT
- Scaffold 006 (WebSocket Connect) — app can establish authenticated WebSocket connection

## Goal

Allow the user to type a message and send it to the server via WebSocket.

## Done when

- Mobile app has a text input field for typing a message
- Mobile app has a "Send" button
- Pressing "Send" emits a message event through the WebSocket connection
- Backend WebSocket gateway receives the message event
- Backend acknowledges the message (e.g., emits back a confirmation or broadcasts)
- Sent message appears in the chat UI (optimistic update or after server confirmation)
- Empty messages are not sent (validation)
- Send button is disabled while not connected to WebSocket
- Unit tests and integration tests cover sending, validation, acknowledgement, and disconnected state

## Technical Notes

- Use Socket.IO `emit` to send message events
- Message payload should include at minimum: `{ text: string, timestamp: Date }`
- Backend can broadcast the message to all connected clients (simple approach for now)
- No database storage required yet — messages are ephemeral

## Example Message Event

```typescript
// Mobile client sends
socket.emit('message', { 
  text: 'Hello world', 
  timestamp: new Date().toISOString() 
});

// Backend receives and broadcasts
@SubscribeMessage('message')
handleMessage(client: Socket, payload: MessagePayload) {
  this.server.emit('message', {
    ...payload,
    userId: client.data.userId
  });
}
```

## Minimal testing

- Use a WebSocket client integration test to emit a valid `message` event and expect acknowledgement or broadcast.
- Use a WebSocket client integration test to emit an empty message and expect rejection.
- Run mobile unit tests for message input, Send button state, and emitted payload.
- Run an integration-style mobile test with a mocked socket to verify send flow and UI update.

## Do not

- Do not add message persistence (database)
- Do not add message history loading
- Do not add typing indicators
- Do not add read receipts
- Do not add file/image attachments
- Do not add message editing or deletion
