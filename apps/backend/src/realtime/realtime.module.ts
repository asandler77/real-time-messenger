import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';
import { SocketAuthService } from './socket-auth.service';

@Module({
  imports: [AuthModule],
  providers: [RealtimeGateway, SocketAuthService],
})
export class RealtimeModule {}
