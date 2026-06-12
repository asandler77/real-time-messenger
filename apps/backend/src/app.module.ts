import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
