import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

/**
 * GET /api/v1/notifications
 * Returns paginated notifications + unread count for the logged-in user.
 */
export const getMine = asyncHandler(async (req, res) => {
  const result = await getMyNotifications(
    req.user._id,
    req.query.page,
    req.query.limit
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Notifications fetched successfully", result));
});

/**
 * GET /api/v1/notifications/unread-count
 * Lightweight endpoint to poll or check the badge count.
 */
export const getUnread = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadCount(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Unread notification count fetched successfully",
        { unreadCount }
      )
    );
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read (ownership enforced in service).
 */
export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(
    req.params.id,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

/**
 * PATCH /api/v1/notifications/read-all
 * Mark every unread notification for the user as read.
 */
export const markAllRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsAsRead(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read", result));
});
