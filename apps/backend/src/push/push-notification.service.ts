import { Inject, Injectable } from '@nestjs/common';
import { ConnectedUserTrackerService } from './connected-user-tracker.service';
import { DeviceTokenStoreService } from './device-token-store.service';
import type {
  NewMessageForPush,
  NewMessagePushPayload,
  PushRecipient,
  PushTransport,
} from './push.types';

export const PUSH_TRANSPORT = Symbol('PUSH_TRANSPORT');

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly deviceTokenStore: DeviceTokenStoreService,
    private readonly connectedUserTracker: ConnectedUserTrackerService,
    @Inject(PUSH_TRANSPORT)
    private readonly pushTransport: PushTransport,
  ) {}

  async dispatchNewMessageAlert(message: NewMessageForPush): Promise<void> {
    const recipients = await this.selectRecipients(message.userId);
    const payload: NewMessagePushPayload = {
      messageId: message.id,
      senderId: message.userId,
      senderUsername: message.username,
      type: 'new-message',
    };

    await Promise.all(
      recipients.map(recipient =>
        this.pushTransport.sendNewMessageAlert(recipient, payload),
      ),
    );
  }

  async selectRecipients(senderUserId: string): Promise<PushRecipient[]> {
    const recipients = await this.deviceTokenStore.listPushRecipients();

    return recipients.filter(
      recipient =>
        recipient.userId !== senderUserId &&
        !this.connectedUserTracker.isConnected(recipient.userId),
    );
  }
}
