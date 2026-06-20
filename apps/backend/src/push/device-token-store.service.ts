import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import { dirname } from 'path';
import type { AuthenticatedUser } from '../auth/auth.types';
import { DEVICE_TOKEN_STORE_FILE } from './device-token-store.constants';
import type {
  DeviceTokenRecord,
  PushRecipient,
  RegisterDeviceTokenInput,
} from './push.types';

@Injectable()
export class DeviceTokenStoreService implements OnModuleInit {
  private isLoaded = false;
  private records: DeviceTokenRecord[] = [];

  constructor(
    @Inject(DEVICE_TOKEN_STORE_FILE)
    private readonly storeFile: string,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.loadRecords();
  }

  async registerToken(
    user: AuthenticatedUser,
    input: RegisterDeviceTokenInput | undefined,
  ): Promise<DeviceTokenRecord> {
    const deviceToken = this.validateDeviceToken(input?.deviceToken);
    const platform = input?.platform ?? 'android';

    if (platform !== 'android') {
      throw new BadRequestException('Only Android device tokens are supported.');
    }

    await this.loadRecords();

    const nextRecord: DeviceTokenRecord = {
      deviceToken,
      platform,
      updatedAt: new Date().toISOString(),
      userId: user.id,
      username: user.username,
    };

    this.records = [
      ...this.records.filter(
        record =>
          record.userId !== user.id && record.deviceToken !== nextRecord.deviceToken,
      ),
      nextRecord,
    ];
    await this.writeRecords();

    return nextRecord;
  }

  async listPushRecipients(): Promise<PushRecipient[]> {
    await this.loadRecords();

    return this.records.map(record => ({
      deviceToken: record.deviceToken,
      platform: record.platform,
      userId: record.userId,
    }));
  }

  async listRecords(): Promise<DeviceTokenRecord[]> {
    await this.loadRecords();

    return [...this.records];
  }

  private validateDeviceToken(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException('Device token is required.');
    }

    return value.trim();
  }

  private async loadRecords(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    try {
      const rawRecords = await readFile(this.storeFile, 'utf8');
      const parsedRecords = JSON.parse(rawRecords) as unknown;

      this.records = Array.isArray(parsedRecords)
        ? parsedRecords.filter(isDeviceTokenRecord)
        : [];
    } catch (error) {
      if (isMissingFileError(error)) {
        this.records = [];
      } else {
        throw error;
      }
    }

    this.isLoaded = true;
  }

  private async writeRecords(): Promise<void> {
    await mkdir(dirname(this.storeFile), { recursive: true });

    const temporaryFile = `${this.storeFile}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(this.records, null, 2), 'utf8');
    await rename(temporaryFile, this.storeFile);
  }
}

function isDeviceTokenRecord(value: unknown): value is DeviceTokenRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<DeviceTokenRecord>;

  return (
    candidate.platform === 'android' &&
    typeof candidate.deviceToken === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.userId === 'string' &&
    typeof candidate.username === 'string'
  );
}

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as NodeJS.ErrnoException).code === 'ENOENT'
  );
}
