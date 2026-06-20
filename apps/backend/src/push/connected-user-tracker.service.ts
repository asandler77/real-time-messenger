import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectedUserTrackerService {
  private readonly socketsByUserId = new Map<string, Set<string>>();

  markConnected(userId: string, socketId: string): void {
    const socketIds = this.socketsByUserId.get(userId) ?? new Set<string>();

    socketIds.add(socketId);
    this.socketsByUserId.set(userId, socketIds);
  }

  markDisconnected(userId: string, socketId: string): void {
    const socketIds = this.socketsByUserId.get(userId);

    if (!socketIds) {
      return;
    }

    socketIds.delete(socketId);

    if (socketIds.size === 0) {
      this.socketsByUserId.delete(userId);
    }
  }

  isConnected(userId: string): boolean {
    return (this.socketsByUserId.get(userId)?.size ?? 0) > 0;
  }
}
