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
  MAX_MESSAGE_TEXT_LENGTH,
  MESSAGE_EVENT,
  MESSAGE_TEXT_REQUIRED_ERROR,
  MESSAGE_TEXT_TOO_LONG_ERROR,
  type ChatMessage,
  type SendMessageAck,
  type SendMessagePayload,
} from './message.types';
import { MessageHistoryService } from './message-history.service';
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

  constructor(
    private readonly socketAuthService: SocketAuthService,
    private readonly messageHistoryService: MessageHistoryService,
  ) {}

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
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ): Promise<SendMessageAck> {
    const validationResult = this.validateMessageText(payload);

    if (!validationResult.ok) {
      return {
        ok: false,
        error: validationResult.error,
      };
    }

    const timestamp = this.validateTimestamp(payload);
    const user = this.getSocketUser(client);
    const message: ChatMessage = {
      clientId: client.id,
      id: `${client.id}-${Date.now()}`,
      text: validationResult.text,
      timestamp,
      userId: user.id,
      username: user.username,
    };

    const persistedMessage =
      await this.messageHistoryService.saveMessage(message);

    this.server.emit(MESSAGE_EVENT, persistedMessage);

    return {
      ok: true,
      message: persistedMessage,
    };
  }

  private validateMessageText(
    payload: SendMessagePayload,
  ):
    | {
        ok: true;
        text: string;
      }
    | {
        ok: false;
        error: string;
      } {
    if (!payload || typeof payload.text !== 'string' || !payload.text.trim()) {
      return {
        ok: false,
        error: MESSAGE_TEXT_REQUIRED_ERROR,
      };
    }

    const text = payload.text.trim();

    if (text.length > MAX_MESSAGE_TEXT_LENGTH) {
      return {
        ok: false,
        error: MESSAGE_TEXT_TOO_LONG_ERROR,
      };
    }

    return {
      ok: true,
      text,
    };
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
