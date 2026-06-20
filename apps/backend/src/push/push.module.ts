import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  DEVICE_TOKEN_STORE_FILE,
  defaultDeviceTokenStoreFile,
} from './device-token-store.constants';
import { ConnectedUserTrackerService } from './connected-user-tracker.service';
import { DeviceTokenStoreService } from './device-token-store.service';
import { NoopPushTransport } from './noop-push.transport';
import { PUSH_TRANSPORT, PushNotificationService } from './push-notification.service';
import { PushNotificationsController } from './push-notifications.controller';

@Module({
  imports: [AuthModule],
  controllers: [PushNotificationsController],
  providers: [
    {
      provide: DEVICE_TOKEN_STORE_FILE,
      useFactory: defaultDeviceTokenStoreFile,
    },
    {
      provide: PUSH_TRANSPORT,
      useClass: NoopPushTransport,
    },
    ConnectedUserTrackerService,
    DeviceTokenStoreService,
    PushNotificationService,
  ],
  exports: [
    ConnectedUserTrackerService,
    DeviceTokenStoreService,
    PushNotificationService,
  ],
})
export class PushModule {}
