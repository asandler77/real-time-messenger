import {login} from '../auth';

const fetchMock = jest.fn();

global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
});

test('login posts credentials and returns the access token', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce({
      accessToken: 'demo-jwt',
      tokenType: 'Bearer',
      userId: 'demo-user',
      username: 'demo',
    }),
  });

  await expect(login({username: 'demo', password: 'demo'})).resolves.toEqual({
    accessToken: 'demo-jwt',
    userId: 'demo-user',
    username: 'demo',
  });

  expect(fetchMock).toHaveBeenCalledWith(
    'http://10.0.2.2:3000/auth/login',
    {
      body: JSON.stringify({username: 'demo', password: 'demo'}),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );
});

test('login rejects unauthorized responses', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: jest.fn(),
  });

  await expect(login({username: 'bad', password: 'bad'})).rejects.toThrow(
    'Invalid username or password.',
  );
});

test('login maps backend availability errors to user-facing language', async () => {
  fetchMock.mockRejectedValueOnce(new Error('network down'));

  await expect(login({username: 'demo', password: 'demo'})).rejects.toThrow(
    'Cannot reach backend. Check that the server is running.',
  );
});

test('login maps unexpected backend errors to a generic message', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: jest.fn(),
  });

  await expect(login({username: 'demo', password: 'demo'})).rejects.toThrow(
    'Login failed. Try again.',
  );
});
