import { useEffect, useRef } from "react";
import { Driver } from "../../stores/types/driver.types";

// Add Google Maps types to the global window object
declare global {
  interface Window {
    google?: {
      maps: {
        Map: any;
        Marker: any;
        Circle: any;
        InfoWindow: any;
        LatLng: any;
        MapTypeId: {
          ROADMAP: string;
        };
        SymbolPath: {
          CIRCLE: any;
        };
      };
    };
  }
}

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
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    // Initialize the map
    const googleMaps = window.google?.maps;
    if (googleMaps && mapRef.current && !googleMapRef.current) {
      const center = { lat: centerLat, lng: centerLng };
      const mapOptions = {
        center,
        zoom: 13,
        mapTypeId: googleMaps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      };

      googleMapRef.current = new googleMaps.Map(mapRef.current, mapOptions);

      // Add the search radius circle
      circleRef.current = new googleMaps.Circle({
        strokeColor: "#4338CA",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4338CA",
        fillOpacity: 0.1,
        map: googleMapRef.current,
        center,
        radius: radius * 1000, // Convert km to meters
      });
    }

    return () => {
      // Clean up markers on unmount
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Clean up circle on unmount
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update map center and circle when location changes
    if (googleMapRef.current) {
      const center = { lat: centerLat, lng: centerLng };
      googleMapRef.current.setCenter(center);

      if (circleRef.current) {
        circleRef.current.setCenter(center);
        circleRef.current.setRadius(radius * 1000); // Convert km to meters
      }
    }
  }, [centerLat, centerLng, radius]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for drivers
    const googleMaps = window.google?.maps;
    if (googleMapRef.current && googleMaps) {
      drivers.forEach((driver) => {
        // Check if location data is available on the driver object
        if (driver.location) {
          const position = {
            lat: driver.location.lat,
            lng: driver.location.lng,
          };

          // Determine icon color based on driver status
          let iconColor = "";
          switch (driver.status) {
            case "online":
              iconColor = "green";
              break;
            case "on_trip":
              iconColor = "blue";
              break;
            case "offline":
              iconColor = "gray";
              break;
            default:
              iconColor = "red";
          }

          const marker = new googleMaps.Marker({
            position,
            map: googleMapRef.current,
            title: driver.name || `Driver ${driver.id}`,
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              fillColor: iconColor,
              fillOpacity: 1,
              strokeWeight: 1,
              scale: 8,
            },
          });

          // Add info window with driver details
          const infoWindow = new googleMaps.InfoWindow({
            content: `
              <div>
                <h3 style="font-weight: bold;">${
                  driver.name || `Driver ${driver.id}`
                }</h3>
                <p>Status: ${driver.status}</p>
                <p>Distance: ${driver.distance?.toFixed(2) || "N/A"} km</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(googleMapRef.current, marker);
          });

          markersRef.current.push(marker);
        }
      });
    }
  }, [drivers]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded"></div>
      {!window.google && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <p className="text-lg font-medium">
            Google Maps API not loaded. Please check your API key.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyDriversMap;
