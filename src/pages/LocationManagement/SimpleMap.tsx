import React, { useEffect, useRef } from "react";

// Simple OpenStreetMap component using Leaflet
const SimpleMap: React.FC<{ locations: any[] }> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Add Leaflet CSS and JS if not already added
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!window.L && !document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (window.L) {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map
      const map = window.L.map(mapRef.current).setView([33.6844, 73.0479], 10);

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;
      updateMarkers();
    }

    function updateMarkers() {
      if (!mapInstanceRef.current || !window.L) return;

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new markers
      if (locations.length > 0) {
        const group = new window.L.FeatureGroup();

        locations.forEach((location, index) => {
          const marker = window.L.marker([location.lat, location.lng])
            .bindPopup(`
              <div style="max-width: 200px;">
                <strong>Location ${index + 1}</strong><br/>
                ${location.address || "No address provided"}<br/>
                <small>Lat: ${location.lat.toFixed(
                  6
                )}, Lng: ${location.lng.toFixed(6)}</small>
              </div>
            `);

          marker.addTo(mapInstanceRef.current);
          group.addLayer(marker);
        });

        // Fit map to show all markers
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    updateMarkers();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-gray-200"
      style={{ minHeight: "400px" }}
    />
  );
};

// Fallback static map component
const StaticMapView: React.FC<{ locations: any[] }> = ({ locations }) => {
  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">🗺️</div>
          <p className="text-gray-600 text-lg mb-2">No locations to display</p>
          <p className="text-gray-500">
            Search for an address to see it on the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-blue-50 rounded-lg border border-gray-200 p-6">
      <div className="h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Map View (Interactive map loading...)
        </h3>
        <div className="flex-1 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-600">Interactive map is loading...</p>
            <p className="text-sm text-gray-500 mt-2">
              Found {locations.length} location
              {locations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
