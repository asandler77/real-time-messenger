import type { JwtModuleOptions } from '@nestjs/jwt';

export const jwtModuleOptions: JwtModuleOptions = {
  secret: 'scaffold-004-development-secret',
  signOptions: { expiresIn: '1h' },
};
