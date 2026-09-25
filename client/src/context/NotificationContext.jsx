/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification.service";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ── Load from REST ─────────────────────────────── */
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [notifRes, unreadRes] = await Promise.all([
        getNotifications({ page: 1, limit: 20 }),
        getUnreadNotificationCount(),
      ]);

      /*
       * ApiResponse shape: { success, statusCode, message, data }
       * data for getNotifications → { notifications, unreadCount, pagination }
       * data for getUnreadNotificationCount → { unreadCount }
       */
      const notifData = notifRes?.data?.data ?? notifRes?.data ?? {};
      const list = notifData?.notifications ?? [];

      const unreadData = unreadRes?.data?.data ?? unreadRes?.data ?? {};
      const count = unreadData?.unreadCount ?? 0;

      setNotifications(list);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* Load on login / user change */
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();
  }, [user, loadNotifications]);

  /* ── Real-time delivery ──────────────────────────── */
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification) => {
      console.log("🔔 New notification:", notification);

      /* Prepend, deduplicating by _id */
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        return exists ? prev : [notification, ...prev];
      });

      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }

      /* Brief toast — title only */
      toast(notification.title || "New notification", {
        icon: "🔔",
        duration: 4000,
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, isConnected]);

  /* ── Mark one as read ───────────────────────────── */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  }, []);

  /* ── Mark all as read ───────────────────────────── */
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
          readAt: n.readAt || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
};

export default NotificationContext;
