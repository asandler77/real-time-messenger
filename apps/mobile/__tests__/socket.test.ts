import {
  createMessengerSocket,
  registerMessageHandler,
  registerSocketStatusHandlers,
  sendChatMessage,
  type MessengerSocket,
} from '../socket';
import {io} from 'socket.io-client';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

const ioMock = io as jest.Mock;

beforeEach(() => {
  ioMock.mockReset();
});

test('createMessengerSocket passes the JWT in Socket.IO auth options', () => {
  const socket = {connect: jest.fn()} as unknown as MessengerSocket;
  ioMock.mockReturnValueOnce(socket);

  expect(createMessengerSocket('demo-jwt')).toBe(socket);
  expect(ioMock).toHaveBeenCalledWith('http://10.0.2.2:3000', {
    auth: {
      token: 'demo-jwt',
    },
    autoConnect: false,
    reconnection: true,
    transports: ['websocket'],
  });
});

test('createMessengerSocket requires a JWT access token', () => {
  expect(() => createMessengerSocket('')).toThrow(
    'A JWT access token is required to connect',
  );
});

test('registerSocketStatusHandlers wires connection outcomes', () => {
  const handlers = new Map<string, () => void>();
  const on = jest.fn((event: string, handler: () => void) => {
    handlers.set(event, handler);
  });
  const off = jest.fn();
  const socket = {
    off,
    on,
  } as unknown as MessengerSocket;
  const onConnected = jest.fn();
  const onDisconnected = jest.fn();
  const onError = jest.fn();

  const cleanup = registerSocketStatusHandlers(socket, {
    onConnected,
    onDisconnected,
    onError,
  });

  handlers.get('connect')?.();
  handlers.get('disconnect')?.();
  handlers.get('connect_error')?.();

  expect(onConnected).toHaveBeenCalledTimes(1);
  expect(onDisconnected).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledTimes(1);

  cleanup();

  expect(off).toHaveBeenCalledWith('connect', onConnected);
  expect(off).toHaveBeenCalledWith('disconnect', onDisconnected);
  expect(off).toHaveBeenCalledWith('connect_error', onError);
});

test('registerMessageHandler wires incoming message updates', () => {
  const handlers = new Map<string, (message: unknown) => void>();
  const on = jest.fn((event: string, handler: (message: unknown) => void) => {
    handlers.set(event, handler);
  });
  const off = jest.fn();
  const socket = {
    off,
    on,
  } as unknown as MessengerSocket;
  const onMessage = jest.fn();

  const cleanup = registerMessageHandler(socket, onMessage);
  const message = {
    id: 'message-1',
    clientId: 'socket-1',
    text: 'Hello',
    timestamp: '2026-06-12T12:00:00.000Z',
    userId: 'demo-user',
    username: 'demo',
  };

  handlers.get('message')?.(message);

  expect(onMessage).toHaveBeenCalledWith(message);

  cleanup();

  expect(off).toHaveBeenCalledWith('message', onMessage);
});

test('sendChatMessage emits trimmed text with a timestamp', async () => {
  const emit = jest.fn(
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
  const socket = {
    connected: true,
    emit,
  } as unknown as MessengerSocket;

  await expect(sendChatMessage(socket, ' Hello ')).resolves.toEqual(
    expect.objectContaining({
      text: 'Hello',
      userId: 'demo-user',
    }),
  );
  expect(emit).toHaveBeenCalledWith(
    'message',
    expect.objectContaining({
      text: 'Hello',
      timestamp: expect.any(String),
    }),
    expect.any(Function),
  );
});

test('sendChatMessage rejects empty and disconnected sends', async () => {
  const socket = {
    connected: false,
    emit: jest.fn(),
  } as unknown as MessengerSocket;

  await expect(sendChatMessage(socket, '   ')).rejects.toThrow(
    'Message text is required',
  );
  await expect(sendChatMessage(socket, 'Hello')).rejects.toThrow(
    'Socket is disconnected',
  );
  expect(socket.emit).not.toHaveBeenCalled();
});

test('sendChatMessage maps failed acknowledgements to a safe error', async () => {
  const jwt = 'header.payload.signature';
  const socket = {
    connected: true,
    emit: jest.fn(
      (
        _event: string,
        _payload: {text: string; timestamp: string},
        acknowledge: (acknowledgement: unknown) => void,
      ) => {
        acknowledge({
          ok: false,
          error: `Unauthorized token ${jwt}`,
        });
      },
    ),
  } as unknown as MessengerSocket;

  await expect(sendChatMessage(socket, 'Hello')).rejects.toThrow(
    'Message could not be sent',
  );
  await expect(sendChatMessage(socket, 'Hello')).rejects.not.toThrow(jwt);
});
