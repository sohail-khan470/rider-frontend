import PageMeta from "../../components/common/PageMeta";
import BookingTable from "../../components/tables/BasicTables/BookingTable";

// import BookingTable from "../../components/booking/BookingTable";

export default function BookingManagement() {
  return (
    <>
      <PageMeta
        title="Booking Management | Company Dashboard"
        description="Manage all bookings and assign drivers manually or automatically."
      />

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Booking Management
        </h1>
        <BookingTable />
      </div>
    </>
  );
}
