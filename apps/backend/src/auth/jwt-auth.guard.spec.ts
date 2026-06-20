import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.types';

type TestRequest = {
  headers: {
    authorization?: unknown;
  };
  user?: AuthenticatedUser;
};

function createContext(authorization?: unknown): {
  context: ExecutionContext;
  request: TestRequest;
} {
  const request: TestRequest = {
    headers: {
      authorization,
    },
  };

  return {
    context: {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext,
    request,
  };
}

describe('JwtAuthGuard', () => {
  it('accepts valid bearer tokens', () => {
    const user = {
      id: 'demo-user',
      username: 'demo',
    };
    const authService = {
      validateAccessToken: jest.fn(() => user),
    } as unknown as AuthService;
    const guard = new JwtAuthGuard(authService);
    const { context, request } = createContext('Bearer demo-jwt');

    expect(guard.canActivate(context)).toBe(true);
    expect(authService.validateAccessToken).toHaveBeenCalledWith('demo-jwt');
    expect(request.user).toEqual(user);
  });

  it('rejects missing bearer tokens', () => {
    const authService = {
      validateAccessToken: jest.fn(),
    } as unknown as AuthService;
    const guard = new JwtAuthGuard(authService);

    expect(() => guard.canActivate(createContext().context)).toThrow(
      UnauthorizedException,
    );
    expect(authService.validateAccessToken).not.toHaveBeenCalled();
  });

  it('rejects tokens that fail validation', () => {
    const authService = {
      validateAccessToken: jest.fn(() => {
        throw new UnauthorizedException('Invalid authentication token');
      }),
    } as unknown as AuthService;
    const guard = new JwtAuthGuard(authService);

    expect(() =>
      guard.canActivate(createContext('Bearer bad-jwt').context),
    ).toThrow(
      UnauthorizedException,
    );
  });
});
