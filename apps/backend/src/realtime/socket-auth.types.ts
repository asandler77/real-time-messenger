export type JwtSocketPayload = {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
};

export type SocketUser = {
  id: string;
  username: string;
};

export type AuthenticatedSocketData = {
  user?: SocketUser;
};
