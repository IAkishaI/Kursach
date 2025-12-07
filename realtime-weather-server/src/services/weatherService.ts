import { Weather } from '../models/weather';
import { WeatherGenerator } from '../generators/weatherGenerator';
import { WeatherState, WeatherData } from '../types';

export class WeatherService {
  private weatherState: WeatherState;
  private generator: WeatherGenerator;

  constructor() {
    this.generator = new WeatherGenerator();
    const initialWeather = this.generator.generateWeather();
    this.weatherState = {
      current: initialWeather,
      forecast: this.generator.generateForecast(5),
      lastUpdate: Date.now(),
    };
  }

  /**
   * Get current weather conditions
   */
  getCurrentWeather(): WeatherData {
    return this.weatherState.current;
  }

  /**
   * Get weather forecast
   */
  getForecast(): WeatherData[] {
    return this.weatherState.forecast;
  }

  /**
   * Update weather state
   */
  updateWeather(): WeatherData {
    const newWeather = this.generator.generateWeather();
    this.weatherState.current = newWeather;
    this.weatherState.lastUpdate = Date.now();
    // Regenerate forecast
    this.weatherState.forecast = this.generator.generateForecast(5);
    return newWeather;
  }

  /**
   * Get full weather state
   */
  getWeatherState(): WeatherState {
    return this.weatherState;
  }

  /**
   * Set custom weather (for admin purposes)
   */
  setCustomWeather(weather: WeatherData): WeatherData {
    this.weatherState.current = weather;
    this.weatherState.lastUpdate = Date.now();
    return weather;
  }
}
