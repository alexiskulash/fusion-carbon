import React, { useState } from "react";
import { Tile, Tabs, Tab, DataTable } from "@carbon/react";
import { Temperature, Rain, Wind } from "@carbon/icons-react";

const getWeatherIcon = (weatherCode) => {
  // Simple weather icon mapping - in a real app you might use actual weather icons
  if (weatherCode === 0 || weatherCode === 1) return "☀️";
  if (weatherCode === 2 || weatherCode === 3) return "⛅";
  if ([45, 48].includes(weatherCode)) return "🌫️";
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
  )
    return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "🌨️";
  if ([95, 96, 99].includes(weatherCode)) return "⛈️";
  return "🌤️";
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function WeatherForecast({
  hourlyData,
  dailyData,
  hourlyUnits,
  dailyUnits,
  timezone,
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  if (!hourlyData || !dailyData) return null;

  // Get next 24 hours for hourly forecast
  const next24Hours = hourlyData.time.slice(0, 24).map((time, index) => ({
    id: index.toString(),
    time: formatTime(time),
    temperature: Math.round(hourlyData.temperature_2m[index]),
    weatherCode: hourlyData.weather_code[index],
    precipitation: hourlyData.precipitation_probability[index],
    windSpeed: Math.round(hourlyData.wind_speed_10m[index]),
    icon: getWeatherIcon(hourlyData.weather_code[index]),
  }));

  // Get next 7 days for daily forecast
  const next7Days = dailyData.time.slice(0, 7).map((date, index) => ({
    id: index.toString(),
    date: formatDate(date),
    maxTemp: Math.round(dailyData.temperature_2m_max[index]),
    minTemp: Math.round(dailyData.temperature_2m_min[index]),
    weatherCode: dailyData.weather_code[index],
    precipitation: dailyData.precipitation_probability_max[index],
    windSpeed: Math.round(dailyData.wind_speed_10m_max[index]),
    icon: getWeatherIcon(dailyData.weather_code[index]),
  }));

  const hourlyHeaders = [
    { key: "icon", header: "" },
    { key: "time", header: "Time" },
    { key: "temperature", header: `Temp (${hourlyUnits.temperature_2m})` },
    { key: "precipitation", header: "Rain %" },
    { key: "windSpeed", header: `Wind (${hourlyUnits.wind_speed_10m})` },
  ];

  const dailyHeaders = [
    { key: "icon", header: "" },
    { key: "date", header: "Date" },
    { key: "maxTemp", header: `High (${dailyUnits.temperature_2m_max})` },
    { key: "minTemp", header: `Low (${dailyUnits.temperature_2m_min})` },
    { key: "precipitation", header: "Rain %" },
    { key: "windSpeed", header: `Wind (${dailyUnits.wind_speed_10m_max})` },
  ];

  return (
    <Tile className="weather-forecast">
      <h4 className="weather-forecast__title">Weather Forecast</h4>

      <Tabs
        selectedIndex={selectedTab}
        onChange={(e) => setSelectedTab(e.selectedIndex)}
      >
        <Tab label="24 Hour Forecast">
          <div className="weather-forecast__content">
            <DataTable
              rows={next24Hours}
              headers={hourlyHeaders}
              render={({ rows, headers, getHeaderProps, getRowProps }) => (
                <table className="cds--data-table cds--data-table--compact weather-forecast__table">
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
                          <td key={cell.id} className="weather-forecast__cell">
                            {cell.info.header === "icon" && (
                              <span className="weather-forecast__icon">
                                {cell.value}
                              </span>
                            )}
                            {cell.info.header === "temperature" && (
                              <span className="weather-forecast__temperature">
                                <Activity size={16} />
                                {cell.value}°
                              </span>
                            )}
                            {cell.info.header === "precipitation" && (
                              <span className="weather-forecast__precipitation">
                                <Analytics size={16} />
                                {cell.value}%
                              </span>
                            )}
                            {cell.info.header === "windSpeed" && (
                              <span className="weather-forecast__wind">
                                <TrainSpeed size={16} />
                                {cell.value}
                              </span>
                            )}
                            {![
                              "icon",
                              "temperature",
                              "precipitation",
                              "windSpeed",
                            ].includes(cell.info.header) && cell.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            />
          </div>
        </Tab>

        <Tab label="7 Day Forecast">
          <div className="weather-forecast__content">
            <DataTable
              rows={next7Days}
              headers={dailyHeaders}
              render={({ rows, headers, getHeaderProps, getRowProps }) => (
                <table className="cds--data-table cds--data-table--compact weather-forecast__table">
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
                          <td key={cell.id} className="weather-forecast__cell">
                            {cell.info.header === "icon" && (
                              <span className="weather-forecast__icon">
                                {cell.value}
                              </span>
                            )}
                            {(cell.info.header === "maxTemp" ||
                              cell.info.header === "minTemp") && (
                              <span className="weather-forecast__temperature">
                                <Activity size={16} />
                                {cell.value}°
                              </span>
                            )}
                            {cell.info.header === "precipitation" && (
                              <span className="weather-forecast__precipitation">
                                <Analytics size={16} />
                                {cell.value}%
                              </span>
                            )}
                            {cell.info.header === "windSpeed" && (
                              <span className="weather-forecast__wind">
                                <TrainSpeed size={16} />
                                {cell.value}
                              </span>
                            )}
                            {![
                              "icon",
                              "maxTemp",
                              "minTemp",
                              "precipitation",
                              "windSpeed",
                            ].includes(cell.info.header) && cell.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            />
          </div>
        </Tab>
      </Tabs>
    </Tile>
  );
}
