export interface ServerConfig {
  port: number;
  host: string;
  weatherUpdateInterval: number;
  maxPlayers: number;
  environment: string;
}

const defaultConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  weatherUpdateInterval: parseInt(process.env.WEATHER_UPDATE_INTERVAL || '5000', 10),
  maxPlayers: parseInt(process.env.MAX_PLAYERS || '100', 10),
  environment: process.env.NODE_ENV || 'development',
};

export default defaultConfig;
