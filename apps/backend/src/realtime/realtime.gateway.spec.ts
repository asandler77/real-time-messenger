import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mkdtemp, rm } from 'fs/promises';
import type { AddressInfo } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  io as createSocketClient,
  Socket as ClientSocket,
} from 'socket.io-client';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { MESSAGE_HISTORY_FILE } from './message-history.constants';
import { MessageHistoryService } from './message-history.service';
import {
  MAX_MESSAGE_TEXT_LENGTH,
  MESSAGE_EVENT,
  MESSAGE_TEXT_REQUIRED_ERROR,
  MESSAGE_TEXT_TOO_LONG_ERROR,
  type ChatMessage,
  type SendMessageAck,
  type SendMessagePayload,
} from './message.types';

function connectSocket(url: string, token?: string): Promise<ClientSocket> {
  return new Promise((resolve, reject) => {
    const socket = createSocketClient(url, {
      auth: token ? { token } : {},
      forceNew: true,
      reconnection: false,
      timeout: 1000,
      transports: ['websocket'],
    });

    socket.once('connect', () => {
      resolve(socket);
    });
    socket.once('connect_error', error => {
      socket.close();
      reject(error);
    });
  });
}

function waitForMessage(socket: ClientSocket): Promise<ChatMessage> {
  return new Promise(resolve => {
    socket.once(MESSAGE_EVENT, message => resolve(message as ChatMessage));
  });
}

function expectNoMessage(socket: ClientSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(MESSAGE_EVENT, onMessage);
      resolve();
    }, 50);

    function onMessage(message: unknown) {
      clearTimeout(timer);
      reject(new Error(`Unexpected message broadcast: ${JSON.stringify(message)}`));
    }

    socket.once(MESSAGE_EVENT, onMessage);
  });
}

function emitMessage(
  socket: ClientSocket,
  payload: SendMessagePayload,
): Promise<SendMessageAck> {
  return new Promise<SendMessageAck>(resolve => {
    socket.emit(MESSAGE_EVENT, payload, (ack: SendMessageAck) => resolve(ack));
  });
}

describe('RealtimeGateway', () => {
  let app: INestApplication;
  let serverUrl: string;
  let accessToken: string;
  let otherAccessToken: string;
  let temporaryDirectory: string;

  beforeAll(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'realtime-gateway-'));

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MESSAGE_HISTORY_FILE)
      .useValue(join(temporaryDirectory, 'messages.json'))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address() as AddressInfo;
    serverUrl = `http://127.0.0.1:${address.port}`;
    accessToken = app
      .get(AuthService)
      .login({ username: 'demo', password: 'demo' }).accessToken;
    otherAccessToken = app
      .get(AuthService)
      .login({ username: 'demo1', password: 'demo1' }).accessToken;
  });

  afterAll(async () => {
    await app.close();
    await rm(temporaryDirectory, { force: true, recursive: true });
  });

  it('accepts a connection with a login JWT', async () => {
    const socket = await connectSocket(serverUrl, accessToken);

    expect(socket.connected).toBe(true);

    socket.close();
  });

  it('rejects a connection without a token', async () => {
    await expect(connectSocket(serverUrl)).rejects.toThrow('Unauthorized');
  });

  it('rejects a connection with an invalid token', async () => {
    await expect(connectSocket(serverUrl, 'not-a-jwt')).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('broadcasts a valid message from an authenticated client', async () => {
    const sender = await connectSocket(serverUrl, otherAccessToken);
    const receiver = await connectSocket(serverUrl, accessToken);
    const timestamp = new Date('2026-06-12T12:00:00.000Z').toISOString();
    const receivedMessage = waitForMessage(receiver);

    const acknowledgement = await emitMessage(sender, {
      text: ' Hello world ',
      timestamp,
    });

    await expect(receivedMessage).resolves.toEqual(
      expect.objectContaining({
        clientId: sender.id,
        text: 'Hello world',
        timestamp,
        userId: 'demo1-user',
        username: 'demo1',
      }),
    );
    expect(acknowledgement).toEqual({
      ok: true,
      message: expect.objectContaining({
        clientId: sender.id,
        text: 'Hello world',
        timestamp,
        userId: 'demo1-user',
        username: 'demo1',
      }),
    });

    sender.close();
    receiver.close();
  });

  it('persists WebSocket messages so recent history can be loaded', async () => {
    const sender = await connectSocket(serverUrl, accessToken);
    const timestamp = new Date('2026-06-12T12:02:00.000Z').toISOString();

    const acknowledgement = await emitMessage(sender, {
      text: 'Persist this message',
      timestamp,
    });

    expect(acknowledgement).toEqual({
      ok: true,
      message: expect.objectContaining({
        text: 'Persist this message',
        timestamp,
        userId: 'demo-user',
        username: 'demo',
      }),
    });
    if (!acknowledgement.ok) {
      throw new Error('Expected the message to be accepted');
    }

    const persistedMessages = await app
      .get(MessageHistoryService)
      .listRecentMessages();

    expect(persistedMessages).toEqual(
      expect.arrayContaining([acknowledgement.message]),
    );

    const response = await fetch(`${serverUrl}/messages/recent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await expect(response.json()).resolves.toEqual({
      messages: expect.arrayContaining([acknowledgement.message]),
    });
    expect(response.status).toBe(200);

    sender.close();
  });

  it('rejects empty messages without broadcasting or persisting them', async () => {
    const sender = await connectSocket(serverUrl, accessToken);
    const receiver = await connectSocket(serverUrl, otherAccessToken);
    const messageHistoryService = app.get(MessageHistoryService);
    const messagesBefore = await messageHistoryService.listRecentMessages();
    const noBroadcast = expectNoMessage(receiver);

    const acknowledgement = await emitMessage(sender, { text: '   ' });

    expect(acknowledgement).toEqual({
      ok: false,
      error: MESSAGE_TEXT_REQUIRED_ERROR,
    });
    await expect(noBroadcast).resolves.toBeUndefined();
    await expect(messageHistoryService.listRecentMessages()).resolves.toHaveLength(
      messagesBefore.length,
    );

    sender.close();
    receiver.close();
  });

  it('rejects over-limit messages without broadcasting or persisting them', async () => {
    const sender = await connectSocket(serverUrl, accessToken);
    const receiver = await connectSocket(serverUrl, otherAccessToken);
    const messageHistoryService = app.get(MessageHistoryService);
    const messagesBefore = await messageHistoryService.listRecentMessages();
    const noBroadcast = expectNoMessage(receiver);

    const acknowledgement = await emitMessage(sender, {
      text: 'a'.repeat(MAX_MESSAGE_TEXT_LENGTH + 1),
    });

    expect(acknowledgement).toEqual({
      ok: false,
      error: MESSAGE_TEXT_TOO_LONG_ERROR,
    });
    await expect(noBroadcast).resolves.toBeUndefined();
    await expect(messageHistoryService.listRecentMessages()).resolves.toHaveLength(
      messagesBefore.length,
    );

    sender.close();
    receiver.close();
  });
});
