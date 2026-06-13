import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { MessageHistoryService } from './message-history.service';
import type { ChatMessage } from './message.types';

function createMessage(id: string, text: string): ChatMessage {
  return {
    clientId: 'socket-1',
    id,
    text,
    timestamp: `2026-06-12T12:0${id.slice(-1)}:00.000Z`,
    userId: 'demo-user',
    username: 'demo',
  };
}

describe('MessageHistoryService', () => {
  let temporaryDirectory: string;
  let historyFile: string;

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'message-history-'));
    historyFile = join(temporaryDirectory, 'messages.json');
  });

  afterEach(async () => {
    await rm(temporaryDirectory, { force: true, recursive: true });
  });

  it('saves messages and loads them from disk after service recreation', async () => {
    const service = new MessageHistoryService(historyFile);
    const firstMessage = createMessage('message-1', 'First');
    const secondMessage = createMessage('message-2', 'Second');

    await service.saveMessage(firstMessage);
    await service.saveMessage(secondMessage);

    const recreatedService = new MessageHistoryService(historyFile);

    await expect(recreatedService.listRecentMessages()).resolves.toEqual([
      firstMessage,
      secondMessage,
    ]);
  });

  it('returns only the most recent messages when a limit is provided', async () => {
    const service = new MessageHistoryService(historyFile);

    await service.saveMessage(createMessage('message-1', 'First'));
    await service.saveMessage(createMessage('message-2', 'Second'));
    await service.saveMessage(createMessage('message-3', 'Third'));

    await expect(service.listRecentMessages(2)).resolves.toEqual([
      expect.objectContaining({ id: 'message-2' }),
      expect.objectContaining({ id: 'message-3' }),
    ]);
  });
});
