import React, { useEffect, useState } from "react";
import { Booking, BookingStatus } from "../../stores/types/booking.types";

import BookingDetailModal from "./BookingDetailModal";
import CreateBookingModal from "./CreateBookingModal";
import { useBookingStore, useDriverStore } from "../../stores";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const BookingManagement: React.FC = () => {
  const {
    bookings,
    loading,
    error,
    fetchCompanyBookings,
    cancelBooking,
    assignDriver,
    updateBookingStatus,
    clearError,
    startBooking,
    acceptBooking,
    completeBooking,
  } = useBookingStore();
  const { fetchDrivers, drivers } = useDriverStore();

  const [selectedDrivers, setSelectedDrivers] = useState<{
    [key: number]: number | null;
  }>({});
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchCompanyBookings();
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, []);

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

  console.log(filteredBookings[0], "IIIIIIIIIIIII");

  const handleAssignDriver = async (bookingId: number) => {
    const driverId = selectedDrivers[bookingId];
    if (driverId && bookingId) {
      await assignDriver(bookingId, driverId);
      setSelectedDrivers((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleStatusUpdate = async (
    bookingId: number,
    status: BookingStatus
  ) => {
    if (bookingId) {
      await updateBookingStatus(bookingId, status);
    }
  };

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

  const openBookingDetail = (booking: Booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setIsDetailModalOpen(true);
    }
  };

  const totalBookings = bookings?.length || 0;
  const pendingBookings =
    bookings?.filter((b) => b?.status === "pending")?.length || 0;
  const completedBookings =
    bookings?.filter((b) => b?.status === "completed")?.length || 0;
  const ongoingBookings =
    bookings?.filter((b) => b?.status === "ongoing")?.length || 0;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
            Booking Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your ride bookings and assign drivers
          </p>
        </div>
        <button
          onClick={() => fetchCompanyBookings()}
          disabled={loading}
          className="flex items-center justify-center p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded-lg"
          title="Refresh bookings"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm md:text-base w-full md:w-auto"
        >
          Create Booking
        </button>
      </div>

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
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm md:text-base"
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
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-blue-600">
            {totalBookings}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-yellow-600">
            {pendingBookings}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-blue-500">
            {bookings?.filter((b) => b?.status === "accepted")?.length || 0}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Accepted</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-purple-600">
            {ongoingBookings}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Ongoing</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-green-600">
            {completedBookings}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
          <div className="font-bold text-xl md:text-3xl text-red-600">
            {bookings?.filter((b) => b?.status === "cancelled")?.length || 0}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Cancelled</div>
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
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dropoff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking?.id || "N/A"}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.customer?.name ||
                          `Customer ${booking?.customerId || "N/A"}`}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.pickup || "N/A"}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.dropoff || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking?.driverId ? (
                          <span className="truncate max-w-[100px] inline-block">
                            {booking?.driver?.name ||
                              `Driver ${booking.driverId}`}
                          </span>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <select
                              className="rounded text-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full sm:w-auto"
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
                              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded disabled:opacity-50 whitespace-nowrap"
                            >
                              Assign
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
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
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${booking?.fare?.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {booking?.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  booking?.id &&
                                  acceptBooking(booking.id, "accepted")
                                }
                                className="text-indigo-600 hover:text-indigo-900 text-xs bg-indigo-50 px-2 py-1 rounded whitespace-nowrap"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  booking?.id && cancelBooking(booking.id)
                                }
                                className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking?.status === "accepted" && (
                            <button
                              onClick={() =>
                                booking?.id &&
                                startBooking(booking.id, "ongoing")
                              }
                              className="text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-1 rounded whitespace-nowrap"
                            >
                              Start
                            </button>
                          )}

                          {booking?.status === "ongoing" && (
                            <button
                              onClick={() =>
                                booking?.id &&
                                completeBooking(booking.id, "completed")
                              }
                              className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded whitespace-nowrap"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() =>
                              booking && openBookingDetail(booking)
                            }
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded whitespace-nowrap"
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
