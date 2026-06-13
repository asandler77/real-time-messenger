import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mkdtemp, rm } from 'fs/promises';
import type { AddressInfo } from 'net';
import { tmpdir } from 'os';
import { join } from 'path';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { MESSAGE_HISTORY_FILE } from './message-history.constants';
import { MessageHistoryService } from './message-history.service';
import type { ChatMessage } from './message.types';

function createMessage(id: string): ChatMessage {
  return {
    clientId: 'socket-1',
    id,
    text: `Persisted ${id}`,
    timestamp: '2026-06-12T12:00:00.000Z',
    userId: 'demo-user',
    username: 'demo',
  };
}

describe('MessagesController', () => {
  let app: INestApplication;
  let serverUrl: string;
  let temporaryDirectory: string;
  let accessToken: string;

  beforeAll(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'messages-api-'));

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
  });

  afterAll(async () => {
    await app.close();
    await rm(temporaryDirectory, { force: true, recursive: true });
  });

  it('loads recent persisted messages with a valid JWT', async () => {
    const messageHistoryService = app.get(MessageHistoryService);
    const firstMessage = createMessage('message-1');
    const secondMessage = createMessage('message-2');

    await messageHistoryService.saveMessage(firstMessage);
    await messageHistoryService.saveMessage(secondMessage);

    const response = await fetch(`${serverUrl}/messages/recent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await expect(response.json()).resolves.toEqual({
      messages: expect.arrayContaining([firstMessage, secondMessage]),
    });
    expect(response.status).toBe(200);
  });

  it('rejects missing and invalid JWTs', async () => {
    const missingTokenResponse = await fetch(`${serverUrl}/messages/recent`);
    const invalidTokenResponse = await fetch(`${serverUrl}/messages/recent`, {
      headers: {
        Authorization: 'Bearer not-a-jwt',
      },
    });

    expect(missingTokenResponse.status).toBe(401);
    expect(invalidTokenResponse.status).toBe(401);
  });
});
