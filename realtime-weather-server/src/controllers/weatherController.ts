import { Express, Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';

export class WeatherController {
  private weatherService: WeatherService;

  constructor(weatherService: WeatherService) {
    this.weatherService = weatherService;
  }

  /**
   * Register routes
   */
  registerRoutes(app: Express): void {
    app.get('/api/weather', (req: Request, res: Response) => this.getCurrentWeather(req, res));
    app.get('/api/weather/forecast', (req: Request, res: Response) => this.getForecast(req, res));
    app.get('/api/health', (req: Request, res: Response) => this.healthCheck(req, res));
  }

  /**
   * Get current weather
   */
  private getCurrentWeather(req: Request, res: Response): void {
    const weather = this.weatherService.getCurrentWeather();
    res.json({ success: true, data: weather });
  }

  /**
   * Get weather forecast
   */
  private getForecast(req: Request, res: Response): void {
    const forecast = this.weatherService.getForecast();
    res.json({ success: true, data: forecast });
  }

  /**
   * Health check endpoint
   */
  private healthCheck(req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      clients: 0, // Will be updated from sync service
    });
  }
}
