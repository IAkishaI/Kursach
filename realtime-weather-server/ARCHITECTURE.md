# RIGWMS Architecture Documentation

## Overview

Real-Time In-Game Weather Management System (RIGWMS) is a layered, service-oriented architecture designed for scalability, maintainability, and real-time performance.

## Architecture Layers

### 1. Transport Layer (`src/transports/`)

**Responsibility**: Handle low-level network communication

**Components**:
- `WSTransport`: WebSocket connection handler
  - Manages WebSocket connections
  - Delegates messages to services
  - Handles connection lifecycle (open, close, error)

**Flow**:
```
Client WebSocket → WSTransport → SyncService → Business Logic
```

### 2. Controller Layer (`src/controllers/`)

**Responsibility**: Handle HTTP requests and route them to services

**Components**:
- `WeatherController`: REST API endpoints
  - GET `/api/weather` - Current weather
  - GET `/api/weather/forecast` - Forecast
  - GET `/api/health` - Health check
  - GET `/` - Server info

**Pattern**: Request → Validation → Service Call → Response

### 3. Service Layer (`src/services/`)

**Responsibility**: Business logic and state management

**Components**:

#### WeatherService
- Maintains the global weather state
- Generates new weather states
- Provides current conditions and forecasts
- Supports custom weather setup (admin)

```typescript
interface WeatherState {
  current: WeatherData;
  forecast: WeatherData[];
  lastUpdate: number;
}
```

#### SyncService
- Manages all connected WebSocket clients
- Broadcasts weather updates to all clients
- Sends initial state to new connections
- Tracks connection metrics

**Key Methods**:
- `registerClient(ws)` - Register a new client
- `unregisterClient(ws)` - Remove a client
- `broadcastWeatherUpdate()` - Send update to all
- `broadcast(message)` - Send any message to all
- `sendInitialState(client)` - Send initial state to new client

### 4. Generator Layer (`src/generators/`)

**Responsibility**: Generate realistic weather data

**Components**:
- `WeatherGenerator`: Procedural weather generation
  - Generates random weather with realistic correlations
  - Temperature varies by weather type
  - Humidity correlates with precipitation
  - Wind speed increases during storms
  - Generates forecasts

**Generation Logic**:
```
Weather Type → Base Values → Random Variation → Final Data
```

### 5. Model Layer (`src/models/`)

**Responsibility**: Data representation and manipulation

**Components**:
- `Weather`: Immutable weather data model
  - Represents a weather state
  - Provides getters and setters
  - Serializable to JSON

### 6. Configuration Layer (`src/config/`)

**Responsibility**: Centralized configuration management

**Components**:
- `default.ts`: Load configuration from environment variables
  - Server port and host
  - Weather update interval
  - Max player count
  - Environment

## Data Flow

### Initialization

```
App → WeatherService (init) → WeatherGenerator (generate initial)
    → SyncService (init)
    → WeatherController (register routes)
    → WSTransport (setup handler)
    → Express Server (listen)
```

### New Client Connection

```
Client WebSocket
  ↓
WSTransport.handleConnection()
  ↓
SyncService.registerClient()
  ↓
SyncService.sendInitialState()
  ↓
Client receives { type: 'initial-state', data: WeatherState }
```

### Periodic Weather Update

```
Timer (WEATHER_UPDATE_INTERVAL)
  ↓
WeatherService.updateWeather()
  ↓
SyncService.broadcastWeatherUpdate()
  ↓
JSON Broadcast to All Connected Clients
```

### HTTP Request

```
Client HTTP Request
  ↓
Express Route Handler
  ↓
WeatherController Method
  ↓
WeatherService.getCurrentWeather() / getForecast()
  ↓
JSON Response
```

## Class Relationships

```
App (Main Container)
├── WeatherService
│   └── WeatherGenerator
├── WeatherController
│   └── WeatherService
├── SyncService
│   └── WeatherService
└── WSTransport
    └── SyncService
        └── WeatherService
```

## Type System

### Core Interfaces (types/index.ts)

```typescript
type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'foggy' | 'stormy' | 'cloudy';

interface WeatherData {
  type: WeatherType;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  timestamp: number;
}

interface WeatherState {
  current: WeatherData;
  forecast: WeatherData[];
  lastUpdate: number;
}

interface SyncMessage {
  type: string;
  data: any;
  timestamp: number;
}
```

## Design Patterns

### 1. Singleton Pattern
- `WeatherService`: Single source of truth for weather state
- Ensures consistency across all clients

### 2. Observer Pattern
- `SyncService`: Notifies all clients of weather changes
- Implements broadcast mechanism

### 3. Dependency Injection
- Services receive dependencies in constructor
- Improves testability and loose coupling

### 4. Layered Architecture
- Clear separation of concerns
- Each layer has specific responsibility
- Easier to maintain and test

### 5. Service Locator
- `App` class manages all services
- Single initialization point

## Performance Characteristics

### Memory Usage
- Per weather state: ~300 bytes
- Per connected client: ~1 KB (WebSocket overhead)
- Forecast (5 items): ~1.5 KB
- **Total estimate**: 100 clients = ~100 KB+ memory for weather

### Network Usage
- Weather update packet: ~200-300 bytes
- Frequency: Every 5 seconds (default)
- **Bandwidth per client**: ~0.4-0.6 KB/s

### Scalability

**Horizontal**:
- Stateless HTTP endpoints scale easily
- WebSocket connections can be load-balanced with sticky sessions

**Vertical**:
- Efficient broadcasting using `ws` library
- Minimal CPU usage for generation
- Network I/O bound

## Testing Strategy

### Unit Tests (Jest)
```
tests/
└── weather.spec.ts
    ├── WeatherGenerator tests
    ├── WeatherService tests
    └── Weather Model tests
```

### Test Coverage
- Core logic: WeatherGenerator, WeatherService, Weather
- Type safety: All interfaces tested
- Edge cases: Boundary values, empty states

## Security Considerations

1. **Input Validation**: Validate all incoming messages
2. **Connection Limits**: Implement max connections
3. **Rate Limiting**: Prevent client spam
4. **Error Handling**: Don't expose internal errors
5. **CORS**: Configure appropriately for production

## Future Architecture Improvements

1. **Event Bus**: Replace direct calls with event-driven architecture
2. **Message Queue**: Buffer high-volume updates (Redis, RabbitMQ)
3. **Database**: Persist weather history (MongoDB, PostgreSQL)
4. **Cache Layer**: Cache forecasts and frequently accessed data
5. **Metrics/Monitoring**: Prometheus, Grafana integration
6. **Load Balancing**: Horizontal scaling with Redis pub/sub
7. **Admin API**: Separate endpoint for weather control
8. **Client State**: Track per-client preferences and state

## Deployment Architecture

```
Load Balancer
├── Server Instance 1 (Port 3000)
├── Server Instance 2 (Port 3000)
└── Server Instance N (Port 3000)
    ↓
Redis (shared state)
    ↓
Database (persistent storage)
```

## API Contract

### WebSocket Message Format

**All messages use this structure**:
```json
{
  "type": "message-type",
  "data": { /* type-specific data */ },
  "timestamp": 1701631234567
}
```

**Message Types**:
- `initial-state`: Sent to new connections
- `weather-update`: Periodic weather updates
- `ping/pong`: Connection keepalive
- Error messages: `{ type: "error", data: { message: "..." } }`

### Error Handling

WebSocket errors are logged but don't crash the server. HTTP errors follow standard REST conventions with appropriate status codes.

## Development Guidelines

1. **Service Isolation**: Services should not know about Transport layer
2. **Type Safety**: Always use interfaces for data
3. **Single Responsibility**: Each class has one reason to change
4. **Testing First**: Write tests before implementation
5. **Documentation**: Document complex algorithms
6. **Error Handling**: Handle all failure cases
7. **Logging**: Log important events for debugging

This architecture provides a solid foundation for building, testing, maintaining, and scaling the RIGWMS system.
