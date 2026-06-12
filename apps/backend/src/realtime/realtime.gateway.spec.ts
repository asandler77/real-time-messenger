import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import type { AddressInfo } from 'net';
import { io as createSocketClient, Socket as ClientSocket } from 'socket.io-client';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { MESSAGE_EVENT, type ChatMessage, type SendMessageAck } from './message.types';

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

describe('RealtimeGateway', () => {
  let app: INestApplication;
  let serverUrl: string;
  let accessToken: string;
  let otherAccessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address() as AddressInfo;
    serverUrl = `http://127.0.0.1:${address.port}`;
    accessToken = app
      .get(AuthService)
      .login({ username: 'demo', password: 'demo' }).accessToken;
    otherAccessToken = app.get(JwtService).sign({
      sub: 'other-user',
      username: 'other',
    });
  });

  afterAll(async () => {
    await app.close();
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

    const acknowledgement = await new Promise<SendMessageAck>(resolve => {
      sender.emit(
        MESSAGE_EVENT,
        { text: ' Hello world ', timestamp },
        (ack: SendMessageAck) => resolve(ack),
      );
    });

    await expect(receivedMessage).resolves.toEqual(
      expect.objectContaining({
        text: 'Hello world',
        timestamp,
        userId: 'other-user',
        username: 'other',
      }),
    );
    expect(acknowledgement).toEqual({
      ok: true,
      message: expect.objectContaining({
        text: 'Hello world',
        timestamp,
        userId: 'other-user',
        username: 'other',
      }),
    });

    sender.close();
    receiver.close();
  });

  it('rejects empty messages from authenticated clients', async () => {
    const socket = await connectSocket(serverUrl, accessToken);

    const acknowledgement = await new Promise<SendMessageAck>(resolve => {
      socket.emit(MESSAGE_EVENT, { text: '   ' }, (ack: SendMessageAck) =>
        resolve(ack),
      );
    });

    expect(acknowledgement).toEqual({
      ok: false,
      error: 'Message text is required.',
    });

    socket.close();
  });
});
