import React, { useState, useEffect } from "react";
import {
  Grid,
  Column,
  Tile,
  InlineLoading,
  InlineNotification,
} from "@carbon/react";
import WeatherCard from "../components/WeatherCard";
import WeatherForecast from "../components/WeatherForecast";
import WeatherSearch from "../components/WeatherSearch";
import WeatherService from "../services/weatherService";

const WeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchWeatherData = async (location, name) => {
    try {
      setIsLoading(true);
      setError(null);

      const [weather, forecast] = await Promise.all([
        WeatherService.getCurrentWeather(location.latitude, location.longitude),
        WeatherService.getForecast(location.latitude, location.longitude),
      ]);

      setCurrentWeather(weather);
      setForecastData(forecast);
      setLocationName(name);
      setCurrentLocation(location);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location, name) => {
    fetchWeatherData(location, name);
  };

  // Load default location on component mount
  useEffect(() => {
    const loadDefaultWeather = async () => {
      try {
        // Try to get user's current location first
        const location = await WeatherService.getCurrentLocation();
        await fetchWeatherData(location, "Current Location");
      } catch (error) {
        // Fallback to a default location (New York)
        console.log("Could not get current location, using default");
        const defaultLocation = { latitude: 40.7128, longitude: -74.006 };
        await fetchWeatherData(defaultLocation, "New York, NY");
      }
    };

    loadDefaultWeather();
  }, []);

  return (
    <div className="weather-dashboard">
      <Grid fullWidth>
        <Column lg={12} md={8} sm={4}>
          <div className="weather-dashboard__header">
            <h2>Weather Dashboard</h2>
            <p>
              Get current weather conditions and forecasts for any location
              worldwide.
            </p>
          </div>
        </Column>

        <Column lg={12} md={8} sm={4}>
          <Tile className="weather-dashboard__search">
            <h4>Search Location</h4>
            <WeatherSearch
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
            />
          </Tile>
        </Column>

        {error && (
          <Column lg={12} md={8} sm={4}>
            <InlineNotification
              kind="error"
              title="Weather Data Error"
              subtitle={error}
              hideCloseButton
            />
          </Column>
        )}

        {isLoading && (
          <Column lg={12} md={8} sm={4}>
            <Tile>
              <InlineLoading
                description="Loading weather data..."
                status="active"
              />
            </Tile>
          </Column>
        )}

        {!isLoading && currentWeather && (
          <>
            <Column lg={6} md={8} sm={4}>
              <WeatherCard
                weatherData={currentWeather}
                locationName={locationName}
              />
            </Column>

            <Column lg={6} md={8} sm={4}>
              <Tile className="weather-dashboard__summary">
                <h4>Weather Summary</h4>
                <div className="weather-summary__content">
                  <div className="weather-summary__item">
                    <span className="weather-summary__label">Location:</span>
                    <span className="weather-summary__value">
                      {locationName}
                    </span>
                  </div>
                  <div className="weather-summary__item">
                    <span className="weather-summary__label">Coordinates:</span>
                    <span className="weather-summary__value">
                      {currentLocation?.latitude.toFixed(4)}°,{" "}
                      {currentLocation?.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="weather-summary__item">
                    <span className="weather-summary__label">Timezone:</span>
                    <span className="weather-summary__value">
                      {currentWeather.timezone}
                    </span>
                  </div>
                  <div className="weather-summary__item">
                    <span className="weather-summary__label">
                      Last Updated:
                    </span>
                    <span className="weather-summary__value">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Tile>
            </Column>

            <Column lg={12} md={8} sm={4}>
              <WeatherForecast forecastData={forecastData} />
            </Column>
          </>
        )}

        {!isLoading && !currentWeather && !error && (
          <Column lg={12} md={8} sm={4}>
            <Tile>
              <p>Search for a location to view weather data.</p>
            </Tile>
          </Column>
        )}
      </Grid>
    </div>
  );
};

export default WeatherDashboard;
