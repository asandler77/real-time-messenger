import {loadRecentMessages} from '../messages';

const fetchMock = jest.fn();

global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
});

test('loadRecentMessages fetches persisted history with the access token', async () => {
  const messages = [
    {
      clientId: 'socket-1',
      id: 'message-1',
      text: 'Persisted hello',
      timestamp: '2026-06-12T12:00:00.000Z',
      userId: 'demo-user',
      username: 'demo',
    },
  ];

  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce({messages}),
  });

  await expect(loadRecentMessages('demo-jwt')).resolves.toEqual(messages);
  expect(fetchMock).toHaveBeenCalledWith(
    'http://10.0.2.2:3000/messages/recent',
    {
      headers: {
        Authorization: 'Bearer demo-jwt',
      },
    },
  );
});

test('loadRecentMessages maps backend and network failures', async () => {
  const jwt = 'header.payload.signature';
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: jest.fn(),
  });

  await loadRecentMessages(jwt).catch(error => {
    expect(error).toEqual(new Error('Cannot load message history.'));
    expect(error.message).not.toContain(jwt);
  });

  fetchMock.mockRejectedValueOnce(new Error('network down'));

  await expect(loadRecentMessages('demo-jwt')).rejects.toThrow(
    'Cannot load message history.',
  );
});
