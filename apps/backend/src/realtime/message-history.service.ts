import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { MESSAGE_HISTORY_FILE } from './message-history.constants';
import type { ChatMessage } from './message.types';

const DEFAULT_RECENT_MESSAGE_LIMIT = 50;

@Injectable()
export class MessageHistoryService implements OnModuleInit {
  private isLoaded = false;
  private messages: ChatMessage[] = [];

  constructor(
    @Inject(MESSAGE_HISTORY_FILE)
    private readonly historyFile: string,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.loadMessages();
  }

  async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    await this.loadMessages();

    this.messages = [...this.messages, message];
    await this.writeMessages();

    return message;
  }

  async listRecentMessages(
    limit = DEFAULT_RECENT_MESSAGE_LIMIT,
  ): Promise<ChatMessage[]> {
    await this.loadMessages();

    return this.messages.slice(-limit);
  }

  private async loadMessages(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    try {
      const rawMessages = await readFile(this.historyFile, 'utf8');
      const parsedMessages = JSON.parse(rawMessages) as unknown;

      this.messages = Array.isArray(parsedMessages)
        ? parsedMessages.filter(isChatMessage)
        : [];
    } catch (error) {
      if (isMissingFileError(error)) {
        this.messages = [];
      } else {
        throw error;
      }
    }

    this.isLoaded = true;
  }

  private async writeMessages(): Promise<void> {
    await mkdir(dirname(this.historyFile), { recursive: true });

    const temporaryFile = `${this.historyFile}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(this.messages, null, 2), 'utf8');
    await rename(temporaryFile, this.historyFile);
  }
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ChatMessage>;

  return (
    typeof candidate.clientId === 'string' &&
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.timestamp === 'string' &&
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
