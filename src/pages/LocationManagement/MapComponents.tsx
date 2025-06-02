import React, { useEffect } from "react";
import { MapPin } from "lucide-react";
import SimpleMap from "./SimpleMap";
import StaticMapView from "./StaticMapView";

// Simple map component using OpenStreetMap
const MapComponent: React.FC<{ locations: any[] }> = ({ locations }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  const [mapLoaded, setMapLoaded] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.L) {
        setMapLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add Leaflet CSS if not already added
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Add Leaflet JS if not already added
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

  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No locations to display</p>
          <p className="text-gray-500">
            Search for an address to see it on the map
          </p>
        </div>
      </div>
    );
  }

  return mapLoaded ? (
    <SimpleMap locations={locations} />
  ) : (
    <StaticMapView locations={locations} />
  );
};

export default MapComponent;
