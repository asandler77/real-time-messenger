import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { invalidCredentialsError } from './auth.errors';
import type { AuthenticatedUser, JwtAccessPayload } from './auth.types';
import { LoginRequestDto } from './dto/login-request.dto';

type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer';
  userId: string;
  username: string;
};

type DemoUser = {
  id: string;
  password: string;
  username: string;
};

@Injectable()
export class AuthService {
  private readonly demoUsers: DemoUser[] = [
    {
      id: 'demo-user',
      password: 'demo',
      username: 'demo',
    },
    {
      id: 'demo1-user',
      password: 'demo1',
      username: 'demo1',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  login(credentials: LoginRequestDto | undefined): LoginResult {
    const user = this.findDemoUser(credentials);

    if (!user) {
      throw new UnauthorizedException(invalidCredentialsError);
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      userId: user.id,
      username: user.username,
    };
  }

  validateAccessToken(token: string | null | undefined): AuthenticatedUser {
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = this.jwtService.verify<JwtAccessPayload>(token);

      if (!payload.sub || !payload.username) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      return {
        id: payload.sub,
        username: payload.username,
      };
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private findDemoUser(
    credentials: LoginRequestDto | undefined,
  ): DemoUser | null {
    if (!credentials) {
      return null;
    }

    return (
      this.demoUsers.find(
        user =>
          credentials.username === user.username &&
          credentials.password === user.password,
      ) ?? null
    );
  }
}
