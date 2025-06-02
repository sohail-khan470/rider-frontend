import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useLocationStore } from "../../stores";
import MapComponent from "./MapComponents";

const LocationManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const {
    searchedLocations,
    loading,
    error,
    searchLocation,
    clearSearchedLocations,
    getAllLocations,
  } = useLocationStore();

  useEffect(() => {
    // Load existing locations on component mount
    getAllLocations();
  }, [getAllLocations]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      await searchLocation(searchTerm);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    clearSearchedLocations();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Location Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and manage locations for your transportation service
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an address to search (e.g., 'Blue Area, Islamabad')"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                disabled={isSearching}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-600"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900 dark:border-red-700 dark:text-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Results Summary */}
        {searchedLocations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>
                Found {searchedLocations.length} location
                {searchedLocations.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Map View
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchedLocations.length > 0
                ? "Showing searched locations on the map"
                : "Search for locations to display them on the map"}
            </p>
          </div>

          {/* Loading State */}
          {loading && !isSearching && (
            <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  Loading locations...
                </p>
              </div>
            </div>
          )}

          {/* Map or Empty State */}
          {!loading &&
            (searchedLocations.length > 0 ? (
              <MapComponent locations={searchedLocations} />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                    No locations to display
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Search for an address to see it on the map
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Location List */}
        {searchedLocations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Location Details
            </h3>
            <div className="space-y-3">
              {searchedLocations.map((location, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {location.address}
                      </p>
                      {location.display_name &&
                        location.display_name !== location.address && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {location.display_name}
                          </p>
                        )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Coordinates: {location.lat.toFixed(6)},{" "}
                        {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationManagement;
