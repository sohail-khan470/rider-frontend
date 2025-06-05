import { useState, useEffect } from "react";
import EditScheduleModal from "./EditScheduleModal";
import { ScheduleStatus, Schedule } from "../../stores/schedule.store";
import CreateScheduleModal from "./CreateScheduleModal";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Edit,
  X,
  Play,
  CheckCircle,
  RotateCcw,
  Flag,
} from "lucide-react";
import { useScheduleStore } from "../../stores/schedule.store";

const SchedulePage = () => {
  const {
    schedules,
    loading,
    error,
    fetchCompanySchedules,
    createSchedule,
    updateSchedule,
    cancelSchedule,
    startTrip,
    markArrived,
    startReturn,
    completeSchedule,
    clearError,
  } = useScheduleStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchCompanySchedules();
  }, [fetchCompanySchedules]);

  const getStatusColor = (status: ScheduleStatus) => {
    const colors = {
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      in_progress:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      arrived:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      returning:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      completed:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    const icons = {
      scheduled: <Calendar className="w-4 h-4" />,
      in_progress: <Play className="w-4 h-4" />,
      arrived: <CheckCircle className="w-4 h-4" />,
      returning: <RotateCcw className="w-4 h-4" />,
      completed: <Flag className="w-4 h-4" />,
      cancelled: <X className="w-4 h-4" />,
    };
    return icons[status] || <Calendar className="w-4 h-4" />;
  };

  const filteredSchedules = schedules.filter(
    (schedule) => statusFilter === "all" || schedule.status === statusFilter
  );

  const handleStatusAction = async (schedule: Schedule, action: string) => {
    try {
      switch (action) {
        case "start":
          await startTrip(schedule.id);
          break;
        case "arrive":
          await markArrived(schedule.id);
          break;
        case "return":
          await startReturn(schedule.id);
          break;
        case "complete":
          await completeSchedule(schedule.id);
          break;
        case "cancel":
          await cancelSchedule(schedule.id);
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const canPerformAction = (schedule: Schedule, action: string) => {
    const { status } = schedule;
    switch (action) {
      case "start":
        return status === "scheduled";
      case "arrive":
        return status === "in_progress";
      case "return":
        return status === "arrived";
      case "complete":
        return status === "returning";
      case "cancel":
        return ["scheduled", "in_progress"].includes(status);
      default:
        return false;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Schedule Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your driver schedules and trips
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Schedule</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Schedules
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {schedules.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Play className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  In Progress
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {schedules.filter((s) => s.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Completed
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {schedules.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Scheduled
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {schedules.filter((s) => s.status === "scheduled").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {[
              "scheduled",
              "in_progress",
              "arrived",
              "returning",
              "completed",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))
          ) : filteredSchedules.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No schedules found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statusFilter === "all"
                  ? "Create your first schedule to get started"
                  : `No schedules with status "${statusFilter.replace(
                      "_",
                      " "
                    )}"`}
              </p>
            </div>
          ) : (
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        schedule.status
                      )}`}
                    >
                      {getStatusIcon(schedule.status)}
                      <span className="ml-1 capitalize">
                        {schedule.status.replace("_", " ")}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      #{schedule.id}
                    </span>
                  </div>

                  {/* Route Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {schedule.fromCity.name}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">
                        {schedule.toCity.name}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      <span>{schedule.driver.name}</span>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Departure: {formatDateTime(schedule.departure)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Arrival: {formatDateTime(schedule.estimatedArrival)}
                      </span>
                    </div>
                    {schedule.returnTime && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          Return: {formatDateTime(schedule.returnTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {canPerformAction(schedule, "start") && (
                      <button
                        onClick={() => handleStatusAction(schedule, "start")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    )}
                    {canPerformAction(schedule, "arrive") && (
                      <button
                        onClick={() => handleStatusAction(schedule, "arrive")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Arrived</span>
                      </button>
                    )}
                    {canPerformAction(schedule, "return") && (
                      <button
                        onClick={() => handleStatusAction(schedule, "return")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Return</span>
                      </button>
                    )}
                    {canPerformAction(schedule, "complete") && (
                      <button
                        onClick={() => handleStatusAction(schedule, "complete")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Complete</span>
                      </button>
                    )}
                    {canPerformAction(schedule, "cancel") && (
                      <button
                        onClick={() => handleStatusAction(schedule, "cancel")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Edit button for scheduled items */}
                    {schedule.status === "scheduled" && (
                      <button
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowEditModal(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Schedule Modal */}
        {showCreateModal && (
          <CreateScheduleModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createSchedule}
            loading={loading}
          />
        )}

        {/* Edit Schedule Modal */}
        {showEditModal && selectedSchedule && (
          <EditScheduleModal
            schedule={selectedSchedule}
            onClose={() => {
              setShowEditModal(false);
              setSelectedSchedule(null);
            }}
            onSubmit={(data: any) => updateSchedule(selectedSchedule.id, data)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
