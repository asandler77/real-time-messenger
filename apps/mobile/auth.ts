export const AUTH_BASE_URL = 'http://10.0.2.2:3000';

export type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  userId: string;
  username: string;
};

export type LoginResult = {
  accessToken: string;
  userId: string;
  username: string;
};

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  let response: Response;

  try {
    response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error('Cannot reach backend. Check that the server is running.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid username or password.');
    }

    throw new Error('Login failed. Try again.');
  }

  const data = (await response.json()) as LoginResponse;

  if (!data.accessToken || !data.userId || !data.username) {
    throw new Error('Login failed. Try again.');
  }

  return {
    accessToken: data.accessToken,
    userId: data.userId,
    username: data.username,
  };
}
