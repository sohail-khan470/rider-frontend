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

  if (!statistics) return null;

  // Extract data from the statistics object based on the console output
  const {
    bookings = {},
    customers = {},
    drivers = {},
    currencies = {},
  } = statistics;

  console.log(bookings);

  const totalCompanies = companies?.length || 0;
  const pendingCompanies = currencies?.unapproved || 0;
  const totalBookings = bookings?.total || 0;
  const completedBookings = bookings?.completed || 0;
  const pendingBookings = bookings?.pending || 0;
  const totalCustomers = customers?.total || 0;
  const totalDrivers = drivers?.total || 0;
  const activeDrivers = drivers?.active || 0;

  // Since recent bookings aren't in the console output, we'll use an empty array
  const recentBookings = bookings.recent;

  console.log(recentBookings);
  const metrics = [
    {
      label: "Total Companies",
      value: totalCompanies,
      icon: <GroupIcon className="text-blue-600 size-7 dark:text-blue-400" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Total Drivers",
      value: totalDrivers,
      subValue: `${activeDrivers} active`,
      icon: (
        <BoxIconLine className="text-green-600 size-7 dark:text-green-400" />
      ),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      label: "Registered Customers",
      value: totalCustomers,
      icon: (
        <BoxIconLine className="text-purple-600 size-7 dark:text-purple-400" />
      ),
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      subValue: `${completedBookings} completed, ${pendingBookings} pending`,
      icon: (
        <BoxIconLine className="text-orange-600 size-7 dark:text-orange-400" />
      ),
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      label: "Pending Approvals",
      value: pendingCompanies,
      icon: <GroupIcon className="text-red-600 size-7 dark:text-red-400" />,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    // {
    //   label: "Approved Currencies",
    //   value: currencies?.approved || 0,
    //   icon: <BoxIconLine className="text-teal-600 size-7 dark:text-teal-400" />,
    //   bgColor: "bg-teal-50 dark:bg-teal-900/20",
    //   borderColor: "border-teal-200 dark:border-teal-800",
    // },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Company Analytics Dashboard
          </h1>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border-2 ${item.borderColor} bg-white dark:bg-gray-800/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm w-full max-w-sm`}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent dark:from-gray-800/80 dark:to-transparent"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${item.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                {/* Stats */}
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.value.toLocaleString()}
                  </h4>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                    {item.label}
                  </p>
                  {item.subValue && (
                    <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {item.subValue}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Bookings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Latest booking activities across all companies
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <BoxIconLine className="text-gray-400 size-8" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Recent Bookings
                </h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
                  When bookings are made, they will appear here for quick access
                  and monitoring.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {[
                          "Company",
                          "Pickup",
                          "Dropoff",
                          "Status",
                          "Requested At",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentBookings.map((booking: any, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-medium">
                            {booking.companyName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">
                            {booking.pickup}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">
                            {booking.dropoff}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">
                            {new Date(booking.requestedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
