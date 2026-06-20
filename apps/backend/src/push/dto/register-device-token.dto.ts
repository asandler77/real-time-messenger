import type { DevicePlatform } from '../push.types';

export type RegisterDeviceTokenDto = {
  deviceToken?: unknown;
  platform?: DevicePlatform;
};
