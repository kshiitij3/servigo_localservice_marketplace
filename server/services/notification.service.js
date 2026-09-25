import mongoose from "mongoose";

import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import { getIO } from "../socket/io.js";

const getUserRoom = (userId) => `user:${userId}`;

const validateObjectId = (id, fieldName) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

/**
 * Create a notification and deliver it in real time
 * if the receiver is currently connected via Socket.IO.
 *
 * Saving to MongoDB always succeeds first —
 * Socket.IO failure is non-fatal.
 */
export const createNotification = async ({
  receiver,
  sender = null,
  title,
  message,
  type,
  relatedId = null,
  relatedModel = "",
}) => {
  validateObjectId(receiver, "receiver id");

  if (sender) validateObjectId(sender, "sender id");
  if (relatedId) validateObjectId(relatedId, "related id");

  const notification = await Notification.create({
    receiver,
    sender,
    title,
    message,
    type,
    relatedId,
    relatedModel,
  });

  const populated = await Notification.findById(notification._id)
    .populate("receiver", "name email role")
    .populate("sender", "name email role");

  /* Real-time delivery — non-fatal if socket is unavailable */
  try {
    const io = getIO();
    io.to(getUserRoom(receiver)).emit("notification:new", populated);
  } catch (err) {
    console.error("Notification socket delivery failed:", err.message);
  }

  return populated;
};

/**
 * Get paginated notifications for a user,
 * along with total unread count.
 */
export const getMyNotifications = async (userId, page = 1, limit = 20) => {
  validateObjectId(userId, "user id");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(50, Math.max(1, Number(limit) || 20));

  const skip = (page - 1) * limit;
  const filter = { receiver: userId };

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate("sender", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments(filter),

    Notification.countDocuments({ receiver: userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get only the unread notification count for a user.
 * Used to power the navbar badge without fetching all notifications.
 */
export const getUnreadCount = async (userId) => {
  validateObjectId(userId, "user id");

  return Notification.countDocuments({
    receiver: userId,
    isRead: false,
  });
};

/**
 * Mark a single notification as read.
 * Ownership check ensures User A cannot mark User B's notification.
 */
export const markNotificationAsRead = async (notificationId, userId) => {
  validateObjectId(notificationId, "notification id");

  const notification = await Notification.findOne({
    _id: notificationId,
    receiver: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

/**
 * Mark every unread notification for a user as read at once.
 */
export const markAllNotificationsAsRead = async (userId) => {
  validateObjectId(userId, "user id");

  const result = await Notification.updateMany(
    { receiver: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return { modifiedCount: result.modifiedCount };
};
