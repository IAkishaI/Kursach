# Real-Time In-Game Weather Management System (RIGWMS)

A server-side application designed to manage dynamic weather conditions in multiplayer games, providing realistic weather generation and synchronization in real-time.

## Features

- **Dynamic Weather Generation**: Procedural generation of diverse weather patterns (sunny, rainy, snowy, foggy, stormy, cloudy)
- **Real-Time Synchronization**: All players experience the same weather conditions simultaneously via WebSocket
- **Weather Forecast System**: Server provides 5-day weather forecasts to clients
- **RESTful API**: HTTP endpoints for weather data retrieval
- **Scalable Architecture**: Efficient data structures and broadcast mechanisms for multiple concurrent players
- **Configurable Parameters**: Easy customization of weather update intervals and server settings

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express.js
- **Real-Time Communication**: WebSocket (ws library)
- **Testing Framework**: Jest
- **Package Manager**: npm

## Project Structure

```
src/
├── app.ts                  # Main application class
├── server.ts              # Server entry point
├── config/
│   └── default.ts         # Configuration management
├── controllers/
│   └── weatherController.ts # HTTP endpoint handlers
├── generators/
│   └── weatherGenerator.ts # Weather generation logic
├── models/
│   └── weather.ts         # Weather data model
├── services/
│   ├── weatherService.ts  # Weather business logic
│   └── syncService.ts     # WebSocket synchronization
├── transports/
│   └── ws.ts             # WebSocket connection handler
└── types/
    └── index.ts          # TypeScript type definitions

tests/
└── weather.spec.ts        # Unit tests

jest.config.js            # Jest configuration
tsconfig.json             # TypeScript configuration
package.json              # Project dependencies
.env                      # Environment variables
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realtime-weather-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

## Usage

### Development

```bash
# Start in development mode with hot reload
npm run dev
```

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start the server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## API Endpoints

### GET `/`
Returns basic server information.

**Response:**
```json
{
  "name": "Real-Time In-Game Weather Management System (RIGWMS)",
  "version": "1.0.0",
  "status": "running"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1701631234567,
  "clients": 5
}
```

### GET `/api/weather`
Get current weather conditions.

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "sunny",
    "temperature": 25.5,
    "humidity": 45,
    "windSpeed": 8.2,
    "visibility": 10000,
    "pressure": 1013.25,
    "timestamp": 1701631234567
  }
}
```

### GET `/api/weather/forecast`
Get weather forecast.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "sunny",
      "temperature": 25.5,
      ...
    },
    ...
  ]
}
```

## WebSocket Events

### Connection
When a client connects, they receive the initial weather state:

```json
{
  "type": "initial-state",
  "data": {
    "current": {...},
    "forecast": [...],
    "lastUpdate": 1701631234567
  },
  "timestamp": 1701631234567
}
```

### Weather Updates
Every `WEATHER_UPDATE_INTERVAL` milliseconds (default: 5000ms), clients receive updates:

```json
{
  "type": "weather-update",
  "data": {
    "type": "rainy",
    "temperature": 18.3,
    ...
  },
  "timestamp": 1701631234567
}
```

### Ping/Pong
Clients can send a ping message to check connection:

```json
{
  "type": "ping"
}
```

Response:
```json
{
  "type": "pong",
  "timestamp": 1701631234567
}
```

## Configuration

Environment variables in `.env`:

```env
PORT=3000                          # Server port
HOST=localhost                     # Server host
NODE_ENV=development               # Environment (development/production)
WEATHER_UPDATE_INTERVAL=5000       # Weather update interval in milliseconds
MAX_PLAYERS=100                    # Maximum concurrent players
```

## Architecture

### Weather Generation
The `WeatherGenerator` class uses algorithms to generate realistic weather patterns:
- Temperature varies based on weather type
- Humidity correlates with precipitation
- Wind speed increases during storms
- Visibility decreases in fog and rain

### Real-Time Synchronization
The `SyncService` manages WebSocket connections and broadcasts weather updates:
- Maintains a set of active client connections
- Broadcasts updates to all connected clients
- Sends initial state to newly connected clients
- Handles client disconnections

### Weather Service
The `WeatherService` manages the global weather state:
- Maintains current weather and forecast
- Updates weather periodically
- Allows admin to set custom weather
- Provides weather data to controllers and WebSocket handlers

## Testing

Tests cover the core functionality:
- Weather generation algorithms
- Service methods and state management
- Data model operations
- Type safety

Run tests with:
```bash
npm test
```

## Performance Considerations

- **Efficient Broadcasting**: Uses WebSocket broadcast mechanism instead of individual sends
- **Memory Management**: Maintains minimal weather state in memory
- **Connection Pooling**: Efficiently manages multiple concurrent connections
- **Update Batching**: Updates all clients simultaneously to minimize latency

## Future Enhancements

- [ ] Database integration for persistent weather history
- [ ] Real-world weather API integration
- [ ] Weather impact on gameplay mechanics
- [ ] Advanced forecasting algorithms
- [ ] Admin dashboard for weather management
- [ ] Multiplayer session support
- [ ] Load balancing for horizontal scaling
- [ ] Analytics and monitoring dashboard

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.
