import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthService } from './auth.service';

function createContext(authorization?: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization,
        },
      }),
    }),
  } as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  it('accepts valid bearer tokens', () => {
    const authService = {
      validateAccessToken: jest.fn(),
    } as unknown as AuthService;
    const guard = new JwtAuthGuard(authService);

    expect(guard.canActivate(createContext('Bearer demo-jwt'))).toBe(true);
    expect(authService.validateAccessToken).toHaveBeenCalledWith('demo-jwt');
  });

  it('rejects missing bearer tokens', () => {
    const authService = {
      validateAccessToken: jest.fn(),
    } as unknown as AuthService;
    const guard = new JwtAuthGuard(authService);

    expect(() => guard.canActivate(createContext())).toThrow(
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

    expect(() => guard.canActivate(createContext('Bearer bad-jwt'))).toThrow(
      UnauthorizedException,
    );
  });
});
