# Real-Time In-Game Weather Management System (RIGWMS)

## Project Overview

This is a course work project implementing a **Real-Time In-Game Weather Management System (RIGWMS)** - a server-side application designed to manage dynamic weather conditions in multiplayer games.

## Project Structure

```
kursach/
├── realtime-weather-server/     # Main application
│   ├── src/                     # TypeScript source code
│   │   ├── app.ts              # Application class
│   │   ├── server.ts           # Server entry point
│   │   ├── config/             # Configuration
│   │   ├── controllers/        # HTTP endpoint handlers
│   │   ├── generators/         # Weather generation logic
│   │   ├── models/             # Data models
│   │   ├── services/           # Business logic
│   │   ├── transports/         # WebSocket handling
│   │   └── types/              # TypeScript types
│   ├── tests/                   # Unit tests
│   ├── dist/                    # Compiled JavaScript (after build)
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── README.md
│   └── .env
├── package.json                 # Root workspace configuration
└── README.md                    # This file
```

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository
2. Install dependencies for all packages:
```bash
npm run install-all
```

### Development

Start the server in development mode with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production

Build and run in production mode:
```bash
npm run build
npm start
```

### Testing

Run the test suite:
```bash
npm test
```

## Features

✅ **Dynamic Weather Generation** - Realistic procedural weather patterns
✅ **Real-Time Synchronization** - All players experience the same weather
✅ **WebSocket Communication** - Low-latency real-time updates
✅ **RESTful API** - HTTP endpoints for weather data
✅ **Type-Safe** - Full TypeScript implementation
✅ **Comprehensive Tests** - Unit tests with Jest
✅ **Scalable Architecture** - Efficient for multiple concurrent players
✅ **Well-Documented** - Clear code and API documentation

## Key Components

### WeatherGenerator
Generates realistic weather patterns with:
- 6 different weather types (sunny, rainy, snowy, foggy, stormy, cloudy)
- Type-specific temperature, humidity, wind speed ranges
- Realistic pressure and visibility values
- Forecast generation

### WeatherService
Manages the global weather state:
- Current weather conditions
- 5-day forecast
- Periodic updates
- Admin weather customization

### SyncService
Handles real-time synchronization:
- WebSocket connection management
- Broadcasting weather updates to all clients
- Initial state delivery
- Connection tracking

### WeatherController
REST API endpoints:
- `/api/weather` - Get current conditions
- `/api/weather/forecast` - Get forecast
- `/api/health` - Health check
- `/` - Server info

## API Examples

### Get Current Weather
```bash
curl http://localhost:3000/api/weather
```

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

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'weather-update') {
    console.log('Weather updated:', message.data);
  }
};
```

## Configuration

Edit `realtime-weather-server/.env` to customize:
- Server port and host
- Weather update interval
- Maximum player count
- Node environment

## Testing

The project includes comprehensive unit tests:

```bash
npm test                    # Run all tests
npm test -- --coverage     # Generate coverage report
```

Test files:
- `realtime-weather-server/tests/weather.spec.ts` - Core functionality tests

## Project Goals

This course work project demonstrates:
1. Real-time server architecture with WebSockets
2. TypeScript best practices and type safety
3. Clean code organization with layered architecture
4. Service-oriented design pattern
5. Comprehensive testing with Jest
6. RESTful API design
7. Scalable weather generation algorithms
8. Efficient broadcasting mechanisms

## Technical Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express.js
- **Real-Time**: WebSocket (ws)
- **Testing**: Jest
- **Build**: TypeScript Compiler (tsc)
- **Package Manager**: npm

## Code Quality

- ✅ Strong TypeScript types
- ✅ Proper error handling
- ✅ Service layer abstraction
- ✅ Dependency injection
- ✅ Unit test coverage
- ✅ Clear separation of concerns

## Future Improvements

- Database integration (MongoDB/PostgreSQL)
- Real-world weather API integration
- Admin dashboard
- Horizontal scaling with load balancing
- Analytics and monitoring
- Advanced forecasting algorithms
- Client-side prediction algorithms

## Learning Outcomes

Through this project, you will learn:
- Building scalable real-time applications
- WebSocket implementation and optimization
- TypeScript advanced patterns
- Testing with Jest
- Server architecture design
- API development with Express
- Node.js best practices

## Author

Course Work Project - RIGWMS (Real-Time In-Game Weather Management System)

## License

ISC

## Support

For detailed information about the main application, see `realtime-weather-server/README.md`
