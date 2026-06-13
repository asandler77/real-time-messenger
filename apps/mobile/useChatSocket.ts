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
import {loadRecentMessages} from './messages';

type CreateSocket = (accessToken: string) => MessengerSocket;
type LoadHistory = (accessToken: string) => Promise<ChatMessage[]>;

export type ChatSocketState = {
  clientId: string;
  error: string;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<boolean>;
  status: SocketConnectionStatus;
};

export function useChatSocket(
  accessToken: string,
  createSocket: CreateSocket = createMessengerSocket,
  loadHistory: LoadHistory = loadRecentMessages,
): ChatSocketState {
  const [status, setStatus] = useState<SocketConnectionStatus>('connecting');
  const [clientId, setClientId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');
  const socketRef = useRef<MessengerSocket | null>(null);

  useEffect(() => {
    const socket = createSocket(accessToken);
    socketRef.current = socket;
    setStatus('connecting');
    void loadHistory(accessToken)
      .then(historyMessages => {
        if (historyMessages.length === 0) {
          return;
        }

        setMessages(currentMessages =>
          mergeMessages(historyMessages, currentMessages),
        );
      })
      .catch(() => {
        setError('Cannot load message history.');
      });

    const removeStatusHandlers = registerSocketStatusHandlers(socket, {
      onConnected: () => {
        setStatus('connected');
        setClientId(socket.id ?? '');
        setError('');
      },
      onDisconnected: () => {
        setStatus('disconnected');
        setClientId('');
        setError('Chat is disconnected. Reconnect before sending.');
      },
      onError: () => {
        setStatus('error');
        setClientId('');
        setError('Cannot connect to chat server.');
      },
    });
    const removeMessageHandler = registerMessageHandler(socket, message => {
      setMessages(currentMessages => appendMessage(currentMessages, message));
    });

    socket.connect();

    return () => {
      removeMessageHandler();
      removeStatusHandlers();
      socket.disconnect();
      socketRef.current = null;
      setClientId('');
    };
  }, [accessToken, createSocket, loadHistory]);

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
    clientId,
    error,
    messages,
    sendMessage,
    status,
  };
}

function appendMessage(
  currentMessages: ChatMessage[],
  message: ChatMessage,
): ChatMessage[] {
  if (currentMessages.some(currentMessage => currentMessage.id === message.id)) {
    return currentMessages;
  }

  return [...currentMessages, message];
}

function mergeMessages(
  historyMessages: ChatMessage[],
  currentMessages: ChatMessage[],
): ChatMessage[] {
  return currentMessages.reduce(
    (mergedMessages, currentMessage) =>
      appendMessage(mergedMessages, currentMessage),
    historyMessages,
  );
}
