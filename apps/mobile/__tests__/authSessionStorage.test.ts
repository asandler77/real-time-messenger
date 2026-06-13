import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from '../authSessionStorage';

beforeEach(() => {
  clearAccessToken();
});

test('stores the JWT behind a small auth storage boundary', () => {
  expect(getAccessToken()).toBeNull();

  saveAccessToken('demo-jwt');

  expect(getAccessToken()).toBe('demo-jwt');
});

test('clears the stored JWT', () => {
  saveAccessToken('demo-jwt');

  clearAccessToken();

  expect(getAccessToken()).toBeNull();
});
