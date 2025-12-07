import { WeatherService } from './weatherService';
import { SyncMessage } from '../types';
import { WebSocket } from 'ws';

export class SyncService {
  private weatherService: WeatherService;
  private connectedClients: Set<WebSocket> = new Set();

  constructor(weatherService: WeatherService) {
    this.weatherService = weatherService;
  }

  /**
   * Register a client connection
   */
  registerClient(client: WebSocket): void {
    this.connectedClients.add(client);
    console.log(`Client registered. Total clients: ${this.connectedClients.size}`);
  }

  /**
   * Unregister a client connection
   */
  unregisterClient(client: WebSocket): void {
    this.connectedClients.delete(client);
    console.log(`Client unregistered. Total clients: ${this.connectedClients.size}`);
  }

  /**
   * Broadcast weather update to all connected clients
   */
  broadcastWeatherUpdate(): void {
    const weatherData = this.weatherService.getCurrentWeather();
    const message: SyncMessage = {
      type: 'weather-update',
      data: weatherData,
      timestamp: Date.now(),
    };

    this.broadcast(message);
  }

  /**
   * Broadcast any message to all connected clients
   */
  broadcast(message: SyncMessage): void {
    const data = JSON.stringify(message);
    this.connectedClients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  /**
   * Send initial weather state to a client
   */
  sendInitialState(client: WebSocket): void {
    const state = this.weatherService.getWeatherState();
    const message: SyncMessage = {
      type: 'initial-state',
      data: state,
      timestamp: Date.now(),
    };

    client.send(JSON.stringify(message));
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.connectedClients.size;
  }
}
