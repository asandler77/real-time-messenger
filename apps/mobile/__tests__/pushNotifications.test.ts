import {
  configurePushNotificationsAfterLogin,
  registerDeviceToken,
  reloadHistoryFromNotificationTap,
  type PushTokenProvider,
} from '../pushNotifications';

const fetchMock = jest.fn();

global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
});

test('registerDeviceToken submits the Android token to the protected backend endpoint', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
  });

  await expect(
    registerDeviceToken('demo-jwt', 'android-token'),
  ).resolves.toBeUndefined();

  expect(fetchMock).toHaveBeenCalledWith(
    'http://10.0.2.2:3000/push/device-token',
    {
      body: JSON.stringify({
        deviceToken: 'android-token',
        platform: 'android',
      }),
      headers: {
        Authorization: 'Bearer demo-jwt',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );
});

test('configurePushNotificationsAfterLogin handles permission denial gracefully', async () => {
  const provider = {
    getToken: jest.fn(),
  };

  await expect(
    configurePushNotificationsAfterLogin('demo-jwt', {
      provider,
      requestPermission: () => Promise.resolve(false),
    }),
  ).resolves.toEqual({status: 'denied'});

  expect(provider.getToken).not.toHaveBeenCalled();
  expect(fetchMock).not.toHaveBeenCalled();
});

test('configurePushNotificationsAfterLogin handles unavailable native token provider', async () => {
  await expect(
    configurePushNotificationsAfterLogin('demo-jwt', {
      provider: {
        getToken: jest.fn().mockResolvedValueOnce(null),
      },
      requestPermission: () => Promise.resolve(true),
    }),
  ).resolves.toEqual({status: 'unavailable'});

  expect(fetchMock).not.toHaveBeenCalled();
});

test('configurePushNotificationsAfterLogin registers token refresh and tap handlers', async () => {
  let refreshHandler: ((deviceToken: string) => void) | undefined;
  let tapHandler: (() => void) | undefined;
  const unsubscribeRefresh = jest.fn();
  const unsubscribeTap = jest.fn();
  const onNotificationTap = jest.fn();
  const provider: PushTokenProvider = {
    getToken: jest.fn().mockResolvedValueOnce('android-token-1'),
    onNotificationTap: handler => {
      tapHandler = handler;
      return unsubscribeTap;
    },
    onTokenRefresh: handler => {
      refreshHandler = handler;
      return unsubscribeRefresh;
    },
  };
  fetchMock.mockResolvedValue({
    ok: true,
  });

  const result = await configurePushNotificationsAfterLogin('demo-jwt', {
    onNotificationTap,
    provider,
    requestPermission: () => Promise.resolve(true),
  });

  expect(result.status).toBe('registered');
  expect(fetchMock).toHaveBeenCalledTimes(1);

  refreshHandler?.('android-token-2');
  await Promise.resolve();
  (tapHandler as ((payload: unknown) => void) | undefined)?.({
    body: 'Sensitive message preview',
    jwt: 'header.payload.signature',
  });
  result.unsubscribe?.();

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenLastCalledWith(
    'http://10.0.2.2:3000/push/device-token',
    expect.objectContaining({
      body: JSON.stringify({
        deviceToken: 'android-token-2',
        platform: 'android',
      }),
    }),
  );
  expect(onNotificationTap).toHaveBeenCalledTimes(1);
  expect(onNotificationTap).toHaveBeenCalledWith();
  expect(unsubscribeRefresh).toHaveBeenCalledTimes(1);
  expect(unsubscribeTap).toHaveBeenCalledTimes(1);
});

test('registerDeviceToken maps unauthorized registration to a safe error', async () => {
  const jwt = 'header.payload.signature';
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: jest.fn().mockResolvedValueOnce({
      message: `Unauthorized token ${jwt}`,
    }),
  });

  await registerDeviceToken(jwt, 'android-token').catch(error => {
    expect(error).toEqual(new Error('Cannot register push notifications.'));
    expect(error.message).not.toContain(jwt);
    expect(error.message).not.toContain('android-token');
  });
});

test('configurePushNotificationsAfterLogin reports backend registration failure', async () => {
  const jwt = 'header.payload.signature';
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: jest.fn().mockResolvedValueOnce({
      message: `Unauthorized token ${jwt}`,
    }),
  });

  await expect(
    configurePushNotificationsAfterLogin(jwt, {
      provider: {
        getToken: jest.fn().mockResolvedValueOnce('android-token'),
      },
      requestPermission: () => Promise.resolve(true),
    }),
  ).resolves.toEqual({status: 'failed'});
});

test('reloadHistoryFromNotificationTap delegates to recent history loading', async () => {
  const messages = [
    {
      clientId: 'socket-1',
      id: 'message-1',
      text: 'Persisted message',
      timestamp: '2026-06-12T12:00:00.000Z',
      userId: 'demo-user',
      username: 'demo',
    },
  ];
  const loadHistory = jest.fn().mockResolvedValueOnce(messages);

  await expect(
    reloadHistoryFromNotificationTap('demo-jwt', loadHistory),
  ).resolves.toEqual(messages);
  expect(loadHistory).toHaveBeenCalledWith('demo-jwt');
});
