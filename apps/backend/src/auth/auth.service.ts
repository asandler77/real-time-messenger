import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { invalidCredentialsError } from './auth.errors';
import { LoginRequestDto } from './dto/login-request.dto';

type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer';
};

@Injectable()
export class AuthService {
  private readonly demoUser = {
    id: 'demo-user',
    username: 'demo',
    password: 'demo',
  };

  constructor(private readonly jwtService: JwtService) {}

  login(credentials: LoginRequestDto | undefined): LoginResult {
    if (
      !credentials ||
      credentials.username !== this.demoUser.username ||
      credentials.password !== this.demoUser.password
    ) {
      throw new UnauthorizedException(invalidCredentialsError);
    }

    const accessToken = this.jwtService.sign({
      sub: this.demoUser.id,
      username: this.demoUser.username,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
