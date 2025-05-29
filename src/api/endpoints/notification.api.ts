// src/api/endpoints/notification.api.ts
import apiClient from "../client";

export enum NotificationType {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_ASSIGNED = "BOOKING_ASSIGNED",
  BOOKING_COMPLETED = "BOOKING_COMPLETED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  DRIVER_STATUS_CHANGED = "DRIVER_STATUS_CHANGED",
  NEW_USER_REGISTERED = "NEW_USER_REGISTERED",
  COMPANY_APPROVED = "COMPANY_APPROVED",
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  userId?: number;
  companyId?: number;
  bookingId?: number;
  createdAt: Date;
}

export const notificationApi = {
  // Get all notifications (super admin only)
  getAllNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications`);
    return response.data;
  },

  // Get all unread notifications (super admin only)
  getAllUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications/unread`);
    return response.data;
  },

  // Get all notifications for a company
  getCompanyNotifications: async (
    companyId: number
  ): Promise<Notification[]> => {
    const response = await apiClient.get(
      `/api/notifications/${companyId}/getAll`
    );
    return response.data;
  },

  // Get unread notifications for a company
  getCompanyUnreadNotifications: async (
    companyId: number
  ): Promise<Notification[]> => {
    const response = await apiClient.get(
      `/api/company/${companyId}/notifications/unread`
    );
    return response.data;
  },

  // Create a notification (general)
  createNotification: async (data: {
    type: NotificationType;
    title: string;
    message: string;
    userId?: number;
    companyId?: number;
    bookingId?: number;
  }): Promise<Notification> => {
    const response = await apiClient.post(`/api/notifications`, data);
    return response.data;
  },

  // Create a company notification
  createCompanyNotification: async (
    companyId: number,
    data: {
      type: NotificationType;
      title: string;
      message: string;
      userId?: number;
      bookingId?: number;
    }
  ): Promise<Notification> => {
    const response = await apiClient.post(
      `/api/company/${companyId}/notifications`,
      {
        ...data,
        companyId,
      }
    );
    return response.data;
  },

  // Mark notification as read (general)
  markNotificationAsRead: async (
    notificationId: number
  ): Promise<Notification> => {
    const response = await apiClient.patch(
      `/api/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark company notification as read
  markCompanyNotificationAsRead: async (
    notificationId: number
  ): Promise<Notification> => {
    const response = await apiClient.patch(
      `/api/company/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read (super admin only)
  markAllNotificationsAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.patch(`/api/notifications/read-all`);
    return response.data;
  },

  // Mark all company notifications as read
  markAllCompanyNotificationsAsRead: async (
    companyId: number
  ): Promise<{ count: number }> => {
    const response = await apiClient.patch(
      `/api/company/${companyId}/notifications/read-all`
    );
    return response.data;
  },

  // Delete notification (general)
  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/api/notifications/${notificationId}`);
  },

  // Delete company notification (admin only)
  deleteCompanyNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/api/company/notifications/${notificationId}`);
  },

  // Get recent notifications (super admin only)
  getRecentNotifications: async (
    limit: number = 10
  ): Promise<Notification[]> => {
    const response = await apiClient.get(
      `/api/notifications/recent?limit=${limit}`
    );
    return response.data;
  },

  // Get recent company notifications
  getRecentCompanyNotifications: async (
    companyId: number,
    limit: number = 10
  ): Promise<Notification[]> => {
    const response = await apiClient.get(
      `/api/notifications/${companyId}/recent?limit=${limit}`
    );
    return response.data;
  },
};
