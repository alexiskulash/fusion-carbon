import React from "react";
import { Tile, Tag } from "@carbon/react";
import {
  Temperature,
  Humidity,
  Wind,
  Pressure,
  Location,
} from "@carbon/icons-react";

const getWeatherDescription = (weatherCode) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
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
  return weatherCodes[weatherCode] || "Unknown";
};

const getTemperatureTag = (temp) => {
  if (temp >= 30) return { type: "red", text: "Very Hot" };
  if (temp >= 25) return { type: "orange", text: "Hot" };
  if (temp >= 15) return { type: "green", text: "Warm" };
  if (temp >= 5) return { type: "blue", text: "Cool" };
  if (temp >= -5) return { type: "cyan", text: "Cold" };
  return { type: "purple", text: "Very Cold" };
};

export default function CurrentWeather({ data, location, units }) {
  if (!data) return null;

  const temperatureTag = getTemperatureTag(data.temperature_2m);
  const weatherDescription = getWeatherDescription(data.weather_code);

  return (
    <Tile className="current-weather">
      <div className="current-weather__header">
        <div className="current-weather__location">
          <Location size={20} />
          <h3>{location.name}</h3>
        </div>
        <Tag
          type={temperatureTag.type}
          className="current-weather__condition-tag"
        >
          {temperatureTag.text}
        </Tag>
      </div>

      <div className="current-weather__main">
        <div className="current-weather__temperature">
          <span className="current-weather__temp-value">
            {Math.round(data.temperature_2m)}°
          </span>
          <span className="current-weather__temp-unit">
            {units.temperature_2m}
          </span>
        </div>
        <div className="current-weather__description">{weatherDescription}</div>
      </div>

      <div className="current-weather__details">
        <div className="current-weather__detail">
          <Humidity size={16} />
          <span className="current-weather__detail-label">Humidity</span>
          <span className="current-weather__detail-value">
            {data.relative_humidity_2m}%
          </span>
        </div>

        <div className="current-weather__detail">
          <Wind size={16} />
          <span className="current-weather__detail-label">Wind</span>
          <span className="current-weather__detail-value">
            {Math.round(data.wind_speed_10m)} {units.wind_speed_10m}
          </span>
        </div>

        <div className="current-weather__detail">
          <Pressure size={16} />
          <span className="current-weather__detail-label">Pressure</span>
          <span className="current-weather__detail-value">
            {Math.round(data.surface_pressure)} {units.surface_pressure}
          </span>
        </div>

        <div className="current-weather__detail">
          <Temperature size={16} />
          <span className="current-weather__detail-label">Wind Direction</span>
          <span className="current-weather__detail-value">
            {data.wind_direction_10m}°
          </span>
        </div>
      </div>
    </Tile>
  );
}
