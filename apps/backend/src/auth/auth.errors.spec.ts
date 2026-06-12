import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AddressInfo } from 'net';
import { AppModule } from '../app.module';

describe('Auth error responses', () => {
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
