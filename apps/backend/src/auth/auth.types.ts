export type JwtAccessPayload = {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedUser = {
  id: string;
  username: string;
};
