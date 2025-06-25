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
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="w-full">
              <CompanyMetrics />
            </div>

            <div className="w-full">
              <RecentOrders />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
