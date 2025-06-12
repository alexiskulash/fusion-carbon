import React from "react";
import { Tile, DataTable } from "@carbon/react";
import WeatherService from "../services/weatherService";

const WeatherForecast = ({ forecastData }) => {
  if (!forecastData || !forecastData.daily) {
    return (
      <Tile className="weather-forecast">
        <h4>5-Day Forecast</h4>
        <p>No forecast data available</p>
      </Tile>
    );
  }

  const { daily } = forecastData;

  // Prepare data for the table
  const forecastRows = daily.time.map((date, index) => {
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const monthDay = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const weatherIcon = WeatherService.getWeatherIcon(
      daily.weather_code[index],
      true,
    );
    const description = WeatherService.getWeatherDescription(
      daily.weather_code[index],
    );
    const maxTemp = WeatherService.formatTemperature(
      daily.temperature_2m_max[index],
    );
    const minTemp = WeatherService.formatTemperature(
      daily.temperature_2m_min[index],
    );
    const precipitation = daily.precipitation_sum[index] || 0;
    const windSpeed = WeatherService.formatWindSpeed(
      daily.wind_speed_10m_max[index],
    );

    return {
      id: date,
      day: dayName,
      date: monthDay,
      icon: weatherIcon,
      description: description,
      high: maxTemp,
      low: minTemp,
      precipitation: `${precipitation} mm`,
      wind: windSpeed,
    };
  });

  const headers = [
    { key: "day", header: "Day" },
    { key: "date", header: "Date" },
    { key: "icon", header: "" },
    { key: "description", header: "Weather" },
    { key: "high", header: "High" },
    { key: "low", header: "Low" },
    { key: "precipitation", header: "Rain" },
    { key: "wind", header: "Wind" },
  ];

  return (
    <Tile className="weather-forecast">
      <h4>5-Day Forecast</h4>
      <DataTable
        rows={forecastRows}
        headers={headers}
        render={({ rows, headers, getHeaderProps, getRowProps }) => (
          <div className="forecast-table">
            <table className="cds--data-table cds--data-table--compact">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <td
                        key={cell.id}
                        className={
                          cell.info.header === "icon"
                            ? "forecast-icon-cell"
                            : ""
                        }
                      >
                        {cell.info.header === "icon" ? (
                          <span className="forecast-weather-icon">
                            {cell.value}
                          </span>
                        ) : (
                          cell.value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />
    </Tile>
  );
};

export default WeatherForecast;
