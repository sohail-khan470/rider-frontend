// src/pages/DriverManagement/DriverDetail.tsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../../components/Drivers/BreadCrumb";
import DriverInfo from "../../components/Drivers/DriverInfo";
import { useDriverStore } from "../../stores";
import DriverBookingHistory from "../../components/Drivers/DriverBookingHistory";
import DriverAvailabilityCalendar from "../../components/Drivers/DriverAvalibilityCalender";
import DriverLocationMap from "../../components/Drivers/DriverLocationMap";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DriverDetail = () => {
  const { id } = useParams();
  const { currentDriver, loading, error, fetchDriverById, updateDriverStatus } =
    useDriverStore();

  useEffect(() => {
    if (id) {
      fetchDriverById(parseInt(id));
    }
  }, [id]);

  const handleStatusChange = (status: "offline" | "online" | "on_trip") => {
    if (id) {
      updateDriverStatus(parseInt(id), status);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  if (!currentDriver) {
    return (
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Driver not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Driver Details" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Driver: {currentDriver.name}</h2>
        <div className="flex gap-3">
          <Link
            to={`/drivers/edit/${currentDriver.id}`}
            className="inline-flex items-center justify-center bg-primary py-2 px-4 text-white rounded-md hover:bg-opacity-90"
          >
            Edit Driver
          </Link>
          <div className="dropdown relative">
            <button className="bg-gray-100 py-2 px-4 rounded-md">
              Actions ▼
            </button>
            <div className="dropdown-menu absolute right-0 mt-2 hidden bg-white shadow-md rounded-md border border-gray-200 z-10">
              <button
                onClick={() => handleStatusChange("online")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Set Online
              </button>
              <button
                onClick={() => handleStatusChange("offline")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Set Offline
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DriverInfo driver={currentDriver} />
          <DriverBookingHistory bookings={currentDriver.bookings || []} />
        </div>
        <div className="md:col-span-1">
          <DriverLocationMap location={currentDriver.location} />
          <DriverAvailabilityCalendar
            availability={currentDriver.availability || []}
            driverId={currentDriver.id}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;
