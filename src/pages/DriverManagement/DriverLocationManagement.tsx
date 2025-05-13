// src/pages/DriverManagement/DriverLocationManagement.tsx
import { useState, useEffect } from "react";
import { useDriverStore } from "../../store/driver.store";
import Breadcrumb from "../../components/Breadcrumb";
import NearbyDriversMap from "../../components/drivers/NearbyDriversMap";
import DriverTable from "../../components/drivers/DriverTable";

const DriverLocationManagement = () => {
  const { fetchNearbyDrivers, nearbyDrivers, loading, error } =
    useDriverStore();

  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    radius: 5,
    companyId: null as number | null,
  });

  useEffect(() => {
    // Default to current location if available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));

        fetchNearbyDrivers(
          position.coords.latitude,
          position.coords.longitude,
          location.radius,
          location.companyId
        );
      },
      () => {
        // Fallback to a default location if geolocation is not available
        const defaultLat = 40.7128;
        const defaultLng = -74.006;

        setLocation((prev) => ({
          ...prev,
          lat: defaultLat,
          lng: defaultLng,
        }));

        fetchNearbyDrivers(
          defaultLat,
          defaultLng,
          location.radius,
          location.companyId
        );
      }
    );
  }, []);

  const handleSearch = () => {
    fetchNearbyDrivers(
      location.lat,
      location.lng,
      location.radius,
      location.companyId
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]:
        name === "companyId"
          ? value
            ? parseInt(value)
            : null
          : parseFloat(value),
    }));
  };

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Driver Locations" />

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default p-4 md:p-6 xl:p-7.5">
          <h2 className="text-2xl font-semibold mb-6">Nearby Drivers</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-black">Latitude</label>
              <input
                type="number"
                name="lat"
                value={location.lat}
                onChange={handleLocationChange}
                step="0.0001"
                className="w-full rounded border border-stroke py-3 px-4 focus:border-primary focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Longitude</label>
              <input
                type="number"
                name="lng"
                value={location.lng}
                onChange={handleLocationChange}
                step="0.0001"
                className="w-full rounded border border-stroke py-3 px-4 focus:border-primary focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Radius (km)</label>
              <input
                type="number"
                name="radius"
                value={location.radius}
                onChange={handleLocationChange}
                min="1"
                max="50"
                className="w-full rounded border border-stroke py-3 px-4 focus:border-primary focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">
                Company ID (Optional)
              </label>
              <input
                type="number"
                name="companyId"
                value={location.companyId || ""}
                onChange={handleLocationChange}
                className="w-full rounded border border-stroke py-3 px-4 focus:border-primary focus-visible:outline-none"
                placeholder="Filter by company"
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center bg-primary py-2 px-6 text-white rounded-md hover:bg-opacity-90"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Nearby Drivers"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="h-96 mb-6">
            <NearbyDriversMap
              drivers={nearbyDrivers}
              centerLat={location.lat}
              centerLng={location.lng}
              radius={location.radius}
            />
          </div>

          <h3 className="text-xl font-semibold mb-4">
            Drivers Found: {nearbyDrivers.length}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Distance (km)</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nearbyDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-200">
                    <td className="p-3">{driver.name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          driver.status === "online"
                            ? "bg-green-100 text-green-800"
                            : driver.status === "on_trip"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="p-3">{driver.distance.toFixed(2)}</td>
                    <td className="p-3">
                      <a
                        href={`/drivers/${driver.id}`}
                        className="text-primary hover:underline"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
                {nearbyDrivers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No drivers found in this area
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLocationManagement;
