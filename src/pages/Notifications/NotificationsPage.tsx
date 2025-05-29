import { useState, useEffect } from "react";
// import { useNotificationStore } from "../../stores/notificationStore";
// import { useAuthStore } from "../../stores/authStore";

import { formatDistanceToNow, format } from "date-fns";
import { useNotificationStore } from "../../stores/types/notification.store";
import { useAuthStore } from "../../stores";

type FilterType = "all" | "unread" | "read";
type NotificationTypeFilter =
  | "all"
  | "BOOKING_CREATED"
  | "BOOKING_ASSIGNED"
  | "BOOKING_COMPLETED"
  | "BOOKING_CANCELLED"
  | "DRIVER_ASSIGNED"
  | "DRIVER_STATUS_CHANGED"
  | "NEW_USER_REGISTERED"
  | "COMPANY_APPROVED";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [filter, setFilter] = useState<FilterType>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id, user.role, user.companyId);
    }
  }, [user, fetchNotifications]);

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.isRead) return false;
    if (filter === "read" && !notification.isRead) return false;

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    // Filter by search term
    if (
      searchTerm &&
      !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      try {
        await markAllNotificationsAsRead(
          user.id,
          user.role.name,
          user.companyId
        );
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedNotifications) {
      try {
        await deleteNotification(id);
      } catch (error) {
        console.error(`Failed to delete notification ${id}:`, error);
      }
    }
    setSelectedNotifications([]);
  };

  const handleBulkMarkAsRead = async () => {
    for (const id of selectedNotifications) {
      const notification = notifications.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        try {
          await markNotificationAsRead(id);
        } catch (error) {
          console.error(`Failed to mark notification ${id} as read:`, error);
        }
      }
    }
    setSelectedNotifications([]);
  };

  const toggleSelection = (notificationId: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CREATED":
      case "BOOKING_ASSIGNED":
      case "BOOKING_COMPLETED":
      case "BOOKING_CANCELLED":
        return "🚗";
      case "DRIVER_ASSIGNED":
      case "DRIVER_STATUS_CHANGED":
        return "👨‍✈️";
      case "NEW_USER_REGISTERED":
        return "👤";
      case "COMPANY_APPROVED":
        return "🏢";
      default:
        return "📢";
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "BOOKING_CREATED":
        return "Booking Created";
      case "BOOKING_ASSIGNED":
        return "Booking Assigned";
      case "BOOKING_COMPLETED":
        return "Booking Completed";
      case "BOOKING_CANCELLED":
        return "Booking Cancelled";
      case "DRIVER_ASSIGNED":
        return "Driver Assigned";
      case "DRIVER_STATUS_CHANGED":
        return "Driver Status Changed";
      case "NEW_USER_REGISTERED":
        return "New User Registered";
      case "COMPANY_APPROVED":
        return "Company Approved";
      default:
        return "Notification";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading notifications
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${
                unreadCount > 1 ? "s" : ""
              }`
            : "All caught up!"}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as NotificationTypeFilter)
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="BOOKING_CREATED">Booking Created</option>
              <option value="BOOKING_ASSIGNED">Booking Assigned</option>
              <option value="BOOKING_COMPLETED">Booking Completed</option>
              <option value="BOOKING_CANCELLED">Booking Cancelled</option>
              <option value="DRIVER_ASSIGNED">Driver Assigned</option>
              <option value="DRIVER_STATUS_CHANGED">
                Driver Status Changed
              </option>
              <option value="NEW_USER_REGISTERED">New User Registered</option>
              <option value="COMPANY_APPROVED">Company Approved</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={handleBulkMarkAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Mark Selected as Read
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {notifications.length === 0
                ? "You don't have any notifications yet."
                : "No notifications match your current filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            {filteredNotifications.length > 0 && (
              <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedNotifications.length ===
                      filteredNotifications.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Select all ({filteredNotifications.length})
                  </span>
                </label>
              </div>
            )}

            {/* Notification Items */}
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                            <span>
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </span>
                            <span>
                              {format(
                                new Date(notification.createdAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              title="Mark as read"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            title="Delete notification"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
