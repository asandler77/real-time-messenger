/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import type {ReactTestInstance} from 'react-test-renderer';
import App from '../App';
import ChatScreen from '../ChatScreen';
import LoginScreen from '../LoginScreen';
import {useChatSocket} from '../useChatSocket';

jest.mock('../useChatSocket', () => ({
  useChatSocket: jest.fn(() => ({
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
  fetchMock.mockReset();
  (useChatSocket as jest.Mock).mockReturnValue({
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
      }),
    });
  });
});

test('submits demo credentials, saves token in state, and shows chat', async () => {
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
    error: '',
    messages: [],
    sendMessage,
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<ChatScreen accessToken="demo-jwt" />);
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
    error: '',
    messages: [],
    sendMessage,
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<ChatScreen accessToken="demo-jwt" />);
  });

  expect(renderer!.root.findByProps({testID: 'send-button'}).props.disabled).toBe(
    true,
  );
  expect(sendMessage).not.toHaveBeenCalled();
});

test('disables sending while socket is disconnected', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    error: '',
    messages: [],
    sendMessage: jest.fn(),
    status: 'disconnected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<ChatScreen accessToken="demo-jwt" />);
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

test('renders incoming messages with sender and own-message styling', async () => {
  (useChatSocket as jest.Mock).mockReturnValue({
    error: '',
    messages: [
      {
        id: 'message-1',
        text: 'Mine',
        timestamp: '2026-06-12T12:00:00.000Z',
        userId: 'demo-user',
        username: 'demo',
      },
      {
        id: 'message-2',
        text: 'Hello from other',
        timestamp: '2026-06-12T12:01:00.000Z',
        userId: 'other-user',
        username: 'Other',
      },
    ],
    sendMessage: jest.fn(),
    status: 'connected',
  });

  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<ChatScreen accessToken="demo-jwt" />);
  });

  expect(hasText(renderer!.root, 'You')).toBe(true);
  expect(hasText(renderer!.root, 'Mine')).toBe(true);
  expect(hasText(renderer!.root, 'Other')).toBe(true);
  expect(hasText(renderer!.root, 'Hello from other')).toBe(true);
  expect(
    renderer!.root.findAllByProps({testID: 'message-timestamp'}).length,
  ).toBeGreaterThanOrEqual(2);
  expect(
    renderer!.root.findAllByProps({testID: 'own-message'}).length,
  ).toBeGreaterThanOrEqual(1);
  expect(
    renderer!.root.findAllByProps({testID: 'other-message'}).length,
  ).toBeGreaterThanOrEqual(1);
});
