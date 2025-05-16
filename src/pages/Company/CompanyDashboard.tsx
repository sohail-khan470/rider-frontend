import PageMeta from "../../components/common/PageMeta";
import { Outlet } from "react-router";
import { useCompanyStore, useAuthStore, useStaffStore } from "../../stores";
import { useEffect } from "react";

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    {icon && (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
        {icon}
      </div>
    )}
    <h4 className="text-base font-semibold text-gray-700 dark:text-white">
      {title}
    </h4>
    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
      {value}
    </p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
    <span className="text-gray-600 dark:text-gray-400 font-medium">
      {label}
    </span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default function CompanyDashboard() {
  const { getCompanyById } = useCompanyStore();
  const { currentCompany } = useCompanyStore() as any;
  const { user } = useAuthStore() as any;
  const currentAdmins = useStaffStore().admin || [];
  const getAdmin = useStaffStore().getAdmin;
  console.log(user);

  useEffect(() => {
    if (user) {
      getCompanyById(user.companyId);
    }
    if (currentCompany) {
      getAdmin(currentCompany.id);
    }
  }, [user]);

  // const adminUser = currentCompany?.staff?.find(
  //   (u: any) => u.role?.name === "Admin"
  // );

  const admin = {
    name: user?.name || "N/A",
    email: user?.email || "N/A",
    role: user?.role || "N/A",
  };

  const company = {
    name: currentCompany?.name || "N/A",
    email: currentCompany?.email || "N/A",
    timezone: currentCompany?.timezone || "N/A",
    isApproved: currentCompany?.isApproved ? "Yes" : "No",
    createdAt: currentCompany?.createdAt
      ? new Date(currentCompany.createdAt).toLocaleDateString()
      : "N/A",
  };

  const stats = {
    customers: currentCompany?._count?.customers || 0,
    drivers: currentCompany?._count?.drivers || 0,
    staff: currentCompany?._count?.users || 0,
    bookings: currentCompany?._count?.bookings || 0,
  };

  return (
    <>
      <PageMeta
        title="Company Dashboard | TailAdmin"
        description="Dashboard view showing company overview, drivers, cars and admin info"
      />

      {/* Company Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {company.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {company.email}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Status: {company.isApproved}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 mb-6">
        <DashboardCard title="Total Customers" value={stats.customers} />
        <DashboardCard title="Total Drivers" value={stats.drivers} />
        <DashboardCard title="Total Staff" value={stats.staff} />
        <DashboardCard title="Total Bookings" value={stats.bookings} />
      </div>

      {/* Company Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Company Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Company Information
          </h2>
          <DetailRow label="Company Name" value={company.name} />
          <DetailRow label="Email" value={company.email} />
          <DetailRow label="Timezone" value={company.timezone} />
          <DetailRow label="Approval Status" value={company.isApproved} />
          <DetailRow label="Date Created" value={company.createdAt} />
        </div>
        {/* Admin Details */}
        {/* Admin Details */}
        {currentAdmins.data && (
          <>
            {currentAdmins.data.map((currentAdmin: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Admin Details
                </h2>
                <DetailRow label="Admin Name" value={currentAdmin.name} />
                <DetailRow label="Email" value={currentAdmin.email} />
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
