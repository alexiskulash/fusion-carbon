import React, { useState } from "react";
import { Search, Button, InlineLoading } from "@carbon/react";
import { Location } from "@carbon/icons-react";

const WeatherSearch = ({ onLocationSelect, isLoading }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationClick = async () => {
    try {
      setIsSearching(true);
      const location = await import("../services/weatherService").then(
        (module) => module.WeatherService.getCurrentLocation(),
      );
      onLocationSelect(location, "Current Location");
    } catch (error) {
      console.error("Error getting current location:", error);
      // You could show a notification here
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    try {
      setIsSearching(true);
      const { WeatherService } = await import("../services/weatherService");
      const cities = await WeatherService.searchCities(searchValue);

      if (cities.length > 0) {
        const city = cities[0]; // Use the first result
        const location = {
          latitude: city.latitude,
          longitude: city.longitude,
        };
        const locationName = `${city.name}, ${city.country}`;
        onLocationSelect(location, locationName);
        setSearchValue("");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="weather-search">
      <form onSubmit={handleSearchSubmit} className="weather-search__form">
        <div className="weather-search__input-group">
          <Search
            id="location-search"
            labelText="Search for a city"
            placeholder="Enter city name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isLoading || isSearching}
            className="weather-search__input"
          />
          <Button
            type="submit"
            disabled={isLoading || isSearching || !searchValue.trim()}
            className="weather-search__submit"
          >
            {isSearching ? <InlineLoading /> : "Search"}
          </Button>
        </div>
      </form>

      <div className="weather-search__location-button">
        <Button
          kind="secondary"
          renderIcon={Location}
          onClick={handleLocationClick}
          disabled={isLoading || isSearching}
          iconDescription="Use current location"
        >
          {isSearching ? (
            <InlineLoading description="Getting location..." />
          ) : (
            "Use Current Location"
          )}
        </Button>
      </div>
    </div>
  );
};

export default WeatherSearch;
