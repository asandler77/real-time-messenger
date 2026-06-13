import { join } from 'path';

export const MESSAGE_HISTORY_FILE = Symbol('MESSAGE_HISTORY_FILE');

export function defaultMessageHistoryFile(): string {
  return (
    process.env.MESSAGE_HISTORY_FILE ??
    join(__dirname, '..', '..', 'var', 'messages.json')
  );
}
