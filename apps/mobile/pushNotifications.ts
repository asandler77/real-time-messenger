import {PermissionsAndroid, Platform} from 'react-native';
import {AUTH_BASE_URL} from './auth';
import {loadRecentMessages} from './messages';
import type {ChatMessage} from './socket';

export type PushRegistrationStatus =
  | 'denied'
  | 'failed'
  | 'registered'
  | 'unavailable';

export type PushTokenProvider = {
  getToken: () => Promise<string | null>;
  onNotificationTap?: (handler: () => void) => () => void;
  onTokenRefresh?: (handler: (deviceToken: string) => void) => () => void;
};

export type PushRegistrationResult = {
  status: PushRegistrationStatus;
  unsubscribe?: () => void;
};

const defaultPushTokenProvider: PushTokenProvider = {
  getToken: async () => null,
};

type LoadHistory = (accessToken: string) => Promise<ChatMessage[]>;

export async function configurePushNotificationsAfterLogin(
  accessToken: string,
  {
    baseUrl = AUTH_BASE_URL,
    onNotificationTap,
    provider = defaultPushTokenProvider,
    requestPermission = requestAndroidNotificationPermission,
  }: {
    baseUrl?: string;
    onNotificationTap?: () => void;
    provider?: PushTokenProvider;
    requestPermission?: () => Promise<boolean>;
  } = {},
): Promise<PushRegistrationResult> {
  const hasPermission = await requestPermission();

  if (!hasPermission) {
    return {status: 'denied'};
  }

  const deviceToken = await provider.getToken();

  if (!deviceToken) {
    return {status: 'unavailable'};
  }

  try {
    await registerDeviceToken(accessToken, deviceToken, baseUrl);
  } catch {
    return {status: 'failed'};
  }

  const unsubscribeFromRefresh = provider.onTokenRefresh?.(nextDeviceToken => {
    void registerDeviceToken(accessToken, nextDeviceToken, baseUrl).catch(() => {
      // Token refresh should not break the authenticated chat flow.
    });
  });
  const unsubscribeFromTap = provider.onNotificationTap?.(() => {
    onNotificationTap?.();
  });

  return {
    status: 'registered',
    unsubscribe: combineUnsubscribers(unsubscribeFromRefresh, unsubscribeFromTap),
  };
}

export async function requestAndroidNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  const androidVersion =
    typeof Platform.Version === 'number'
      ? Platform.Version
      : Number.parseInt(String(Platform.Version), 10);

  if (androidVersion < 33) {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

  if (!permission) {
    return false;
  }

  const result = await PermissionsAndroid.request(permission);

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function registerDeviceToken(
  accessToken: string,
  deviceToken: string,
  baseUrl = AUTH_BASE_URL,
): Promise<void> {
  const response = await fetch(`${baseUrl}/push/device-token`, {
    body: JSON.stringify({
      deviceToken,
      platform: 'android',
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Cannot register push notifications.');
  }
}

export async function reloadHistoryFromNotificationTap(
  accessToken: string,
  loadHistory: LoadHistory = loadRecentMessages,
): Promise<ChatMessage[]> {
  return loadHistory(accessToken);
}

function combineUnsubscribers(
  ...unsubscribers: Array<(() => void) | undefined>
): (() => void) | undefined {
  const activeUnsubscribers = unsubscribers.filter(
    (unsubscribe): unsubscribe is () => void => Boolean(unsubscribe),
  );

  if (activeUnsubscribers.length === 0) {
    return undefined;
  }

  return () => {
    activeUnsubscribers.forEach(unsubscribe => unsubscribe());
  };
}
