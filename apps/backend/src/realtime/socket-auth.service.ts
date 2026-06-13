import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import type {
  AuthenticatedSocketData,
  SocketUser,
} from './socket-auth.types';

type SocketWithAuthData = Socket & {
  data: AuthenticatedSocketData;
};

@Injectable()
export class SocketAuthService {
  constructor(private readonly authService: AuthService) {}

  validateClient(client: Socket): SocketUser {
    const token = this.extractToken(client.handshake);

    const user = this.authService.validateAccessToken(token);

    (client as SocketWithAuthData).data.user = user;

    return user;
  }

  extractToken(
    handshake: Pick<Socket['handshake'], 'auth' | 'headers' | 'query'>,
  ): string | null {
    const authToken = this.readSingleValue(handshake.auth?.token);

    if (authToken) {
      return authToken;
    }

    const headerValue = this.readSingleValue(handshake.headers.authorization);

    if (headerValue?.startsWith('Bearer ')) {
      return headerValue.slice('Bearer '.length);
    }

    return this.readSingleValue(handshake.query.token);
  }

  private readSingleValue(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) {
      return value[0];
    }

    return null;
  }
}
