import { ConnectedUserTrackerService } from './connected-user-tracker.service';
import { DeviceTokenStoreService } from './device-token-store.service';
import { PushNotificationService } from './push-notification.service';
import type { PushTransport } from './push.types';

describe('PushNotificationService', () => {
  it('selects registered recipients other than sender who are not connected', async () => {
    const deviceTokenStore = {
      listPushRecipients: jest.fn().mockResolvedValue([
        {
          deviceToken: 'sender-token',
          platform: 'android',
          userId: 'demo-user',
        },
        {
          deviceToken: 'connected-token',
          platform: 'android',
          userId: 'demo1-user',
        },
        {
          deviceToken: 'offline-token',
          platform: 'android',
          userId: 'offline-user',
        },
      ]),
    } as unknown as DeviceTokenStoreService;
    const connectedUserTracker = new ConnectedUserTrackerService();
    const pushTransport = {
      sendNewMessageAlert: jest.fn(),
    } as PushTransport;
    const service = new PushNotificationService(
      deviceTokenStore,
      connectedUserTracker,
      pushTransport,
    );

    connectedUserTracker.markConnected('demo1-user', 'socket-1');

    await expect(service.selectRecipients('demo-user')).resolves.toEqual([
      {
        deviceToken: 'offline-token',
        platform: 'android',
        userId: 'offline-user',
      },
    ]);
  });

  it('dispatches minimal new-message metadata without message text', async () => {
    const deviceTokenStore = {
      listPushRecipients: jest.fn().mockResolvedValue([
        {
          deviceToken: 'offline-token',
          platform: 'android',
          userId: 'offline-user',
        },
      ]),
    } as unknown as DeviceTokenStoreService;
    const pushTransport = {
      sendNewMessageAlert: jest.fn().mockResolvedValue(undefined),
    } as PushTransport;
    const service = new PushNotificationService(
      deviceTokenStore,
      new ConnectedUserTrackerService(),
      pushTransport,
    );

    await service.dispatchNewMessageAlert({
      id: 'message-1',
      userId: 'demo-user',
      username: 'demo',
    });

    expect(pushTransport.sendNewMessageAlert).toHaveBeenCalledWith(
      {
        deviceToken: 'offline-token',
        platform: 'android',
        userId: 'offline-user',
      },
      {
        messageId: 'message-1',
        senderId: 'demo-user',
        senderUsername: 'demo',
        type: 'new-message',
      },
    );
    expect(pushTransport.sendNewMessageAlert).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ text: expect.anything() }),
    );
  });
});
