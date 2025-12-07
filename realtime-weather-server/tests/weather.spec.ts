import { WeatherGenerator } from '../src/generators/weatherGenerator';
import { WeatherService } from '../src/services/weatherService';
import { Weather } from '../src/models/weather';

describe('Weather System', () => {
  describe('WeatherGenerator', () => {
    let generator: WeatherGenerator;

    beforeEach(() => {
      generator = new WeatherGenerator();
    });

    it('should generate valid weather data', () => {
      const weather = generator.generateWeather();
      
      expect(weather.type).toBeDefined();
      expect(['sunny', 'rainy', 'snowy', 'foggy', 'stormy', 'cloudy']).toContain(weather.type);
      expect(weather.temperature).toBeGreaterThan(-50);
      expect(weather.temperature).toBeLessThan(50);
      expect(weather.humidity).toBeGreaterThanOrEqual(0);
      expect(weather.humidity).toBeLessThanOrEqual(100);
      expect(weather.windSpeed).toBeGreaterThanOrEqual(0);
      expect(weather.visibility).toBeGreaterThan(0);
      expect(weather.pressure).toBeGreaterThan(900);
      expect(weather.pressure).toBeLessThan(1100);
      expect(weather.timestamp).toBeDefined();
    });

    it('should generate forecast with correct count', () => {
      const forecast = generator.generateForecast(5);
      expect(forecast.length).toBe(5);
      expect(forecast.every(w => w.type)).toBe(true);
    });
  });

  describe('WeatherService', () => {
    let service: WeatherService;

    beforeEach(() => {
      service = new WeatherService();
    });

    it('should return current weather', () => {
      const weather = service.getCurrentWeather();
      expect(weather).toBeDefined();
      expect(weather.type).toBeDefined();
    });

    it('should return forecast', () => {
      const forecast = service.getForecast();
      expect(Array.isArray(forecast)).toBe(true);
      expect(forecast.length).toBeGreaterThan(0);
    });

    it('should update weather', () => {
      const initialWeather = service.getCurrentWeather();
      const updatedWeather = service.updateWeather();
      
      expect(updatedWeather).toBeDefined();
      expect(updatedWeather.timestamp).toBeGreaterThanOrEqual(initialWeather.timestamp);
    });

    it('should set custom weather', () => {
      const customWeather = {
        type: 'sunny' as const,
        temperature: 25,
        humidity: 50,
        windSpeed: 10,
        visibility: 10000,
        pressure: 1013,
        timestamp: Date.now(),
      };

      const result = service.setCustomWeather(customWeather);
      expect(result.type).toBe('sunny');
      expect(result.temperature).toBe(25);
    });
  });

  describe('Weather Model', () => {
    it('should create weather instance', () => {
      const data = {
        type: 'sunny' as const,
        temperature: 20,
        humidity: 60,
        windSpeed: 5,
        visibility: 10000,
        pressure: 1013,
        timestamp: Date.now(),
      };

      const weather = new Weather(data);
      expect(weather.getType()).toBe('sunny');
      expect(weather.getTemperature()).toBe(20);
    });

    it('should convert to JSON', () => {
      const data = {
        type: 'rainy' as const,
        temperature: 15,
        humidity: 75,
        windSpeed: 15,
        visibility: 5000,
        pressure: 1010,
        timestamp: Date.now(),
      };

      const weather = new Weather(data);
      const json = weather.toJSON();
      
      expect(json.type).toBe('rainy');
      expect(json.temperature).toBe(15);
    });
  });
});
