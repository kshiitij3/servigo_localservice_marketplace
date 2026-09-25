import api from "./api";

/**
 * GET /api/v1/notifications?page=&limit=
 * Returns { notifications, unreadCount, pagination }
 */
export const getNotifications = (params = {}) =>
  api.get("/notifications", { params });

/**
 * GET /api/v1/notifications/unread-count
 * Returns { unreadCount }  — used for the navbar badge.
 */
export const getUnreadNotificationCount = () =>
  api.get("/notifications/unread-count");

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read.
 */
export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark every notification for the current user as read.
 */
export const markAllNotificationsRead = () =>
  api.patch("/notifications/read-all");
