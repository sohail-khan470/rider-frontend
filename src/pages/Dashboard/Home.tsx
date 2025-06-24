import CompanyMetrics from "../../components/ecommerce/CompanyMetrics";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="flex justify-center w-full px-4">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-8">
              <CompanyMetrics />
            </div>

            <div className="col-span-12 xl:col-span-4">
              <RecentOrders />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
