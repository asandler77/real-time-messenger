import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtModuleOptions } from './jwt.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const jwtService = new JwtService(jwtModuleOptions);
  const service = new AuthService(jwtService);

  it.each([
    {
      credentials: { username: 'demo', password: 'demo' },
      expectedUser: { sub: 'demo-user', username: 'demo' },
    },
    {
      credentials: { username: 'demo1', password: 'demo1' },
      expectedUser: { sub: 'demo1-user', username: 'demo1' },
    },
  ])(
    'logs in $credentials.username with a user-identifying JWT',
    ({ credentials, expectedUser }) => {
      const result = service.login(credentials);

      expect(result).toEqual({
        accessToken: expect.any(String),
        tokenType: 'Bearer',
        userId: expectedUser.sub,
        username: expectedUser.username,
      });
      expect(jwtService.verify(result.accessToken)).toEqual(
        expect.objectContaining(expectedUser),
      );
    },
  );

  it('rejects invalid credentials', () => {
    expect(() =>
      service.login({ username: 'demo1', password: 'demo' }),
    ).toThrow(UnauthorizedException);
  });

  it('validates a JWT issued by login', () => {
    const loginResult = service.login({ username: 'demo', password: 'demo' });

    expect(service.validateAccessToken(loginResult.accessToken)).toEqual({
      id: 'demo-user',
      username: 'demo',
    });
  });

  it('rejects missing, invalid, and incomplete access tokens', () => {
    const incompleteToken = jwtService.sign({ sub: 'demo-user' });

    expect(() => service.validateAccessToken(null)).toThrow(
      UnauthorizedException,
    );
    expect(() => service.validateAccessToken('not-a-jwt')).toThrow(
      UnauthorizedException,
    );
    expect(() => service.validateAccessToken(incompleteToken)).toThrow(
      UnauthorizedException,
    );
  });
});
