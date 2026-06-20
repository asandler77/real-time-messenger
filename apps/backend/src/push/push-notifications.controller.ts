import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedHttpRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { DeviceTokenStoreService } from './device-token-store.service';

type RegisterDeviceTokenResponse = {
  ok: true;
};

@Controller('push')
export class PushNotificationsController {
  constructor(private readonly deviceTokenStore: DeviceTokenStoreService) {}

  @Post('device-token')
  @UseGuards(JwtAuthGuard)
  async registerDeviceToken(
    @Req() request: AuthenticatedHttpRequest,
    @Body() body: RegisterDeviceTokenDto,
  ): Promise<RegisterDeviceTokenResponse> {
    await this.deviceTokenStore.registerToken(request.user, body);

    return {
      ok: true,
    };
  }
}
