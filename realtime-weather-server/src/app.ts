import express, { Express } from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import config from './config/default';
import { WeatherService } from './services/weatherService';
import { SyncService } from './services/syncService';
import { WeatherController } from './controllers/weatherController';
import { WSTransport } from './transports/ws';

export class App {
  private app: Express;
  private server: http.Server;
  private wss: WebSocketServer;
  private weatherService: WeatherService;
  private syncService: SyncService;
  private wsTransport: WSTransport;
  private weatherController: WeatherController;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    
    // Initialize services
    this.weatherService = new WeatherService();
    this.syncService = new SyncService(this.weatherService);
    this.wsTransport = new WSTransport(this.syncService);
    this.weatherController = new WeatherController(this.weatherService);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    this.weatherController.registerRoutes(this.app);
    
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Real-Time In-Game Weather Management System (RIGWMS)',
        version: '1.0.0',
        status: 'running',
      });
    });
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      this.wsTransport.handleConnection(ws);
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    this.server.listen(config.port, config.host, () => {
      console.log(`Server running on http://${config.host}:${config.port}`);
      console.log(`Environment: ${config.environment}`);
      console.log(`Weather update interval: ${config.weatherUpdateInterval}ms`);
    });

    // Start periodic weather updates
    this.startWeatherUpdates();
  }

  /**
   * Start periodic weather updates
   */
  private startWeatherUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.weatherService.updateWeather();
      this.syncService.broadcastWeatherUpdate();
    }, config.weatherUpdateInterval);
  }

  /**
   * Stop the server
   */
  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
    this.server.close(() => {
      console.log('Server stopped');
    });
  }

  /**
   * Get Express app (for testing)
   */
  public getApp(): Express {
    return this.app;
  }

  /**
   * Get server instance (for testing)
   */
  public getServer(): http.Server {
    return this.server;
  }
}
