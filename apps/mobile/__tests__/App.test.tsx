/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import type {ReactTestInstance} from 'react-test-renderer';
import App from '../App';
import ChatScreen from '../ChatScreen';
import LoginScreen from '../LoginScreen';
import {clearAccessToken, getAccessToken} from '../authSessionStorage';
import {useChatSocket} from '../useChatSocket';

jest.mock('../useChatSocket', () => ({
  useChatSocket: jest.fn(() => ({
    clientId: '',
    error: '',
    messages: [],
    sendMessage: jest.fn(),
    status: 'idle',
  })),
}));

const fetchMock = jest.fn();

global.fetch = fetchMock;

function hasText(root: ReactTestInstance, text: string) {
  return root.findAll(node => node.props.children === text).length > 0;
}

function mockLoginSuccess(accessToken = 'demo-jwt') {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce({
      accessToken,
      tokenType: 'Bearer',
      userId: 'demo-user',
      username: 'demo',
    }),
  });
}

function mockLoginFailure() {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: jest.fn(),
  });
}

beforeEach(() => {
  clearAccessToken();
  fetchMock.mockReset();
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: '',
    error: '',
    messages: [],
    sendMessage: jest.fn(),
    status: 'idle',
  });
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('renders login form controls', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onLogin={jest.fn()} />);
  });

  expect(renderer!.root.findByProps({testID: 'username-input'})).toBeTruthy();
  expect(renderer!.root.findByProps({testID: 'password-input'})).toBeTruthy();
  expect(renderer!.root.findByProps({testID: 'login-button'})).toBeTruthy();
  expect(hasText(renderer!.root, 'Login')).toBe(true);
});

test('shows loading while login request is pending', async () => {
  let resolveLogin: (value: unknown) => void = () => {};
  fetchMock.mockReturnValueOnce(
    new Promise(resolve => {
      resolveLogin = resolve;
    }),
  );

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onLogin={jest.fn()} />);
  });

  await ReactTestRenderer.act(async () => {
    renderer!.root.findByProps({testID: 'login-button'}).props.onPress();
  });

  expect(renderer!.root.findByProps({testID: 'login-loading'})).toBeTruthy();

  await ReactTestRenderer.act(async () => {
    resolveLogin({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        accessToken: 'demo-jwt',
        tokenType: 'Bearer',
        userId: 'demo-user',
        username: 'demo',
      }),
    });
  });
});

test('submits demo credentials, stores token, and shows chat', async () => {
  mockLoginSuccess();

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    renderer!.root
      .findByProps({testID: 'username-input'})
      .props.onChangeText('demo');
    renderer!.root
      .findByProps({testID: 'password-input'})
      .props.onChangeText('demo');
  });

  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({testID: 'login-button'}).props.onPress();
  });

  expect(fetchMock).toHaveBeenCalledWith(
    'http://10.0.2.2:3000/auth/login',
    expect.objectContaining({
      body: JSON.stringify({username: 'demo', password: 'demo'}),
      method: 'POST',
    }),
  );
  expect(hasText(renderer!.root, 'Real-time Messenger')).toBe(true);
  expect(renderer!.root.findByProps({testID: 'socket-status'})).toBeTruthy();
  expect(getAccessToken()).toBe('demo-jwt');
  expect(useChatSocket).toHaveBeenLastCalledWith('demo-jwt');
});

test('shows user-facing error for invalid credentials', async () => {
  mockLoginFailure();

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onLogin={jest.fn()} />);
  });

  await ReactTestRenderer.act(() => {
    renderer!.root
      .findByProps({testID: 'username-input'})
      .props.onChangeText('wrong');
    renderer!.root
      .findByProps({testID: 'password-input'})
      .props.onChangeText('wrong');
  });

  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({testID: 'login-button'}).props.onPress();
  });

  expect(hasText(renderer!.root, 'Invalid username or password.')).toBe(true);
});

test('shows user-facing error when backend is unavailable', async () => {
  fetchMock.mockRejectedValueOnce(new Error('network down'));

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onLogin={jest.fn()} />);
  });

  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({testID: 'login-button'}).props.onPress();
  });

  expect(
    hasText(
      renderer!.root,
      'Cannot reach backend. Check that the server is running.',
    ),
  ).toBe(true);
});

test('sends a non-empty chat message', async () => {
  const sendMessage = jest.fn().mockResolvedValueOnce(true);
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: 'socket-1',
    error: '',
    messages: [],
    sendMessage,
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    renderer!.root
      .findByProps({testID: 'message-input'})
      .props.onChangeText('Hello');
  });

  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({testID: 'send-button'}).props.onPress();
  });

  expect(sendMessage).toHaveBeenCalledWith('Hello');
  expect(renderer!.root.findByProps({testID: 'message-input'}).props.value).toBe(
    '',
  );
});

test('does not send empty chat messages', async () => {
  const sendMessage = jest.fn();
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: 'socket-1',
    error: '',
    messages: [],
    sendMessage,
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  expect(renderer!.root.findByProps({testID: 'send-button'}).props.disabled).toBe(
    true,
  );
  expect(sendMessage).not.toHaveBeenCalled();
});

test('disables sending while socket is disconnected', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: '',
    error: '',
    messages: [],
    sendMessage: jest.fn(),
    status: 'disconnected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  await ReactTestRenderer.act(() => {
    renderer!.root
      .findByProps({testID: 'message-input'})
      .props.onChangeText('Hello');
  });

  expect(renderer!.root.findByProps({testID: 'send-button'}).props.disabled).toBe(
    true,
  );
});

test('renders loaded history and disconnected chat errors', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: '',
    error: 'Chat is disconnected. Reconnect before sending.',
    messages: [
      {
        clientId: 'socket-1',
        id: 'message-1',
        text: 'Persisted history',
        timestamp: '2026-06-12T12:00:00.000Z',
        userId: 'demo-user',
        username: 'demo',
      },
    ],
    sendMessage: jest.fn(),
    status: 'disconnected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  expect(hasText(renderer!.root, 'Persisted history')).toBe(true);
  expect(
    renderer!.root.findByProps({testID: 'chat-error'}).props.children,
  ).toBe('Chat is disconnected. Reconnect before sending.');
});

test('renders current user messages on the right with the username label', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: 'socket-2',
    error: '',
    messages: [
      {
        clientId: 'socket-1',
        id: 'message-1',
        text: 'Mine',
        timestamp: '2026-06-12T12:00:00.000Z',
        userId: 'demo-user',
        username: 'demo',
      },
    ],
    sendMessage: jest.fn(),
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  expect(hasText(renderer!.root, 'You')).toBe(false);
  expect(hasText(renderer!.root, 'Mine')).toBe(true);
  expect(hasText(renderer!.root, 'demo')).toBe(true);
  expect(
    renderer!.root.findAllByProps({testID: 'own-message'}).length,
  ).toBeGreaterThanOrEqual(1);
  expect(
    renderer!.root.findAllByProps({testID: 'other-message'}).length,
  ).toBe(0);
});

test('renders other user messages on the left with the sender username', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    clientId: 'socket-1',
    error: '',
    messages: [
      {
        clientId: 'socket-2',
        id: 'message-2',
        text: 'Hello from other',
        timestamp: '2026-06-12T12:01:00.000Z',
        userId: 'demo1-user',
        username: 'demo1',
      },
    ],
    sendMessage: jest.fn(),
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatScreen
        accessToken="demo-jwt"
        currentUserId="demo-user"
        currentUsername="demo"
      />,
    );
  });

  expect(hasText(renderer!.root, 'demo1')).toBe(true);
  expect(hasText(renderer!.root, 'Hello from other')).toBe(true);
  expect(renderer!.root.findAllByProps({testID: 'own-message'}).length).toBe(0);
  expect(
    renderer!.root.findAllByProps({testID: 'other-message'}).length,
  ).toBeGreaterThanOrEqual(1);
});
