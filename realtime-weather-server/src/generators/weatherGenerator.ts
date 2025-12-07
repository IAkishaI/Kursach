import { WeatherType, WeatherData } from '../types';

export class WeatherGenerator {
  private readonly weatherTypes: WeatherType[] = ['sunny', 'rainy', 'snowy', 'foggy', 'stormy', 'cloudy'];

  /**
   * Generate random weather data
   */
  generateWeather(): WeatherData {
    const type = this.getRandomWeatherType();
    return {
      type,
      temperature: this.generateTemperature(type),
      humidity: this.generateHumidity(type),
      windSpeed: this.generateWindSpeed(type),
      visibility: this.generateVisibility(type),
      pressure: this.generatePressure(),
      timestamp: Date.now(),
    };
  }

  /**
   * Generate weather forecast (next 5 states)
   */
  generateForecast(count: number = 5): WeatherData[] {
    const forecast: WeatherData[] = [];
    for (let i = 0; i < count; i++) {
      forecast.push(this.generateWeather());
    }
    return forecast;
  }

  private getRandomWeatherType(): WeatherType {
    return this.weatherTypes[Math.floor(Math.random() * this.weatherTypes.length)];
  }

  private generateTemperature(type: WeatherType): number {
    let base = 15;
    if (type === 'snowy') base = -5;
    if (type === 'stormy') base = 20;
    if (type === 'sunny') base = 25;
    return base + (Math.random() * 10 - 5);
  }

  private generateHumidity(type: WeatherType): number {
    let base = 50;
    if (type === 'rainy' || type === 'stormy') base = 80;
    if (type === 'snowy') base = 60;
    if (type === 'sunny') base = 30;
    return Math.min(100, base + (Math.random() * 20 - 10));
  }

  private generateWindSpeed(type: WeatherType): number {
    let base = 5;
    if (type === 'stormy') base = 30;
    if (type === 'rainy') base = 15;
    return base + (Math.random() * 10);
  }

  private generateVisibility(type: WeatherType): number {
    let base = 10000;
    if (type === 'foggy') base = 500;
    if (type === 'rainy') base = 3000;
    if (type === 'stormy') base = 2000;
    return base + (Math.random() * 1000);
  }

  private generatePressure(): number {
    return 1010 + (Math.random() * 20 - 10);
  }
}
