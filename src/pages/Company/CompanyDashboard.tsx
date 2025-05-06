import PageMeta from "../../components/common/PageMeta";
import { Outlet } from "react-router";
import { useCompanyStore } from "../../stores";
import { Company } from "../../api/types/company.types";

interface ExtendedCompany extends Company {
  admin?: {
    name: string;
    email: string;
  };
  customers?: any[];
  drivers?: any[];
  staff?: any[];
}

const DashboardCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
    <h4 className="text-base font-semibold text-gray-700 dark:text-white">
      {title}
    </h4>
    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
      {value}
    </p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700">
    <span className="text-gray-600 dark:text-gray-400 font-medium">
      {label}
    </span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default function CompanyDashboard() {
  const currentCompany = useCompanyStore().currentCompany as ExtendedCompany;

  // Extract data from currentCompany
  const admin = {
    name: currentCompany?.admin?.name || "N/A",
    email: currentCompany?.admin?.email || "N/A",
    role: "Company Admin", // You might want to get this from staff[0].role if available
  };

  const company = {
    name: currentCompany?.name || "N/A",
    email: currentCompany?.email || "N/A",
    timezone: currentCompany?.timezone || "N/A",
    isApproved: currentCompany?.isApproved ? "Yes" : "No",
  };

  // Counts from arrays
  const totalCustomers = currentCompany?.customers?.length || 0;
  const totalDrivers = currentCompany?.drivers?.length || 0;
  const totalStaff = currentCompany?.staff?.length || 0;

  return (
    <>
      <PageMeta
        title="Company Dashboard | TailAdmin"
        description="Dashboard view showing company overview, drivers, cars and admin info"
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Email: {company.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Timezone: {company.timezone}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Approved: {company.isApproved}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <DashboardCard title="Total Customers" value={totalCustomers} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <DashboardCard title="Total Drivers" value={totalDrivers} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <DashboardCard title="Total Staff" value={totalStaff} />
        </div>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Details
        </h2>
        <DetailRow label="Name" value={admin.name} />
        <DetailRow label="Email" value={admin.email} />
        <DetailRow label="Role" value={admin.role} />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
          Company Details
        </h2>
        <DetailRow label="Company Name" value={company.name} />
        <DetailRow label="Email" value={company.email} />
        <DetailRow label="Timezone" value={company.timezone} />
        <DetailRow label="Approved" value={company.isApproved} />
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
