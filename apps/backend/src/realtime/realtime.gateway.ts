import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import {
  MESSAGE_EVENT,
  type ChatMessage,
  type SendMessageAck,
  type SendMessagePayload,
} from './message.types';
import { SocketAuthService } from './socket-auth.service';
import type { AuthenticatedSocketData, SocketUser } from './socket-auth.types';

@WebSocketGateway({
  cors: {
    origin: true,
  },
  transports: ['websocket'],
})
export class RealtimeGateway implements OnGatewayInit {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  private server!: Server;

  constructor(private readonly socketAuthService: SocketAuthService) {}

  afterInit(server: Server): void {
    server.use((socket, next) => {
      try {
        this.socketAuthService.validateClient(socket);
        next();
      } catch {
        this.logger.warn('Rejected unauthenticated WebSocket connection');
        next(new Error('Unauthorized'));
      }
    });
  }

  @SubscribeMessage(MESSAGE_EVENT)
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ): SendMessageAck {
    const text = this.readMessageText(payload);

    if (!text) {
      return {
        ok: false,
        error: 'Message text is required.',
      };
    }

    const timestamp = this.validateTimestamp(payload);
    const user = this.getSocketUser(client);
    const message: ChatMessage = {
      id: `${client.id}-${Date.now()}`,
      text,
      timestamp,
      userId: user.id,
      username: user.username,
    };

    this.server.emit(MESSAGE_EVENT, message);

    return {
      ok: true,
      message,
    };
  }

  private readMessageText(payload: SendMessagePayload): string | null {
    if (!payload || typeof payload.text !== 'string' || !payload.text.trim()) {
      return null;
    }

    return payload.text.trim();
  }

  private validateTimestamp(payload: SendMessagePayload): string {
    if (typeof payload.timestamp === 'string' && payload.timestamp.trim()) {
      return payload.timestamp;
    }

    return new Date().toISOString();
  }

  private getSocketUser(client: Socket): SocketUser {
    const data = client.data as AuthenticatedSocketData;

    if (!data.user) {
      throw new WsException('WebSocket client is not authenticated');
    }

    return data.user;
  }
}
