export const MESSAGE_EVENT = 'message';

export type SendMessagePayload = {
  text?: unknown;
  timestamp?: unknown;
};

export type ChatMessage = {
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
