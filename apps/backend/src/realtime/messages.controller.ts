import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageHistoryService } from './message-history.service';
import type { ChatMessage } from './message.types';

type RecentMessagesResponse = {
  messages: ChatMessage[];
};

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageHistoryService: MessageHistoryService) {}

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async recent(): Promise<RecentMessagesResponse> {
    return {
      messages: await this.messageHistoryService.listRecentMessages(),
    };
  }
}
