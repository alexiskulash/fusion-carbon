import React, { useState, useEffect } from "react";
import { ComboBox, InlineLoading, InlineNotification } from "@carbon/react";

// Major cities with coordinates for quick selection
const POPULAR_CITIES = [
  {
    id: "nyc",
    text: "New York City, NY",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "la",
    text: "Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: "chicago",
    text: "Chicago, IL",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  { id: "miami", text: "Miami, FL", latitude: 25.7617, longitude: -80.1918 },
  {
    id: "seattle",
    text: "Seattle, WA",
    latitude: 47.6062,
    longitude: -122.3321,
  },
  { id: "london", text: "London, UK", latitude: 51.5074, longitude: -0.1278 },
  { id: "paris", text: "Paris, France", latitude: 48.8566, longitude: 2.3522 },
  { id: "tokyo", text: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
  {
    id: "sydney",
    text: "Sydney, Australia",
    latitude: -33.8688,
    longitude: 151.2093,
  },
  { id: "berlin", text: "Berlin, Germany", latitude: 52.52, longitude: 13.405 },
];

export default function LocationSearch({ onLocationChange, currentLocation }) {
  const [searchResults, setSearchResults] = useState(POPULAR_CITIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Geocoding API call for custom search
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults(POPULAR_CITIES);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using OpenStreetMap Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search locations");
      }

      const data = await response.json();

      const locations = data.map((item, index) => ({
        id: `search-${index}`,
        text: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        name: item.name || item.display_name.split(",")[0],
      }));

      // Combine search results with popular cities if we have results
      if (locations.length > 0) {
        setSearchResults([...locations, ...POPULAR_CITIES]);
      } else {
        setSearchResults(POPULAR_CITIES);
        setError("No locations found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to search locations. Using popular cities instead.");
      setSearchResults(POPULAR_CITIES);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (inputValue) => {
    setSearchTerm(inputValue);

    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchLocations(inputValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSelectionChange = (selectedItem) => {
    if (selectedItem) {
      const location = {
        latitude: selectedItem.latitude,
        longitude: selectedItem.longitude,
        name: selectedItem.name || selectedItem.text.split(",")[0],
      };
      onLocationChange(location);
    }
  };

  return (
    <div className="location-search">
      <ComboBox
        id="location-search-combobox"
        items={searchResults}
        itemToString={(item) => (item ? item.text : "")}
        placeholder="Search for a city or select from popular locations..."
        titleText="Select Location"
        helperText="Type to search for cities worldwide or select from popular locations"
        onInputChange={handleInputChange}
        onChange={({ selectedItem }) => handleSelectionChange(selectedItem)}
        value={currentLocation ? { text: currentLocation.name } : null}
      />

      {loading && (
        <div className="location-search__loading">
          <InlineLoading description="Searching locations..." />
        </div>
      )}

      {error && (
        <InlineNotification
          kind="warning"
          title="Search Note"
          subtitle={error}
          hideCloseButton
        />
      )}
    </div>
  );
}
