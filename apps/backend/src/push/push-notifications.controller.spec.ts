import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import request = require('supertest');
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { DEVICE_TOKEN_STORE_FILE } from './device-token-store.constants';
import { DeviceTokenStoreService } from './device-token-store.service';

describe('PushNotificationsController', () => {
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;
  let temporaryDirectory: string;
  let accessToken: string;

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'push-api-'));

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DEVICE_TOKEN_STORE_FILE)
      .useValue(join(temporaryDirectory, 'device-tokens.json'))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    accessToken = app
      .get(AuthService)
      .login({ username: 'demo', password: 'demo' }).accessToken;
  });

  afterEach(async () => {
    await app.close();
    await rm(temporaryDirectory, { force: true, recursive: true });
  });

  it('registers and updates the authenticated Android device token', async () => {
    const firstResponse = await registerDeviceToken('android-token-1').expect(201);
    const secondResponse = await registerDeviceToken('android-token-2').expect(201);

    expect(firstResponse.body).toEqual({ ok: true });
    expect(secondResponse.body).toEqual({ ok: true });
    await expect(app.get(DeviceTokenStoreService).listRecords()).resolves.toEqual([
      expect.objectContaining({
        deviceToken: 'android-token-2',
        platform: 'android',
        userId: 'demo-user',
        username: 'demo',
      }),
    ]);
  });

  it.each([
    {
      authorization: undefined,
      expectedMessage: 'Missing authentication token',
      name: 'missing JWT',
    },
    {
      authorization: 'Token not-bearer',
      expectedMessage: 'Missing authentication token',
      name: 'malformed authorization header',
    },
    {
      authorization: 'Bearer not-a-jwt',
      expectedMessage: 'Invalid authentication token',
      name: 'invalid JWT',
    },
  ])('rejects $name', async ({ authorization, expectedMessage }) => {
    const response = request(httpServer)
      .post('/push/device-token')
      .send({ deviceToken: 'android-token' });

    if (authorization) {
      response.set('Authorization', authorization);
    }

    const result = await response.expect(401);

    expect(result.body).toEqual({
      error: 'Unauthorized',
      message: expectedMessage,
      statusCode: 401,
    });
  });

  it('rejects invalid token payloads with a valid JWT', async () => {
    const response = await request(httpServer)
      .post('/push/device-token')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ deviceToken: '   ' })
      .expect(400);

    expect(response.body).toEqual({
      error: 'Bad Request',
      message: 'Device token is required.',
      statusCode: 400,
    });
  });

  function registerDeviceToken(deviceToken: string): request.Test {
    return request(httpServer)
      .post('/push/device-token')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ deviceToken, platform: 'android' });
  }
});
