import { Response } from 'express';

export type EventType = 'NEW_RECORD' | 'TASK_COMPLETED' | 'INSPECTION_CREATED' | 'CONFIG_UPDATED';

export interface SSEEvent {
  type: EventType;
  data: any;
  timestamp: string;
}

class EventManager {
  private clients: Set<Response> = new Set();

  addClient(res: Response) {
    this.clients.add(res);
    console.log(`SSE client connected. Total clients: ${this.clients.size}`);

    res.on('close', () => {
      this.clients.delete(res);
      console.log(`SSE client disconnected. Total clients: ${this.clients.size}`);
    });
  }

  broadcast(event: SSEEvent) {
    const message = `data: ${JSON.stringify(event)}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.write(message);
      } catch (error) {
        console.error('Error sending SSE event:', error);
        this.clients.delete(client);
      }
    });

    console.log(`Event broadcasted to ${this.clients.size} clients:`, event.type);
  }

  emitNewRecord(data: any) {
    this.broadcast({
      type: 'NEW_RECORD',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitTaskCompleted(data: any) {
    this.broadcast({
      type: 'TASK_COMPLETED',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitInspectionCreated(data: any) {
    this.broadcast({
      type: 'INSPECTION_CREATED',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitConfigUpdated(data: any) {
    this.broadcast({
      type: 'CONFIG_UPDATED',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const eventManager = new EventManager();
