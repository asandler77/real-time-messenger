export const MESSAGE_EVENT = 'message';
export const MAX_MESSAGE_TEXT_LENGTH = 500;
export const MESSAGE_TEXT_REQUIRED_ERROR = 'Message text is required.';
export const MESSAGE_TEXT_TOO_LONG_ERROR =
  'Message text must be 500 characters or less.';

export type SendMessagePayload = {
  text?: unknown;
  timestamp?: unknown;
};

export type ChatMessage = {
  clientId: string;
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  username: string;
};

export type SendMessageAck =
  | {
      ok: true;
      message: ChatMessage;
    }
  | {
      ok: false;
      error: string;
    };
