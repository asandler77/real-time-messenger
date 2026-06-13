import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AddressInfo } from 'net';
import { AppModule } from '../app.module';

describe('Auth responses', () => {
  let app: INestApplication;
  let serverUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address() as AddressInfo;
    serverUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    {
      credentials: { username: 'demo', password: 'demo' },
      expectedUser: { userId: 'demo-user', username: 'demo' },
    },
    {
      credentials: { username: 'demo1', password: 'demo1' },
      expectedUser: { userId: 'demo1-user', username: 'demo1' },
    },
  ])('logs in $credentials.username', async ({ credentials, expectedUser }) => {
    const response = await fetch(`${serverUrl}/auth/login`, {
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    await expect(response.json()).resolves.toEqual({
      accessToken: expect.any(String),
      tokenType: 'Bearer',
      ...expectedUser,
    });
    expect(response.status).toBe(201);
  });

  it('returns a consistent error for invalid login credentials', async () => {
    const response = await fetch(`${serverUrl}/auth/login`, {
      body: JSON.stringify({ username: 'bad', password: 'bad' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    await expect(response.json()).resolves.toEqual({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
    });
    expect(response.status).toBe(401);
  });
});
