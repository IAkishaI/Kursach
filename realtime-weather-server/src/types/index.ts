// Weather condition types
export type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'foggy' | 'stormy' | 'cloudy';

export interface WeatherData {
  type: WeatherType;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  timestamp: number;
}

export interface WeatherState {
  current: WeatherData;
  forecast: WeatherData[];
  lastUpdate: number;
}

export interface PlayerLocation {
  playerId: string;
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface SyncMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface ServerConfig {
  port: number;
  host: string;
  weatherUpdateInterval: number; // in milliseconds
  maxPlayers: number;
}
