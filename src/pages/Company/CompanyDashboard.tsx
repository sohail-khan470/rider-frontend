import React, { useState, useEffect } from "react";
import {
  Edit,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Car,
  Calendar,
  FileText,
  Image,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCompanyStore } from "../../stores";

// Types matching your Prisma schema
interface CompanyAddress {
  id: number;
  companyId: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
}

interface CompanyContact {
  id: number;
  companyId: number;
  phone: string;
  email: string;
  website: string;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
}

interface CompanyProfile {
  id: number;
  companyId: number;
  description: string;
  mission: string | null;
  vision: string | null;
  values: string | null;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
}

interface CompanyMedia {
  id: number;
  companyId: number;
  type: MediaType;
  url: string;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
}

type MediaType = "LOGO" | "BANNER" | "DOCUMENT" | "OTHER";

// Fixed Company interface to match Prisma schema
interface Company {
  id: number;
  name: string;
  isApproved: boolean;
  timezone: string;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
  // Relations (all optional since they might not be included in queries)
  contact?: CompanyContact | null;
  addresses?: CompanyAddress[];
  media?: CompanyMedia[];
  profile?: CompanyProfile | null;
  // Count aggregations
  _count?: {
    drivers: number;
    customers: number;
    users: number;
    bookings: number;
  };
}

const CompanyDashboard: React.FC = () => {
  const {
    currentCompany,
    loading: storeLoading,
    error: storeError,
    getCompanyProfile,
    updateCompanyProfile,
    editCompany,
  } = useCompanyStore();

  const [currentView, setCurrentView] = useState<"view" | "edit">("view");
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);

  console.log(editData);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        await getCompanyProfile();
      } catch (error) {
        toast.error("Failed to load company data");
      }
    };

    loadCompanyData();
  }, [getCompanyProfile]);

  useEffect(() => {
    if (currentCompany) {
      setEditData(currentCompany);
    }
  }, [currentCompany]);

  const formatDate = (dateString: Date | string) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async () => {
    if (!editData) return;

    setIsLoading(true);
    try {
      await editCompany(currentCompany?.id, editData);
      setCurrentView("view");
      toast.success("Company information updated successfully");
    } catch (error) {
      toast.error("Failed to update company information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentCompany) {
      setEditData(currentCompany);
    }
    setCurrentView("view");
  };

  const updateEditData = (path: string, value: any) => {
    setEditData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Show loading state
  if (storeLoading || !currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Loading company information...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (storeError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{storeError}</p>
          <button
            onClick={() => getCompanyProfile()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const company = currentCompany;

  if (currentView === "view") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                {company.media?.find((m) => m.type === "LOGO") && (
                  <img
                    src={company.media.find((m) => m.type === "LOGO")?.url}
                    alt="Company Logo"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {company.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        company.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {company.isApproved ? "Approved" : "Pending Approval"}
                    </span>
                    <span className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Created {formatDate(company.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView("edit")}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Company</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drivers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {company._count?.drivers || 0}
                  </p>
                </div>
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {company._count?.customers || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {company._count?.users || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {company._count?.bookings || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Profile */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Company Profile
              </h2>
              {company.profile ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Description
                    </h3>
                    <p className="text-gray-900 mt-1">
                      {company.profile.description}
                    </p>
                  </div>
                  {company.profile.mission && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Mission
                      </h3>
                      <p className="text-gray-900 mt-1">
                        {company.profile.mission}
                      </p>
                    </div>
                  )}
                  {company.profile.vision && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Vision
                      </h3>
                      <p className="text-gray-900 mt-1">
                        {company.profile.vision}
                      </p>
                    </div>
                  )}
                  {company.profile.values && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Values
                      </h3>
                      <p className="text-gray-900 mt-1">
                        {company.profile.values}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No profile information available
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              {company.contact ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">
                      {company.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">
                      {company.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={company.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {company.contact.website}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No contact information available
                </p>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Addresses
              </h2>
              {company.addresses && company.addresses.length > 0 ? (
                <div className="space-y-4">
                  {company.addresses?.map((address: CompanyAddress) => (
                    <div
                      key={address.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {address.isPrimary && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.postalCode}
                        <br />
                        {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No addresses available</p>
              )}
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Media
              </h2>
              {company.media && company.media.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {company.media.map((media) => (
                    <div key={media.id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {media.type}
                        </span>
                      </div>
                      {media.type === "LOGO" || media.type === "BANNER" ? (
                        <img
                          src={media.url}
                          alt={media.type}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-6 h-6 text-gray-400" />
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm truncate"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No media files available</p>
              )}
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Timezone</h3>
                <p className="text-gray-900 mt-1">{company.timezone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Created</h3>
                <p className="text-gray-900 mt-1">
                  {formatDate(company.createdAt)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Last Updated
                </h3>
                <p className="text-gray-900 mt-1">
                  {formatDate(company.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit View
  if (!editData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Company Details
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => updateEditData("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={editData.timezone}
                onChange={(e) => updateEditData("timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="Europe/Rome">Europe/Rome</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                value={editData.contact?.phone || ""}
                onChange={(e) =>
                  updateEditData("contact.phone", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editData.contact?.email || ""}
                onChange={(e) =>
                  updateEditData("contact.email", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={editData.contact?.website || ""}
                onChange={(e) =>
                  updateEditData("contact.website", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Company Profile */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Company Profile
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={editData.profile?.description || ""}
                onChange={(e) =>
                  updateEditData("profile.description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your company..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission
              </label>
              <textarea
                rows={2}
                value={editData.profile?.mission || ""}
                onChange={(e) =>
                  updateEditData("profile.mission", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your company's mission..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision
              </label>
              <textarea
                rows={2}
                value={editData.profile?.vision || ""}
                onChange={(e) =>
                  updateEditData("profile.vision", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your company's vision..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Values
              </label>
              <textarea
                rows={2}
                value={editData.profile?.values || ""}
                onChange={(e) =>
                  updateEditData("profile.values", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your company's core values..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
