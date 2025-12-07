# Usage Examples

## Server Setup and Running

### Development Mode

```bash
cd realtime-weather-server
npm install
npm run dev
```

Server starts on `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

### Docker

```bash
# Build image
docker build -t rigwms:latest ./realtime-weather-server

# Run container
docker run -p 3000:3000 rigwms:latest

# Or use docker-compose
docker-compose up
```

## HTTP API Examples

### JavaScript/Fetch

#### Get Current Weather
```javascript
fetch('http://localhost:3000/api/weather')
  .then(response => response.json())
  .then(data => console.log('Current weather:', data.data))
  .catch(error => console.error('Error:', error));
```

#### Get Forecast
```javascript
fetch('http://localhost:3000/api/weather/forecast')
  .then(response => response.json())
  .then(data => console.log('Forecast:', data.data))
  .catch(error => console.error('Error:', error));
```

#### Health Check
```javascript
fetch('http://localhost:3000/api/health')
  .then(response => response.json())
  .then(data => console.log('Health:', data))
  .catch(error => console.error('Error:', error));
```

### Curl Examples

```bash
# Get current weather
curl http://localhost:3000/api/weather

# Get forecast
curl http://localhost:3000/api/weather/forecast

# Health check
curl http://localhost:3000/api/health

# Server info
curl http://localhost:3000
```

### Python Examples

```python
import requests

# Get current weather
response = requests.get('http://localhost:3000/api/weather')
print(response.json())

# Get forecast
response = requests.get('http://localhost:3000/api/weather/forecast')
forecast = response.json()['data']
for weather in forecast:
    print(f"Weather: {weather['type']}, Temp: {weather['temperature']}°C")
```

## WebSocket Examples

### JavaScript Client

```javascript
// Connect to server
const ws = new WebSocket('ws://localhost:3000');

// Connection established
ws.onopen = () => {
  console.log('Connected to weather server');
};

// Receive messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'initial-state') {
    console.log('Initial weather state:', message.data);
  } else if (message.type === 'weather-update') {
    console.log('Weather updated:', message.data);
  } else if (message.type === 'pong') {
    console.log('Pong received');
  }
};

// Connection closed
ws.onclose = () => {
  console.log('Disconnected from server');
};

// Error handling
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Send ping message
setTimeout(() => {
  ws.send(JSON.stringify({ type: 'ping' }));
}, 5000);
```

### Real Game Integration Example

```javascript
class WeatherManager {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.currentWeather = null;
    this.listeners = [];
  }

  connect() {
    this.ws = new WebSocket(this.serverUrl);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'weather-update' || message.type === 'initial-state') {
        this.currentWeather = message.data.current || message.data;
        this.notifyListeners(this.currentWeather);
      }
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
    // Send current weather immediately if available
    if (this.currentWeather) {
      callback(this.currentWeather);
    }
  }

  notifyListeners(weather) {
    this.listeners.forEach(listener => listener(weather));
  }

  getCurrentWeather() {
    return this.currentWeather;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage in game
const weatherManager = new WeatherManager('ws://localhost:3000');
weatherManager.connect();

weatherManager.subscribe((weather) => {
  console.log(`Current: ${weather.type}, Temp: ${weather.temperature}°C`);
  
  // Update game visuals
  if (weather.type === 'rainy') {
    game.playRainEffect();
    game.setVisibility(weather.visibility);
  } else if (weather.type === 'sunny') {
    game.stopRainEffect();
    game.setBrightness(1.0);
  }
});
```

### Python WebSocket Client

```python
import websocket
import json
import threading

def on_message(ws, message):
    data = json.loads(message)
    print(f"Received: {data['type']}")
    if 'data' in data:
        weather = data['data'].get('current') or data['data']
        print(f"Weather: {weather['type']}, Temp: {weather['temperature']}°C")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("Connection closed")

def on_open(ws):
    print("Connected to server")
    # Send ping every 30 seconds
    def ping_loop():
        while True:
            ws.send(json.dumps({"type": "ping"}))
            time.sleep(30)
    
    threading.Thread(target=ping_loop, daemon=True).start()

if __name__ == "__main__":
    ws = websocket.WebSocketApp(
        "ws://localhost:3000",
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
        on_open=on_open
    )
    ws.run_forever()
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test weather.spec.ts

# Watch mode
npm test -- --watch
```

### Example Test

```typescript
import { WeatherService } from '../src/services/weatherService';

describe('WeatherService', () => {
  it('should generate weather updates', () => {
    const service = new WeatherService();
    const initial = service.getCurrentWeather();
    const updated = service.updateWeather();
    
    expect(updated.timestamp).toBeGreaterThan(initial.timestamp);
  });
});
```

## Configuration Examples

### .env for Development
```env
PORT=3000
HOST=localhost
NODE_ENV=development
WEATHER_UPDATE_INTERVAL=5000
MAX_PLAYERS=100
```

### .env for Production
```env
PORT=80
HOST=0.0.0.0
NODE_ENV=production
WEATHER_UPDATE_INTERVAL=3000
MAX_PLAYERS=1000
```

## Monitoring and Debugging

### View Logs
```bash
# Development logs
npm run dev 2>&1 | tee server.log

# Docker logs
docker-compose logs -f weather-server
```

### Health Monitoring
```javascript
// Check server health periodically
setInterval(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const health = await response.json();
    console.log(`Server: ${health.status}, Clients: ${health.clients}`);
  } catch (error) {
    console.error('Server unreachable');
  }
}, 30000);
```

### Performance Testing
```bash
# Install Apache Bench
# On macOS: brew install httpd
# On Linux: sudo apt-get install apache2-utils

# Load test
ab -n 1000 -c 100 http://localhost:3000/api/weather
```

## Common Issues and Solutions

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### WebSocket Connection Failed
- Check server is running: `curl http://localhost:3000/api/health`
- Check firewall allows WebSocket connections
- Verify client URL format: `ws://` not `http://`

### TypeScript Compilation Errors
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Memory Issues
```bash
# Run with increased memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## Production Deployment

### AWS EC2 Example
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Clone repository
git clone <repo-url>
cd kursach

# Install dependencies
npm run install-all

# Build application
npm run build

# Run with PM2 (process manager)
npm install -g pm2
pm2 start realtime-weather-server/dist/server.js --name "rigwms"
pm2 save
pm2 startup
```

### Docker Deployment
```bash
# Build and push to registry
docker build -t myregistry/rigwms:latest ./realtime-weather-server
docker push myregistry/rigwms:latest

# Deploy
docker pull myregistry/rigwms:latest
docker run -d -p 3000:3000 --name weather-server myregistry/rigwms:latest
```

This covers the most common use cases for running, testing, and monitoring the RIGWMS system.
