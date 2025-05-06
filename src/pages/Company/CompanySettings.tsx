import PageMeta from "../../components/common/PageMeta";
import CompanyProfileForm from "../../components/company/CompanyProfileForm";

export default function CompanySettings() {
  return (
    <>
      <PageMeta
        title="Company Settings | Dashboard"
        description="Update your company profile and contact details."
      />

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          ⚙️ Company Settings
        </h1>
        <CompanyProfileForm />
      </div>
    </>
  );
}
