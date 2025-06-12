import React from "react";
import { Tile, Tag } from "@carbon/react";
import WeatherService from "../services/weatherService";

const WeatherCard = ({ weatherData, locationName }) => {
  if (!weatherData || !weatherData.current) {
    return (
      <Tile className="weather-card">
        <div className="weather-card__content">
          <p>No weather data available</p>
        </div>
      </Tile>
    );
  }

  const { current } = weatherData;
  const weatherIcon = WeatherService.getWeatherIcon(
    current.weather_code,
    current.is_day,
  );
  const weatherDescription = WeatherService.getWeatherDescription(
    current.weather_code,
  );
  const temperature = WeatherService.formatTemperature(current.temperature_2m);
  const feelsLike = WeatherService.formatTemperature(
    current.apparent_temperature,
  );
  const windSpeed = WeatherService.formatWindSpeed(current.wind_speed_10m);
  const windDirection = WeatherService.formatWindDirection(
    current.wind_direction_10m,
  );

  return (
    <Tile className="weather-card">
      <div className="weather-card__header">
        <h3 className="weather-card__location">
          {locationName || "Current Location"}
        </h3>
        <Tag type={current.is_day ? "green" : "purple"}>
          {current.is_day ? "Day" : "Night"}
        </Tag>
      </div>

      <div className="weather-card__main">
        <div className="weather-card__icon">
          <span className="weather-icon">{weatherIcon}</span>
        </div>
        <div className="weather-card__temp">
          <span className="temperature">{temperature}</span>
          <span className="feels-like">Feels like {feelsLike}</span>
        </div>
      </div>

      <div className="weather-card__description">
        <p>{weatherDescription}</p>
      </div>

      <div className="weather-card__details">
        <div className="weather-detail">
          <span className="weather-detail__label">Humidity</span>
          <span className="weather-detail__value">
            {current.relative_humidity_2m}%
          </span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail__label">Wind</span>
          <span className="weather-detail__value">
            {windSpeed} {windDirection}
          </span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail__label">Pressure</span>
          <span className="weather-detail__value">
            {Math.round(current.pressure_msl)} hPa
          </span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail__label">Cloud Cover</span>
          <span className="weather-detail__value">{current.cloud_cover}%</span>
        </div>
        {current.precipitation > 0 && (
          <div className="weather-detail">
            <span className="weather-detail__label">Precipitation</span>
            <span className="weather-detail__value">
              {current.precipitation} mm
            </span>
          </div>
        )}
      </div>
    </Tile>
  );
};

export default WeatherCard;
