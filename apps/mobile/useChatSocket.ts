import {useCallback, useEffect, useRef, useState} from 'react';
import {
  createMessengerSocket,
  registerMessageHandler,
  registerSocketStatusHandlers,
  sendChatMessage,
  type ChatMessage,
  type MessengerSocket,
  type SocketConnectionStatus,
} from './socket';

type CreateSocket = (accessToken: string) => MessengerSocket;

export type ChatSocketState = {
  error: string;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<boolean>;
  status: SocketConnectionStatus;
};

export function useChatSocket(
  accessToken: string,
  createSocket: CreateSocket = createMessengerSocket,
): ChatSocketState {
  const [status, setStatus] = useState<SocketConnectionStatus>('connecting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');
  const socketRef = useRef<MessengerSocket | null>(null);

  useEffect(() => {
    const socket = createSocket(accessToken);
    socketRef.current = socket;
    setStatus('connecting');

    const removeStatusHandlers = registerSocketStatusHandlers(socket, {
      onConnected: () => {
        setStatus('connected');
        setError('');
      },
      onDisconnected: () => {
        setStatus('disconnected');
        setError('Chat is disconnected. Reconnect before sending.');
      },
      onError: () => {
        setStatus('error');
        setError('Cannot connect to chat server.');
      },
    });
    const removeMessageHandler = registerMessageHandler(socket, message => {
      setMessages(currentMessages => [...currentMessages, message]);
    });

    socket.connect();

    return () => {
      removeMessageHandler();
      removeStatusHandlers();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, createSocket]);

  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text.trim()) {
        return false;
      }

      const socket = socketRef.current;

      if (!socket || status !== 'connected' || !socket.connected) {
        setError('Chat is disconnected. Reconnect before sending.');
        return false;
      }

      try {
        setError('');
        await sendChatMessage(socket, text);
        return true;
      } catch {
        setError('Message could not be sent. Try again.');
        return false;
      }
    },
    [status],
  );

  return {
    error,
    messages,
    sendMessage,
    status,
  };
}
