import { X } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { useCityStore } from "../../stores/city.store";
import { useDriverStore } from "../../stores";

const CreateScheduleModal = ({ onClose, onSubmit, loading }: any) => {
  const { cities, fetchCities } = useCityStore();
  const { drivers, fetchDrivers } = useDriverStore();

  useEffect(() => {
    fetchCities();
    fetchDrivers();
  }, []);

  const token = localStorage.getItem("authToken") as any;
  const decoded = jwtDecode(token) as any;
  const companyId = decoded.companyId;

  const [formData, setFormData] = useState({
    companyId,
    driverId: "",
    fromCityId: "",
    toCityId: "",
    departure: "",
    estimatedArrival: "",
    returnTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formatDate = (dateString: string) => {
        if (!dateString) return undefined;
        return moment(dateString).format("YYYY-MM-DDTHH:mm:ssZ");
      };

      await onSubmit({
        ...formData,
        driverId: parseInt(formData.driverId),
        fromCityId: parseInt(formData.fromCityId),
        toCityId: parseInt(formData.toCityId),
        departure: formatDate(formData.departure),
        estimatedArrival: formatDate(formData.estimatedArrival),
        returnTime: formData.returnTime
          ? formatDate(formData.returnTime)
          : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  // Filter drivers that belong to the current company
  const companyDrivers = drivers.filter(
    (driver) => driver.companyId === companyId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Create New Schedule
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Driver
              </label>
              <select
                required
                value={formData.driverId}
                onChange={(e) =>
                  setFormData({ ...formData, driverId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select a driver</option>
                {companyDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                From City
              </label>
              <select
                required
                value={formData.fromCityId}
                onChange={(e) =>
                  setFormData({ ...formData, fromCityId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                To City
              </label>
              <select
                required
                value={formData.toCityId}
                onChange={(e) =>
                  setFormData({ ...formData, toCityId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Departure Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.departure}
                onChange={(e) =>
                  setFormData({ ...formData, departure: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Estimated Arrival
              </label>
              <input
                type="datetime-local"
                required
                value={formData.estimatedArrival}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedArrival: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Return Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.returnTime}
                onChange={(e) =>
                  setFormData({ ...formData, returnTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? "Creating..." : "Create Schedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
