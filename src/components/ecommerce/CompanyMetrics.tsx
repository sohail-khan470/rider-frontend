import { useEffect } from "react";
import { BoxIconLine, GroupIcon } from "../../icons";
import { useCompanyStore, useSuperAdminStore } from "../../stores";

export default function CompanyMetrics() {
  const { statistics, getStatistics } = useSuperAdminStore();
  const { companies, fetchAllCompanies } = useCompanyStore();

  useEffect(() => {
    getStatistics();
    fetchAllCompanies();
  }, []);

  console.log(statistics);
  if (!statistics) return null;

  const {
    pendingCompanies,
    recentBookings,
    totalBookings,
    totalCompanies,
    totalCustomers,
    totalDrivers,
  } = statistics.result;

  const metrics = [
    {
      label: "Total Companies",
      value: totalCompanies,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Registered Drivers",
      value: totalDrivers,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Registered Customers",
      value: totalCustomers,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Pending Companies",
      value: pendingCompanies,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Recent Bookings",
      value: recentBookings?.length,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {item.icon}
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {item.value}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Recent Bookings
        </h3>
        {recentBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Pickup
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Dropoff
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Requested At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {recentBookings.map((booking, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.company?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.pickup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.dropoff}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(booking.requestedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
