import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Driver } from "../../stores/types/driver.types";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface NearbyDriversMapProps {
  drivers: Driver[];
  centerLat: number;
  centerLng: number;
  radius: number;
}

const NearbyDriversMap = ({
  drivers,
  centerLat,
  centerLng,
  radius,
}: NearbyDriversMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);

  // Custom icons for different driver statuses
  const createDriverIcon = (status: string) => {
    let color = "";
    switch (status) {
      case "online":
        color = "green";
        break;
      case "on_trip":
        color = "blue";
        break;
      case "offline":
        color = "gray";
        break;
      default:
        color = "red";
    }

    return L.divIcon({
      className: "custom-driver-marker",
      html: `<div style="
        background-color: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  useEffect(() => {
    // Initialize the map
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [centerLat, centerLng],
        13
      );

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMapRef.current);

      // Add the search radius circle
      circleRef.current = L.circle([centerLat, centerLng], {
        color: "#4338CA",
        fillColor: "#4338CA",
        fillOpacity: 0.1,
        radius: radius * 1000, // Convert km to meters
      }).addTo(leafletMapRef.current);
    }

    return () => {
      // Clean up map on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update map center and circle when location changes
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([centerLat, centerLng], 13);

      if (circleRef.current) {
        circleRef.current.setLatLng([centerLat, centerLng]);
        circleRef.current.setRadius(radius * 1000); // Convert km to meters
      }
    }
  }, [centerLat, centerLng, radius]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add markers for drivers
    if (leafletMapRef.current) {
      drivers.forEach((driver) => {
        // Check if location data is available on the driver object
        if (driver.location) {
          const position: [number, number] = [
            driver.location.lat,
            driver.location.lng,
          ];

          const marker = L.marker(position, {
            icon: createDriverIcon(driver.status),
            title: driver.name || `Driver ${driver.id}`,
          }).addTo(leafletMapRef.current!);

          // Add popup with driver details
          const popupContent = `
            <div>
              <h3 style="font-weight: bold; margin: 0 0 8px 0;">${
                driver.name || `Driver ${driver.id}`
              }</h3>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${
                driver.status
              }</p>
              <p style="margin: 4px 0;"><strong>Distance:</strong> ${
                driver.distance?.toFixed(2) || "N/A"
              } km</p>
              ${
                driver.vehicleInfo
                  ? `<p style="margin: 4px 0;"><strong>Vehicle:</strong> ${driver.vehicleInfo}</p>`
                  : ""
              }
              ${
                driver.phone
                  ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${driver.phone}</p>`
                  : ""
              }
            </div>
          `;

          marker.bindPopup(popupContent);

          markersRef.current.push(marker);
        }
      });
    }
  }, [drivers]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded"></div>

      {/* Legend for driver statuses */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded shadow-md z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Driver Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>On Trip</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* Map controls info */}
      <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow text-xs text-gray-600 z-[1000]">
        Powered by OpenStreetMap
      </div>
    </div>
  );
};

export default NearbyDriversMap;
