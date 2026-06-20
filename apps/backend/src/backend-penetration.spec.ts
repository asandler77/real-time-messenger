import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { mkdtemp, rm } from 'fs/promises';
import type { AddressInfo } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  io as createSocketClient,
  Socket as ClientSocket,
} from 'socket.io-client';
import request = require('supertest');
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { jwtModuleOptions } from './auth/jwt.config';
import { DEVICE_TOKEN_STORE_FILE } from './push/device-token-store.constants';
import { DeviceTokenStoreService } from './push/device-token-store.service';
import { PushNotificationService } from './push/push-notification.service';
import { MESSAGE_HISTORY_FILE } from './realtime/message-history.constants';
import { MessageHistoryService } from './realtime/message-history.service';
import {
  MAX_MESSAGE_TEXT_LENGTH,
  MESSAGE_EVENT,
  MESSAGE_TEXT_REQUIRED_ERROR,
  MESSAGE_TEXT_TOO_LONG_ERROR,
  type ChatMessage,
  type SendMessageAck,
} from './realtime/message.types';

type SocketAuthOptions = {
  authorization?: string;
  queryToken?: string;
  token?: unknown;
};

function connectSocket(
  url: string,
  options: SocketAuthOptions = {},
): Promise<ClientSocket> {
  return new Promise((resolve, reject) => {
    const socket = createSocketClient(url, {
      auth: Object.prototype.hasOwnProperty.call(options, 'token')
        ? { token: options.token }
        : {},
      extraHeaders: options.authorization
        ? { Authorization: options.authorization }
        : undefined,
      forceNew: true,
      query: options.queryToken ? { token: options.queryToken } : undefined,
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

function emitMessage(
  socket: ClientSocket,
  payload: unknown,
): Promise<SendMessageAck> {
  return new Promise<SendMessageAck>(resolve => {
    socket.emit(MESSAGE_EVENT, payload, (ack: SendMessageAck) => resolve(ack));
  });
}

function expectNoMessage(socket: ClientSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(MESSAGE_EVENT, onMessage);
      resolve();
    }, 75);

    function onMessage(message: unknown) {
      clearTimeout(timer);
      reject(new Error(`Unexpected message broadcast: ${JSON.stringify(message)}`));
    }

    socket.once(MESSAGE_EVENT, onMessage);
  });
}

function tamperJwt(token: string): string {
  const parts = token.split('.');

  return `${parts[0]}.${parts[1]}.tampered-signature`;
}

describe('Backend penetration security boundaries', () => {
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;
  let serverUrl: string;
  let temporaryDirectory: string;
  let validToken: string;
  let otherValidToken: string;
  let tamperedToken: string;
  let expiredToken: string;
  let wrongShapeToken: string;

  beforeAll(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'backend-security-'));

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MESSAGE_HISTORY_FILE)
      .useValue(join(temporaryDirectory, 'messages.json'))
      .overrideProvider(DEVICE_TOKEN_STORE_FILE)
      .useValue(join(temporaryDirectory, 'device-tokens.json'))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0);

    httpServer = app.getHttpServer();
    const address = httpServer.address() as AddressInfo;
    serverUrl = `http://127.0.0.1:${address.port}`;

    validToken = app
      .get(AuthService)
      .login({ username: 'demo', password: 'demo' }).accessToken;
    otherValidToken = app
      .get(AuthService)
      .login({ username: 'demo1', password: 'demo1' }).accessToken;

    const jwtService = new JwtService(jwtModuleOptions);
    tamperedToken = tamperJwt(validToken);
    expiredToken = jwtService.sign(
      { sub: 'demo-user', username: 'demo' },
      { expiresIn: -1 },
    );
    wrongShapeToken = jwtService.sign({ sub: 'demo-user' });
  });

  afterAll(async () => {
    await app.close();
    await rm(temporaryDirectory, { force: true, recursive: true });
  });

  it.each([
    {
      authorization: undefined,
      expectedMessage: 'Missing authentication token',
      name: 'missing authorization header',
    },
    {
      authorization: 'Token not-bearer',
      expectedMessage: 'Missing authentication token',
      name: 'non-Bearer authorization scheme',
    },
    {
      authorization: 'Bearer    ',
      expectedMessage: 'Missing authentication token',
      name: 'empty Bearer token',
    },
    {
      authorization: 'Bearer not-a-jwt',
      expectedMessage: 'Invalid authentication token',
      name: 'malformed JWT',
    },
    {
      authorization: () => `Bearer ${tamperedToken}`,
      expectedMessage: 'Invalid authentication token',
      name: 'tampered JWT signature',
    },
    {
      authorization: () => `Bearer ${expiredToken}`,
      expectedMessage: 'Invalid authentication token',
      name: 'expired JWT',
    },
    {
      authorization: () => `Bearer ${wrongShapeToken}`,
      expectedMessage: 'Invalid authentication token',
      name: 'JWT missing required user shape',
    },
  ])(
    'rejects protected HTTP access with $name',
    async ({ authorization, expectedMessage }) => {
      for (const buildRequest of [
        () => request(httpServer).get('/messages/recent'),
        () =>
          request(httpServer)
            .post('/push/device-token')
            .send({ deviceToken: 'android-token', platform: 'android' }),
      ]) {
        const protectedRequest = buildRequest();
        const header =
          typeof authorization === 'function' ? authorization() : authorization;

        if (header) {
          protectedRequest.set('Authorization', header);
        }

        const response = await protectedRequest.expect(401);

        expect(response.body).toEqual({
          error: 'Unauthorized',
          message: expectedMessage,
          statusCode: 401,
        });
        expect(JSON.stringify(response.body)).not.toContain(validToken);
      }
    },
  );

  it.each([
    {
      name: 'missing token',
      options: {},
    },
    {
      name: 'non-string auth token',
      options: { token: ['not-a-single-token'] },
    },
    {
      name: 'malformed header scheme',
      options: { authorization: 'Token not-bearer' },
    },
    {
      name: 'malformed JWT',
      options: { token: 'not-a-jwt' },
    },
    {
      name: 'tampered JWT signature',
      options: () => ({ token: tamperedToken }),
    },
    {
      name: 'expired JWT',
      options: () => ({ token: expiredToken }),
    },
    {
      name: 'JWT missing required user shape',
      options: () => ({ queryToken: wrongShapeToken }),
    },
  ])('rejects WebSocket auth with $name', async ({ options }) => {
    const socketOptions = typeof options === 'function' ? options() : options;

    await expect(connectSocket(serverUrl, socketOptions)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it.each([
    {
      expectedError: MESSAGE_TEXT_REQUIRED_ERROR,
      name: 'null payload',
      payload: null,
    },
    {
      expectedError: MESSAGE_TEXT_REQUIRED_ERROR,
      name: 'empty object payload',
      payload: {},
    },
    {
      expectedError: MESSAGE_TEXT_REQUIRED_ERROR,
      name: 'non-string message text',
      payload: { text: ['hello'] },
    },
    {
      expectedError: MESSAGE_TEXT_REQUIRED_ERROR,
      name: 'blank message text',
      payload: { text: '   ' },
    },
    {
      expectedError: MESSAGE_TEXT_TOO_LONG_ERROR,
      name: 'overlong message text',
      payload: { text: 'a'.repeat(MAX_MESSAGE_TEXT_LENGTH + 1) },
    },
  ])(
    'rejects $name without persistence, broadcast, or push dispatch',
    async ({ expectedError, payload }) => {
      const sender = await connectSocket(serverUrl, { token: validToken });
      const receiver = await connectSocket(serverUrl, { token: otherValidToken });
      const messageHistoryService = app.get(MessageHistoryService);
      const pushNotificationService = app.get(PushNotificationService);
      const messagesBefore = await messageHistoryService.listRecentMessages();
      const pushDispatchSpy = jest.spyOn(
        pushNotificationService,
        'dispatchNewMessageAlert',
      );
      const noBroadcast = expectNoMessage(receiver);

      const acknowledgement = await emitMessage(sender, payload);

      expect(acknowledgement).toEqual({
        error: expectedError,
        ok: false,
      });
      await expect(noBroadcast).resolves.toBeUndefined();
      await expect(messageHistoryService.listRecentMessages()).resolves.toEqual(
        messagesBefore,
      );
      expect(pushDispatchSpy).not.toHaveBeenCalled();

      pushDispatchSpy.mockRestore();
      sender.close();
      receiver.close();
    },
  );

  it.each([
    {
      body: {},
      expectedMessage: 'Device token is required.',
      name: 'missing device token',
    },
    {
      body: { deviceToken: ['android-token'] },
      expectedMessage: 'Device token is required.',
      name: 'non-string device token',
    },
    {
      body: { deviceToken: '   ' },
      expectedMessage: 'Device token is required.',
      name: 'blank device token',
    },
    {
      body: { deviceToken: 'android-token', platform: 'ios' },
      expectedMessage: 'Only Android device tokens are supported.',
      name: 'unsupported platform',
    },
  ])(
    'rejects push registration abuse payload: $name',
    async ({ body, expectedMessage }) => {
      const deviceTokenStore = app.get(DeviceTokenStoreService);
      const recordsBefore = await deviceTokenStore.listRecords();

      const response = await request(httpServer)
        .post('/push/device-token')
        .set('Authorization', `Bearer ${validToken}`)
        .send(body)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: expectedMessage,
        statusCode: 400,
      });
      await expect(deviceTokenStore.listRecords()).resolves.toEqual(recordsBefore);
    },
  );

  it('keeps protected history readable with a valid JWT after rejected abuse cases', async () => {
    const message: ChatMessage = {
      clientId: 'socket-security',
      id: 'security-message',
      text: 'Persisted security fixture',
      timestamp: '2026-06-13T12:00:00.000Z',
      userId: 'demo-user',
      username: 'demo',
    };

    await app.get(MessageHistoryService).saveMessage(message);

    const response = await request(httpServer)
      .get('/messages/recent')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.messages).toEqual(
      expect.arrayContaining([expect.objectContaining(message)]),
    );
  });
});
