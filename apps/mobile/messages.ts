import {AUTH_BASE_URL} from './auth';
import type {ChatMessage} from './socket';

type RecentMessagesResponse = {
  messages?: unknown;
};

export async function loadRecentMessages(
  accessToken: string,
  baseUrl = AUTH_BASE_URL,
): Promise<ChatMessage[]> {
  let response: Response;

  try {
    response = await fetch(`${baseUrl}/messages/recent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    throw new Error('Cannot load message history.');
  }

  if (!response.ok) {
    throw new Error('Cannot load message history.');
  }

  const data = (await response.json()) as RecentMessagesResponse;

  if (!Array.isArray(data.messages)) {
    throw new Error('Cannot load message history.');
  }

  return data.messages.filter(isChatMessage);
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ChatMessage>;

  return (
    typeof candidate.clientId === 'string' &&
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.timestamp === 'string' &&
    typeof candidate.userId === 'string' &&
    typeof candidate.username === 'string'
  );
}
