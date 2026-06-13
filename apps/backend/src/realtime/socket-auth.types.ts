import type { AuthenticatedUser, JwtAccessPayload } from '../auth/auth.types';

export type JwtSocketPayload = JwtAccessPayload;

export type SocketUser = AuthenticatedUser;

export type AuthenticatedSocketData = {
  user?: SocketUser;
};
