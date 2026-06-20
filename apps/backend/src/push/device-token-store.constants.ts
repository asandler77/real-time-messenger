import { join } from 'path';

export const DEVICE_TOKEN_STORE_FILE = Symbol('DEVICE_TOKEN_STORE_FILE');

export function defaultDeviceTokenStoreFile(): string {
  return (
    process.env.DEVICE_TOKEN_STORE_FILE ??
    join(__dirname, '..', '..', 'var', 'device-tokens.json')
  );
}
