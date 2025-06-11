// stores/notificationStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  notificationApi,
  NotificationType,
  Notification,
} from "../api/endpoints/notification.api";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

interface NotificationActions {
  // State management
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
  removeNotification: (id: number) => void;

  // API operations
  fetchNotifications: (companyId?: number) => Promise<void>;
  fetchUnreadNotifications: (
    userId: number,
    userRole: string,
    companyId?: number
  ) => Promise<void>;
  createNotification: (data: {
    type: NotificationType;
    title: string;
    message: string;
    userId?: number;
    companyId?: number;
    bookingId?: number;
  }) => Promise<void>;
  markNotificationAsRead: (notificationId: number) => Promise<void>;
  markAllNotificationsAsRead: (
    userId: number,
    userRole: string,
    companyId?: number
  ) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  fetchRecentNotifications: (
    userId: number,
    userRole: string,
    companyId?: number,
    limit?: number
  ) => Promise<void>;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  immer((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    isConnected: false,

    // Socket management

    // Local state management
    addNotification: (notification) => {
      set((state) => {
        state.notifications.unshift(notification);
        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
      });
    },

    markAllAsRead: () => {
      set((state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
    },

    setNotifications: (notifications) => {
      set((state) => {
        state.notifications = notifications;
        state.unreadCount = notifications.filter((n) => !n.isRead).length;
      });
    },

    removeNotification: (id) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        state.notifications = state.notifications.filter((n) => n.id !== id);
        if (notification && !notification.isRead) {
          state.unreadCount -= 1;
        }
      });
    },

    // API operations
    fetchNotifications: async (companyId) => {
      set({ isLoading: true, error: null });
      try {
        const notifications =
          (await notificationApi.getAllNotifications()) as any;

        const allNotifications = notifications.data;
        console.log(allNotifications, "allNotifications");

        set({
          notifications: allNotifications,
          unreadCount: allNotifications.filter((n) => !n.isRead).length,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch notifications",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchUnreadNotifications: async (userId, userRole, companyId) => {
      set({ isLoading: true, error: null });
      try {
        const unreadNotifications =
          userRole === "super_admin"
            ? await notificationApi.getAllUnreadNotifications()
            : await notificationApi.getCompanyUnreadNotifications(companyId!);

        set((state) => {
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const newNotifications = [...state.notifications];

          unreadNotifications.forEach((notification) => {
            const index = newNotifications.findIndex(
              (n) => n.id === notification.id
            );
            if (index >= 0) {
              newNotifications[index] = notification;
            } else {
              newNotifications.push(notification);
            }
          });

          return {
            notifications: newNotifications,
            unreadCount: unreadNotifications.length,
          };
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch unread notifications",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    createNotification: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const newNotification = await notificationApi.createNotification(data);
        // Socket will handle adding the notification to local state
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create notification",
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    markNotificationAsRead: async (notificationId) => {
      set({ isLoading: true, error: null });
      try {
        await notificationApi.markNotificationAsRead(notificationId);
        // Socket will handle updating local state
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to mark notification as read",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    markAllNotificationsAsRead: async (userId, userRole, companyId) => {
      set({ isLoading: true, error: null });
      try {
        if (userRole === "super_admin") {
          await notificationApi.markAllNotificationsAsRead();
        } else {
          await notificationApi.markAllCompanyNotificationsAsRead(companyId!);
        }
        // Socket will handle updating local state
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to mark all notifications as read",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    deleteNotification: async (notificationId) => {
      set({ isLoading: true, error: null });
      try {
        await notificationApi.deleteNotification(notificationId);
        // Socket will handle removing from local state
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to delete notification",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchRecentNotifications: async (
      userId,
      userRole,
      companyId,
      limit = 10
    ) => {
      set({ isLoading: true, error: null });
      try {
        const recentNotifications =
          userRole === "super_admin"
            ? await notificationApi.getRecentNotifications(limit)
            : await notificationApi.getRecentCompanyNotifications(
                companyId!,
                limit
              );

        set((state) => {
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const newNotifications = [...state.notifications];

          recentNotifications.forEach((notification) => {
            if (!existingIds.has(notification.id)) {
              newNotifications.unshift(notification);
            }
          });

          return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter((n) => !n.isRead).length,
          };
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch recent notifications",
        });
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
