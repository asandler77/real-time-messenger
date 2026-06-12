import {useEffect, useState} from 'react';
import {
  createMessengerSocket,
  registerSocketStatusHandlers,
  type MessengerSocket,
  type SocketConnectionStatus,
} from './socket';

type CreateSocket = (accessToken: string) => MessengerSocket;

export function useSocketConnection(
  accessToken: string | null,
  createSocket: CreateSocket = createMessengerSocket,
): SocketConnectionStatus {
  const [status, setStatus] = useState<SocketConnectionStatus>('idle');

  useEffect(() => {
    if (!accessToken) {
      setStatus('idle');
      return undefined;
    }

    const socket = createSocket(accessToken);

    setStatus('connecting');

    const removeStatusHandlers = registerSocketStatusHandlers(socket, {
      onConnected: () => setStatus('connected'),
      onDisconnected: () => setStatus('disconnected'),
      onError: () => setStatus('error'),
    });

    socket.connect();

    return () => {
      removeStatusHandlers();
      socket.disconnect();
    };
  }, [accessToken, createSocket]);

  return status;
}
