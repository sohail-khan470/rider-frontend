import { useState } from "react";

export default function DispatchDriverModal({ booking, onClose }: any) {
  const [dispatchType, setDispatchType] = useState("manual");
  const [selectedDriver, setSelectedDriver] = useState("");

  const drivers = ["John", "Mike", "Sarah"]; // From backend

  const handleDispatch = () => {
    if (dispatchType === "manual" && !selectedDriver) return;
    // Dispatch logic goes here (API call)
    alert(
      `Driver ${
        dispatchType === "manual" ? selectedDriver : "Auto-Assigned"
      } assigned to booking ${booking.id}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Dispatch Driver - Booking {booking.id}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Dispatch Type
            </label>
            <select
              value={dispatchType}
              onChange={(e) => setDispatchType(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="manual">Manual</option>
              <option value="auto">Auto Assign</option>
            </select>
          </div>

          {dispatchType === "manual" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Select Driver
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select</option>
                {drivers.map((driver) => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
