import type { ChatMessage } from '../realtime/message.types';

export type DevicePlatform = 'android';

export type DeviceTokenRecord = {
  deviceToken: string;
  platform: DevicePlatform;
  updatedAt: string;
  userId: string;
  username: string;
};

export type RegisterDeviceTokenInput = {
  deviceToken?: unknown;
  platform?: unknown;
};

export type PushRecipient = {
  deviceToken: string;
  platform: DevicePlatform;
  userId: string;
};

export type NewMessagePushPayload = {
  messageId: string;
  senderId: string;
  senderUsername: string;
  type: 'new-message';
};

export type PushTransport = {
  sendNewMessageAlert(
    recipient: PushRecipient,
    payload: NewMessagePushPayload,
  ): Promise<void>;
};

export type NewMessageForPush = Pick<
  ChatMessage,
  'id' | 'userId' | 'username'
>;
