import React, { useEffect, useState } from "react";
import { Booking, BookingStatus } from "../../stores/types/booking.types";

import BookingDetailModal from "./BookingDetailModal";
import CreateBookingModal from "./CreateBookingModal";
import { useBookingStore, useDriverStore } from "../../stores";

const BookingManagement: React.FC = () => {
  const {
    bookings = [],
    loading,
    error,
    fetchCompanyBookings,
    cancelBooking,
    assignDriver,
    updateBookingStatus,
    clearError,
  } = useBookingStore();
  const { fetchDrivers, drivers = [] } = useDriverStore();

  // const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<{
    [key: number]: number | null;
  }>({});
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch drivers
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchCompanyBookings();
  }, [fetchCompanyBookings]);

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const filteredBookings = bookings.filter((booking) => {
    if (!booking) return false;

    const status = booking.status || "";
    const pickup = booking.pickup || "";
    const dropoff = booking.dropoff || "";
    const id = booking.id ? String(booking.id) : "";

    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const matchesSearch =
      pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Handler for driver assignment
  // const handleAssignDriver = async (bookingId: number) => {
  //   if (selectedDriverId && bookingId) {
  //     await assignDriver(bookingId, selectedDriverId);
  //     setSelectedDriverId(null);
  //   }
  // };
  const handleAssignDriver = async (bookingId: number) => {
    const driverId = selectedDrivers[bookingId];
    if (driverId && bookingId) {
      await assignDriver(bookingId, driverId);

      setSelectedDrivers((prev) => ({ ...prev, [bookingId]: null })); // Reset after assignment
      fetchCompanyBookings();
    }
  };

  // Handle status updates
  const handleStatusUpdate = async (
    bookingId: number,
    status: BookingStatus
  ) => {
    if (bookingId) {
      await updateBookingStatus(bookingId, status);
      fetchCompanyBookings();
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: BookingStatus) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Open booking detail modal
  const openBookingDetail = (booking: Booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setIsDetailModalOpen(true);
    }
  };

  // Calculate booking stats safely
  const totalBookings = bookings?.length || 0;
  const pendingBookings =
    bookings?.filter((b) => b?.status === "pending")?.length || 0;
  const completedBookings =
    bookings?.filter((b) => b?.status === "completed")?.length || 0;
  const ongoingBookings =
    bookings?.filter((b) => b?.status === "ongoing")?.length || 0;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage your ride bookings and assign drivers
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Create Booking
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={clearError}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Bookings
            </label>
            <input
              type="text"
              placeholder="Search by ID, pickup or dropoff location..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-bold text-3xl text-blue-600">
            {totalBookings}
          </div>
          <div className="text-gray-600">Total Bookings</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-bold text-3xl text-yellow-600">
            {pendingBookings}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-bold text-3xl text-green-600">
            {completedBookings}
          </div>
          <div className="text-gray-600">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-bold text-3xl text-purple-600">
            {ongoingBookings}
          </div>
          <div className="text-gray-600">Ongoing</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bookings
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pickup
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dropoff
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Driver
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fare
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No bookings found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking: Booking) => (
                    <tr
                      key={booking?.id || Math.random()}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking?.id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.customer?.name ||
                          `Customer ${booking?.customerId || "N/A"}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.pickup || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.dropoff || "N/A"}
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.driverId ? (
                          booking?.driver?.name || `Driver ${booking.driverId}`
                        ) : (
                          <div className="flex items-center">
                            <select
                              className="rounded mr-2 text-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={selectedDriverId || ""}
                              onChange={(e) =>
                                setSelectedDriverId(Number(e.target.value))
                              }
                              disabled={booking?.status !== "pending"}
                            >
                              <option value="">Select Driver</option>
                              {drivers.map((driver) => (
                                <option key={driver?.id} value={driver?.id}>
                                  {driver?.name || "Unknown Driver"}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                booking?.id && handleAssignDriver(booking.id)
                              }
                              disabled={
                                !selectedDriverId ||
                                booking?.status !== "pending"
                              }
                              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded disabled:opacity-50"
                            >
                              Assign
                            </button>
                          </div>
                        )}
                      </td> */}

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.driverId ? (
                          booking?.driver?.name || `Driver ${booking.driverId}`
                        ) : (
                          <div className="flex items-center">
                            <select
                              className="rounded mr-2 text-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={selectedDrivers[booking.id] || ""}
                              onChange={(e) => {
                                const driverId = Number(e.target.value);
                                setSelectedDrivers((prev) => ({
                                  ...prev,
                                  [booking.id]: driverId,
                                }));
                              }}
                              disabled={booking?.status !== "pending"}
                            >
                              <option value="">Select Driver</option>
                              {drivers.map((driver) => (
                                <option key={driver?.id} value={driver?.id}>
                                  {driver?.name || "Unknown Driver"}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                booking?.id && handleAssignDriver(booking.id)
                              }
                              disabled={
                                !selectedDrivers[booking.id] ||
                                booking?.status !== "pending"
                              }
                              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded disabled:opacity-50"
                            >
                              Assign
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            booking?.status as BookingStatus
                          )}`}
                        >
                          {booking?.status
                            ? booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${booking?.fare?.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking?.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  booking?.id &&
                                  handleStatusUpdate(booking.id, "accepted")
                                }
                                className="text-indigo-600 hover:text-indigo-900 text-xs bg-indigo-50 px-2 py-1 rounded"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  booking?.id && cancelBooking(booking.id)
                                }
                                className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking?.status === "accepted" && (
                            <button
                              onClick={() =>
                                booking?.id &&
                                handleStatusUpdate(booking.id, "ongoing")
                              }
                              className="text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-1 rounded"
                            >
                              Start Trip
                            </button>
                          )}

                          {booking?.status === "ongoing" && (
                            <button
                              onClick={() =>
                                booking?.id &&
                                handleStatusUpdate(booking.id, "completed")
                              }
                              className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() =>
                              booking && openBookingDetail(booking)
                            }
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {selectedBooking && (
        <BookingDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingManagement;
