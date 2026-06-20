import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PushModule } from './push/push.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [AuthModule, PushModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
