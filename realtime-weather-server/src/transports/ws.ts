import { WebSocket } from 'ws';
import { SyncService } from '../services/syncService';

export class WSTransport {
  private syncService: SyncService;

  constructor(syncService: SyncService) {
    this.syncService = syncService;
  }

  /**
   * Handle WebSocket connection
   */
  handleConnection(ws: WebSocket): void {
    console.log('New WebSocket connection');
    
    // Register the client
    this.syncService.registerClient(ws);

    // Send initial weather state
    this.syncService.sendInitialState(ws);

    // Handle incoming messages
    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      this.syncService.unregisterClient(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(ws: WebSocket, message: any): void {
    if (message.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
    }
  }
}
