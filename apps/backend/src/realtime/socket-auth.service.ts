import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';
import type {
  AuthenticatedSocketData,
  JwtSocketPayload,
  SocketUser,
} from './socket-auth.types';

type SocketWithAuthData = Socket & {
  data: AuthenticatedSocketData;
};

@Injectable()
export class SocketAuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateClient(client: Socket): SocketUser {
    const token = this.extractToken(client.handshake);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = this.jwtService.verify<JwtSocketPayload>(token);
      const user = this.createSocketUser(payload);

      (client as SocketWithAuthData).data.user = user;

      return user;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
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

  private createSocketUser(payload: JwtSocketPayload): SocketUser {
    if (!payload.sub || !payload.username) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return {
      id: payload.sub,
      username: payload.username,
    };
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
