import React, { useState, useEffect } from "react";
import {
  Grid,
  Column,
  Button,
  Loading,
  InlineNotification,
} from "@carbon/react";
import CurrentWeather from "../components/weather/CurrentWeather";
import WeatherForecast from "../components/weather/WeatherForecast";
import LocationSearch from "../components/weather/LocationSearch";
import "../components/weather/weather.scss";

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    name: "New York City",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    fetchWeatherData(newLocation.latitude, newLocation.longitude);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude: latitude,
            longitude: longitude,
            name: "Current Location",
          });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError(
            "Failed to get current location. Please enter a city manually.",
          );
        },
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchWeatherData(location.latitude, location.longitude);
  }, []);

  return (
    <div className="weather-dashboard">
      <Grid fullWidth>
        <Column lg={12} md={8} sm={4}>
          <div className="weather-dashboard__header">
            <h2>Weather Dashboard</h2>
            <p>
              Real-time weather data and forecasts powered by Open-Meteo API
            </p>
          </div>
        </Column>

        <Column lg={8} md={6} sm={4}>
          <LocationSearch
            onLocationChange={handleLocationChange}
            currentLocation={location}
          />
        </Column>

        <Column lg={4} md={2} sm={4}>
          <Button
            kind="secondary"
            onClick={handleCurrentLocation}
            disabled={loading}
            className="weather-dashboard__current-location-btn"
          >
            Use Current Location
          </Button>
        </Column>

        {error && (
          <Column lg={12} md={8} sm={4}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              onCloseButtonClick={() => setError(null)}
            />
          </Column>
        )}

        {loading && (
          <Column lg={12} md={8} sm={4}>
            <div className="weather-dashboard__loading">
              <Loading
                description="Fetching weather data..."
                withOverlay={false}
              />
            </div>
          </Column>
        )}

        {weatherData && !loading && (
          <>
            <Column lg={12} md={8} sm={4}>
              <CurrentWeather
                data={weatherData.current}
                location={location}
                units={weatherData.current_units}
              />
            </Column>

            <Column lg={12} md={8} sm={4}>
              <WeatherForecast
                hourlyData={weatherData.hourly}
                dailyData={weatherData.daily}
                hourlyUnits={weatherData.hourly_units}
                dailyUnits={weatherData.daily_units}
                timezone={weatherData.timezone}
              />
            </Column>
          </>
        )}
      </Grid>
    </div>
  );
}
