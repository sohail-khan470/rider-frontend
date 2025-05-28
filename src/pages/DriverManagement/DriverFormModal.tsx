import React, { useEffect, useState } from "react";
import { Driver, DriverStatus } from "./types/driver.types";
import { useDriverStore } from "../../stores";
import { jwtDecode } from "jwt-decode";
import { useCityStore } from "../../stores/city.store";
import moment from "moment-timezone";

interface DriverFormModalProps {
  driver: Driver | null;
  onClose: () => void;
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({
  driver,
  onClose,
}) => {
  const {
    drivers,
    createDriver,
    updateDriver,
    loading,
    fetchDrivers,
    updateDriverStatus,
  } = useDriverStore();
  const { cities, fetchCities, loading: citiesLoading } = useCityStore();

  const [formData, setFormData] = useState({
    name: driver?.name || "",
    email: driver?.email || "",
    phone: driver?.phone || "",
    vehicleInfo: driver?.vehicleInfo || "",
    cityId: driver?.cityId || 0,
    status: driver?.status || ("offline" as DriverStatus),
    timezone: driver?.timezone || moment.tz.guess(), // Default to user's timezone
  });

  // Get all timezones from moment-timezone
  const timezones = moment.tz.names();

  useEffect(() => {
    fetchDrivers();
    fetchCities();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Update local form state
    setFormData({
      ...formData,
      [name]: name === "cityId" ? Number(value) : value,
    });

    // If changing status and we have a driver, update in the store
    if (name === "status" && driver) {
      try {
        await updateDriverStatus(driver.id, value as DriverStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get companyId from JWT
    const token = localStorage.getItem("authToken") || "";
    const decoded = jwtDecode(token) as any;
    const companyId = decoded.companyId;

    const driverData = {
      ...formData,
      companyId: companyId,
      cityId: Number(formData.cityId),
    };

    try {
      if (driver) {
        await updateDriver(driver.id, driverData);
        fetchDrivers();
      } else {
        await createDriver(driverData as any);
        await fetchDrivers();
      }
      onClose();
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 max-w-md w-full dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            {driver ? "Edit Driver" : "Add New Driver"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="vehicleInfo"
            >
              Vehicle Information
            </label>
            <textarea
              id="vehicleInfo"
              name="vehicleInfo"
              value={formData.vehicleInfo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="cityId"
            >
              City
            </label>
            {citiesLoading ? (
              <select
                disabled
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option>Loading cities...</option>
              </select>
            ) : (
              <select
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="on_trip">On Trip</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="timezone"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-800"
              disabled={loading || citiesLoading}
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <span>{driver ? "Update" : "Create"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverFormModal;
