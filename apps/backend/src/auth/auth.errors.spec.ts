import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../app.module';

describe('Auth responses', () => {
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
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
    const response = await request(httpServer)
      .post('/auth/login')
      .send(credentials)
      .expect(201);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
      tokenType: 'Bearer',
      ...expectedUser,
    });
  });

  it('returns a consistent error for invalid login credentials', async () => {
    const response = await request(httpServer)
      .post('/auth/login')
      .send({ username: 'bad', password: 'bad' })
      .expect(401);

    expect(response.body).toEqual({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
    });
  });
});
