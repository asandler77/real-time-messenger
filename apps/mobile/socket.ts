import {io, type Socket} from 'socket.io-client';
import {AUTH_BASE_URL} from './auth';

export const SOCKET_SERVER_URL = AUTH_BASE_URL;

export type SocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export const MESSAGE_EVENT = 'message';

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

export type MessengerSocket = Pick<
  Socket,
  'connect' | 'connected' | 'disconnect' | 'emit' | 'id' | 'off' | 'on'
>;

type SocketStatusHandlers = {
  onConnected: () => void;
  onDisconnected: () => void;
  onError: () => void;
};

export function createMessengerSocket(
  accessToken: string,
  serverUrl = SOCKET_SERVER_URL,
): Socket {
  if (!accessToken) {
    throw new Error('A JWT access token is required to connect');
  }

  return io(serverUrl, {
    auth: {
      token: accessToken,
    },
    autoConnect: false,
    reconnection: true,
    transports: ['websocket'],
  });
}

export function registerSocketStatusHandlers(
  socket: MessengerSocket,
  handlers: SocketStatusHandlers,
): () => void {
  socket.on('connect', handlers.onConnected);
  socket.on('disconnect', handlers.onDisconnected);
  socket.on('connect_error', handlers.onError);

  return () => {
    socket.off('connect', handlers.onConnected);
    socket.off('disconnect', handlers.onDisconnected);
    socket.off('connect_error', handlers.onError);
  };
}

export function registerMessageHandler(
  socket: MessengerSocket,
  onMessage: (message: ChatMessage) => void,
): () => void {
  socket.on(MESSAGE_EVENT, onMessage);

  return () => {
    socket.off(MESSAGE_EVENT, onMessage);
  };
}

export function sendChatMessage(
  socket: MessengerSocket,
  text: string,
): Promise<ChatMessage> {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return Promise.reject(new Error('Message text is required'));
  }

  if (!socket.connected) {
    return Promise.reject(new Error('Socket is disconnected'));
  }

  return new Promise((resolve, reject) => {
    socket.emit(
      MESSAGE_EVENT,
      {
        text: trimmedText,
        timestamp: new Date().toISOString(),
      },
      (acknowledgement: SendMessageAck | undefined) => {
        if (acknowledgement?.ok) {
          resolve(acknowledgement.message);
          return;
        }

        reject(
          new Error(acknowledgement?.error || 'Message could not be sent'),
        );
      },
    );
  });
}
