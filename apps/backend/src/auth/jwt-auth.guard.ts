import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

type RequestWithHeaders = {
  headers: {
    authorization?: unknown;
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const token = this.extractBearerToken(request.headers.authorization);

    this.authService.validateAccessToken(token);

    return true;
  }

  private extractBearerToken(authorizationHeader: unknown): string | null {
    if (typeof authorizationHeader !== 'string') {
      throw new UnauthorizedException('Missing authentication token');
    }

    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();

    return token || null;
  }
}
