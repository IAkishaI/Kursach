import { WeatherType, WeatherData } from '../types';

export class Weather {
  private type: WeatherType;
  private temperature: number;
  private humidity: number;
  private windSpeed: number;
  private visibility: number;
  private pressure: number;
  private timestamp: number;

  constructor(data: WeatherData) {
    this.type = data.type;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.windSpeed = data.windSpeed;
    this.visibility = data.visibility;
    this.pressure = data.pressure;
    this.timestamp = data.timestamp;
  }

  toJSON(): WeatherData {
    return {
      type: this.type,
      temperature: this.temperature,
      humidity: this.humidity,
      windSpeed: this.windSpeed,
      visibility: this.visibility,
      pressure: this.pressure,
      timestamp: this.timestamp,
    };
  }

  getType(): WeatherType {
    return this.type;
  }

  setType(type: WeatherType): void {
    this.type = type;
    this.timestamp = Date.now();
  }

  getTemperature(): number {
    return this.temperature;
  }

  setTemperature(temp: number): void {
    this.temperature = temp;
  }
}
