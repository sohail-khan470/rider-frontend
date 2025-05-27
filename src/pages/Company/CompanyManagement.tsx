import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Car,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import { useCompanyStore } from "../../stores";
import { Company } from "../../stores/types/company.types";
export default function CompanyManagementDashboard() {
  // Use company store

  const {
    companies,
    loading,
    error,
    fetchAllCompanies,
    approveCompany: approveCompanyAction,
    registerCompany,
    editCompany,
    getCompanyByAdminId,
    deleteCompany,
    currentCompany,
  } = useCompanyStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRegistering, setIsRegistering] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    timezone: "UTC", // default timezone
    isApproved: false,
  });

  console.log(selectedCompany);

  // Fetch companies on component mount
  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  // Functions for company management
  const handleApproveCompany = async (id: number) => {
    try {
      await approveCompanyAction(id);
      toast.success("Company approved successfully!");
      fetchAllCompanies(); // Refresh the list
    } catch (error) {
      console.error("Error approving company:", error);
      toast.error(`Failed to approve company: ${error.message}`);
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete);
      toast.success("Company deleted successfully!");
      setShowDeleteConfirmation(false);
      setCompanyToDelete(null);
      fetchAllCompanies(); // Refresh the list
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(`Failed to delete company: ${error.message}`);
    }
  };

  const handleRegisterCompany = async () => {
    setIsRegistering(true);
    try {
      await registerCompany({
        name: newCompany.name,
        email: newCompany.email,
        timezone: newCompany.timezone,
        isApproved: newCompany.isApproved,
      });

      // Show success toast
      toast.success("Company registered successfully!");

      // Reset form and close modal
      setNewCompany({
        name: "",
        email: "",
        timezone: "UTC",
        isApproved: false,
      });
      setShowAddCompanyModal(false);

      // Refresh the companies list
      await fetchAllCompanies();
    } catch (error) {
      console.error("Error registering company:", error);
      // Show error toast
      toast.error(`Failed to register company: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setShowEditCompanyModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const handleViewCompanyDetails = (id: number) => {
    // Navigate to company details page
    // In a real app with router: navigate(`/companies/${id}`);
    console.log("View company details:", id);
  };

  // You'll need to implement the actual submit handler for the edit form
  const handleEditCompany = async (e: React.FormEvent) => {
    console.log(selectedCompany);
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      await editCompany(selectedCompany.id, {
        name: selectedCompany.name,
        email: selectedCompany.email,
        timezone: selectedCompany.timezone,
        isApproved: selectedCompany.isApproved,
      });

      toast.success("Company updated successfully!");
      setShowEditCompanyModal(false);
      setSelectedCompany(null);
      await fetchAllCompanies(); // Refresh the list
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(`Failed to update company: ${error.message}`);
    }
  };

  // Filtering and sorting
  const statusFilteredCompanies =
    statusFilter === "all"
      ? companies
      : companies.filter((company) =>
          statusFilter === "approved" ? company.isApproved : !company.isApproved
        );

  const filteredCompanies = statusFilteredCompanies.filter(
    (company) =>
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let compareA: any = a[sortField as keyof Company];
    let compareB: any = b[sortField as keyof Company];

    if (sortField === "createdAt") {
      compareA = new Date(compareA || "").getTime();
      compareB = new Date(compareB || "").getTime();
    }

    if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
    if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString, timezone = "UTC") => {
    return moment(dateString).tz(timezone).format("MMM D, YYYY h:mm A z");
  };

  // For displaying the sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Get counts for stats section
  const approvedCompaniesCount = companies.filter((c) => c.isApproved).length;
  const pendingCompaniesCount = companies.filter((c) => !c.isApproved).length;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Company Management
          </h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
            onClick={() => setShowAddCompanyModal(true)}
          >
            <PlusCircle size={18} />
            Add Company
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">
              Total Companies
            </h3>
            <p className="text-3xl font-bold mt-2">{companies.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">
              Approved Companies
            </h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {approvedCompaniesCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">
              Pending Approval
            </h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">
              {pendingCompaniesCount}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search companies by name or email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Company Name</span>
                        {getSortIndicator("name")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("email")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        {getSortIndicator("email")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("isApproved")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {getSortIndicator("isApproved")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("createdAt")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date Created</span>
                        {getSortIndicator("createdAt")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stats
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCompanies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "No companies matching your search criteria"
                          : "No companies found"}
                      </td>
                    </tr>
                  ) : (
                    sortedCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {company.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {company.isApproved ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(company.createdAt)}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(company.createdAt, company.timezone)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Users size={14} className="mr-1" />
                              <span>{company._count?.customers || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Car size={14} className="mr-1" />
                              <span>{company._count?.drivers || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{company._count?.bookings || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {!company.isApproved && (
                              <button
                                onClick={() => handleApproveCompany(company.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve Company"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditClick(company)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Company"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(company.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Company"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleViewCompanyDetails(company.id)
                              }
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <MoreHorizontal size={18} />
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
        {/* Add Company Modal */}
        {showAddCompanyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Company
                </h3>
                <button
                  onClick={() => setShowAddCompanyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterCompany();
                }}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCompany.email}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCompany.timezone}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, timezone: e.target.value })
                    }
                  >
                    {moment.tz.names().map((tz) => (
                      <option key={tz} value={tz}>
                        {tz} (UTC{moment.tz(tz).format("Z")})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approved"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={newCompany.isApproved}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        isApproved: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="approved"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Approve Immediately
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddCompanyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      isRegistering || !newCompany.name || !newCompany.email
                    }
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Adding...
                      </span>
                    ) : (
                      "Add Company"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Company Modal */}
        {showEditCompanyModal && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Company
                </h3>
                <button
                  onClick={() => setShowEditCompanyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleEditCompany}>
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCompany.name || ""}
                    onChange={(e) =>
                      setSelectedCompany({
                        ...selectedCompany,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCompany.email || ""}
                    onChange={(e) =>
                      setSelectedCompany({
                        ...selectedCompany,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-timezone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Timezone
                  </label>
                  <select
                    id="edit-timezone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCompany.timezone || "UTC"}
                    onChange={(e) =>
                      setSelectedCompany({
                        ...selectedCompany,
                        timezone: e.target.value,
                      })
                    }
                  >
                    {moment.tz.names().map((tz) => (
                      <option key={tz} value={tz}>
                        {tz} (UTC{moment.tz(tz).format("Z")})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-approved"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedCompany.isApproved || false}
                    onChange={(e) =>
                      setSelectedCompany({
                        ...selectedCompany,
                        isApproved: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="edit-approved"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Approved
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowEditCompanyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this company? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteCompany}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
