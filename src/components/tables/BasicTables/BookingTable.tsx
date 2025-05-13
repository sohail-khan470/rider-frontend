import { useEffect, useState } from "react";
import DispatchDriverModal from "../../modals/DispatchDriverModal";
import { useBookingStore } from "../../../stores";
import { Booking } from "../../../stores/types/booking.types";

export default function BookingTable() {
  const bookings = useBookingStore((state) => state.bookings);
  const fetchBookings = useBookingStore((state) => state.fetchCompanyBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to format fare
  const formatFare = (fare: number | null) => {
    return fare ? `$${fare.toFixed(2)}` : "N/A";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Dropoff</th>
              <th className="px-4 py-2">Fare</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Driver ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => (
              <tr key={booking.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{booking.id}</td>
                {/* <td className="px-4 py-2">{booking.customer.name}</td> */}
                <td className="px-4 py-2">{booking.pickup}</td>
                <td className="px-4 py-2">{booking.dropoff}</td>
                <td className="px-4 py-2">{formatFare(booking.fare)}</td>
                <td className="px-4 py-2">{formatStatus(booking.status)}</td>
                <td className="px-4 py-2">
                  {booking.status || (
                    <span className="text-gray-500">Not Assigned</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {booking.status === "accepted" && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Dispatch Driver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <DispatchDriverModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}
