import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PushModule } from '../push/push.module';
import {
  MESSAGE_HISTORY_FILE,
  defaultMessageHistoryFile,
} from './message-history.constants';
import { MessageHistoryService } from './message-history.service';
import { MessagesController } from './messages.controller';
import { RealtimeGateway } from './realtime.gateway';
import { SocketAuthService } from './socket-auth.service';

@Module({
  imports: [AuthModule, PushModule],
  controllers: [MessagesController],
  providers: [
    {
      provide: MESSAGE_HISTORY_FILE,
      useFactory: defaultMessageHistoryFile,
    },
    MessageHistoryService,
    RealtimeGateway,
    SocketAuthService,
  ],
  exports: [MessageHistoryService],
})
export class RealtimeModule {}
