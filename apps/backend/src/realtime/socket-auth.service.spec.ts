import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';
import { jwtModuleOptions } from '../auth/jwt.config';
import { SocketAuthService } from './socket-auth.service';

function createClient(token?: string): Socket {
  return {
    data: {},
    handshake: {
      auth: token ? { token } : {},
      headers: {},
      query: {},
    },
  } as Socket;
}

describe('SocketAuthService', () => {
  const jwtService = new JwtService(jwtModuleOptions);
  const service = new SocketAuthService(jwtService);

  it('extracts tokens from Socket.IO auth payloads', () => {
    expect(
      service.extractToken({
        auth: { token: 'auth-token' },
        headers: {},
        query: {},
      }),
    ).toBe('auth-token');
  });

  it('extracts bearer tokens from authorization headers', () => {
    expect(
      service.extractToken({
        auth: {},
        headers: { authorization: 'Bearer header-token' },
        query: {},
      }),
    ).toBe('header-token');
  });

  it('validates a JWT issued with the login signing config', () => {
    const token = jwtService.sign({ sub: 'demo-user', username: 'demo' });
    const client = createClient(token);

    expect(service.validateClient(client)).toEqual({
      id: 'demo-user',
      username: 'demo',
    });
    expect(client.data.user).toEqual({
      id: 'demo-user',
      username: 'demo',
    });
  });

  it('rejects missing tokens', () => {
    expect(() => service.validateClient(createClient())).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects invalid tokens', () => {
    expect(() => service.validateClient(createClient('not-a-jwt'))).toThrow(
      UnauthorizedException,
    );
  });
});
