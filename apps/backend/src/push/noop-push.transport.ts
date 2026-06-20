import { Injectable } from '@nestjs/common';
import type {
  NewMessagePushPayload,
  PushRecipient,
  PushTransport,
} from './push.types';

@Injectable()
export class NoopPushTransport implements PushTransport {
  async sendNewMessageAlert(
    _recipient: PushRecipient,
    _payload: NewMessagePushPayload,
  ): Promise<void> {
    // Local MVP boundary for Firebase Cloud Messaging HTTP v1/server SDK wiring.
  }
}
