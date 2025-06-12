// Weather service using Open-Meteo API
// Free weather API with no authentication required

const WEATHER_API_BASE = "https://api.open-meteo.com/v1";
const GEOCODING_API_BASE = "https://geocoding-api.open-meteo.com/v1";

export class WeatherService {
  /**
   * Get current weather for coordinates
   */
  static async getCurrentWeather(latitude, longitude) {
    try {
      const url = `${WEATHER_API_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        current: data.current,
        timezone: data.timezone,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      };
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw error;
    }
  }

  /**
   * Get weather forecast for coordinates
   */
  static async getForecast(latitude, longitude, days = 5) {
    try {
      const url = `${WEATHER_API_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=${days}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        daily: data.daily,
        timezone: data.timezone,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      };
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw error;
    }
  }

  /**
   * Search for cities by name
   */
  static async searchCities(query) {
    try {
      const url = `${GEOCODING_API_BASE}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching cities:", error);
      throw error;
    }
  }

  /**
   * Get user's current location using browser geolocation
   */
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    });
  }

  /**
   * Get weather description from weather code
   * Based on WMO Weather interpretation codes
   */
  static getWeatherDescription(code) {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    return weatherCodes[code] || "Unknown";
  }

  /**
   * Get weather icon class based on weather code and time of day
   */
  static getWeatherIcon(code, isDay = true) {
    // Using simple text representations that can be styled with CSS
    // In a real app, you might use weather icon fonts or SVGs

    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code >= 1 && code <= 3) return isDay ? "⛅" : "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 86) return "🌦️";
    if (code >= 95 && code <= 99) return "⛈️";

    return "🌤️";
  }

  /**
   * Format temperature with unit
   */
  static formatTemperature(temp, unit = "°C") {
    return `${Math.round(temp)}${unit}`;
  }

  /**
   * Format wind speed
   */
  static formatWindSpeed(speed) {
    return `${Math.round(speed)} km/h`;
  }

  /**
   * Format wind direction
   */
  static formatWindDirection(degrees) {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}

export default WeatherService;
