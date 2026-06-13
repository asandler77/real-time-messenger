import React from 'react';
import {Text} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import type {MessengerSocket, ChatMessage} from '../socket';
import {useChatSocket, type ChatSocketState} from '../useChatSocket';
import {useSocketConnection} from '../useSocketConnection';

const loadEmptyHistory = () => Promise.resolve([]);

function SocketStatus({
  accessToken,
  createSocket,
}: {
  accessToken: string | null;
  createSocket: (accessToken: string) => MessengerSocket;
}) {
  const status = useSocketConnection(accessToken, createSocket);

  return <Text>{status}</Text>;
}

function createMockSocket() {
  const handlers = new Map<string, (value?: unknown) => void>();
  const socket = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    id: 'socket-1',
    off: jest.fn(),
    on: jest.fn((event: string, handler: (value?: unknown) => void) => {
      handlers.set(event, handler);
    }),
  } as unknown as MessengerSocket;

  return {handlers, socket};
}

function ChatSocketProbe({
  accessToken,
  createSocket,
  loadHistory = loadEmptyHistory,
  onState,
}: {
  accessToken: string;
  createSocket: (accessToken: string) => MessengerSocket;
  loadHistory?: (accessToken: string) => Promise<ChatMessage[]>;
  onState: (state: ChatSocketState) => void;
}) {
  const state = useChatSocket(accessToken, createSocket, loadHistory);

  onState(state);

  return (
    <Text>
      {state.status}:{state.messages.map(message => message.text).join(',')}
      {state.error}
    </Text>
  );
}

test('useSocketConnection connects with the login token', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SocketStatus accessToken="demo-jwt" createSocket={createSocket} />,
    );
  });

  expect(createSocket).toHaveBeenCalledWith('demo-jwt');
  expect(socket.connect).toHaveBeenCalledTimes(1);

  await ReactTestRenderer.act(() => {
    handlers.get('connect')?.();
  });

  expect(renderer!.root.findByType(Text).props.children).toBe('connected');
});

test('useSocketConnection disconnects during cleanup', async () => {
  const {socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SocketStatus accessToken="demo-jwt" createSocket={createSocket} />,
    );
  });

  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });

  expect(socket.disconnect).toHaveBeenCalledTimes(1);
});

test('useChatSocket receives incoming messages', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let latestState: ChatSocketState | null = null;
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatSocketProbe
        accessToken="demo-jwt"
        createSocket={createSocket}
        onState={state => {
          latestState = state;
        }}
      />,
    );
  });

  const message: ChatMessage = {
    clientId: 'socket-2',
    id: 'message-1',
    text: 'Hello',
    timestamp: '2026-06-12T12:00:00.000Z',
    userId: 'other-user',
    username: 'Other',
  };

  await ReactTestRenderer.act(() => {
    handlers.get('connect')?.();
    handlers.get('message')?.(message);
  });

  expect(latestState?.clientId).toBe('socket-1');
  expect(latestState?.messages).toEqual([message]);
  expect(renderer!.root.findByType(Text).props.children.join('')).toContain(
    'connected:Hello',
  );
});

test('useChatSocket loads history and appends realtime messages without duplicates', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  const historyMessage: ChatMessage = {
    clientId: 'socket-1',
    id: 'message-1',
    text: 'Persisted',
    timestamp: '2026-06-12T12:00:00.000Z',
    userId: 'demo-user',
    username: 'demo',
  };
  const realtimeMessage: ChatMessage = {
    clientId: 'socket-2',
    id: 'message-2',
    text: 'Realtime',
    timestamp: '2026-06-12T12:01:00.000Z',
    userId: 'other-user',
    username: 'Other',
  };
  const loadHistory = jest.fn().mockResolvedValue([historyMessage]);
  let latestState: ChatSocketState | null = null;

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <ChatSocketProbe
        accessToken="demo-jwt"
        createSocket={createSocket}
        loadHistory={loadHistory}
        onState={state => {
          latestState = state;
        }}
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    handlers.get('message')?.(historyMessage);
    handlers.get('message')?.(realtimeMessage);
  });

  expect(loadHistory).toHaveBeenCalledWith('demo-jwt');
  expect(latestState?.messages).toEqual([historyMessage, realtimeMessage]);
});

test('useChatSocket sends through the connected socket', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let latestState: ChatSocketState | null = null;

  (socket.emit as jest.Mock).mockImplementation(
    (
      _event: string,
      payload: {text: string; timestamp: string},
      acknowledge: (acknowledgement: unknown) => void,
    ) => {
      acknowledge({
        ok: true,
        message: {
          clientId: 'socket-1',
          id: 'message-1',
          text: payload.text,
          timestamp: payload.timestamp,
          userId: 'demo-user',
          username: 'demo',
        },
      });
    },
  );
  (socket as unknown as {connected: boolean}).connected = true;

  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <ChatSocketProbe
        accessToken="demo-jwt"
        createSocket={createSocket}
        onState={state => {
          latestState = state;
        }}
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    handlers.get('connect')?.();
  });

  let wasSent = false;

  await ReactTestRenderer.act(async () => {
    wasSent = await latestState!.sendMessage(' Hello ');
  });

  expect(wasSent).toBe(true);
  expect(socket.emit).toHaveBeenCalledWith(
    'message',
    expect.objectContaining({text: 'Hello'}),
    expect.any(Function),
  );
});

test('useChatSocket exposes disconnected and send failure errors', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let latestState: ChatSocketState | null = null;

  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <ChatSocketProbe
        accessToken="demo-jwt"
        createSocket={createSocket}
        onState={state => {
          latestState = state;
        }}
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    handlers.get('disconnect')?.();
  });

  expect(latestState?.error).toBe(
    'Chat is disconnected. Reconnect before sending.',
  );

  let wasSent = true;

  await ReactTestRenderer.act(async () => {
    wasSent = await latestState!.sendMessage('Hello');
  });

  expect(wasSent).toBe(false);
  expect(latestState?.error).toBe(
    'Chat is disconnected. Reconnect before sending.',
  );
});

test('useChatSocket shows a simple send failure message', async () => {
  const {handlers, socket} = createMockSocket();
  const createSocket = jest.fn(() => socket);
  let latestState: ChatSocketState | null = null;

  (socket.emit as jest.Mock).mockImplementation(
    (
      _event: string,
      _payload: {text: string; timestamp: string},
      acknowledge: (acknowledgement: unknown) => void,
    ) => {
      acknowledge({
        ok: false,
        error: 'Message text is required.',
      });
    },
  );
  (socket as unknown as {connected: boolean}).connected = true;

  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <ChatSocketProbe
        accessToken="demo-jwt"
        createSocket={createSocket}
        onState={state => {
          latestState = state;
        }}
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    handlers.get('connect')?.();
  });

  let wasSent = true;

  await ReactTestRenderer.act(async () => {
    wasSent = await latestState!.sendMessage('Hello');
  });

  expect(wasSent).toBe(false);
  expect(latestState?.error).toBe('Message could not be sent. Try again.');
});
