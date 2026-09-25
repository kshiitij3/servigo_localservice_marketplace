import { useNavigate } from "react-router-dom";
import { HiBell, HiCheckCircle } from "react-icons/hi2";

import NotificationItem from "./NotificationItem";
import { useNotifications } from "../../context/NotificationContext";
import useAuth from "../../hooks/useAuth";

/*
 * Build a navigation path based on notification type + user role.
 *
 * Customer routes:  /customer/quotes/:id  |  /customer/bookings/:id
 * Professional:     /professional/quotes/:id  |  /professional/bookings/:id
 * Chat:             /chat/:id  (shared)
 * Work request:     /customer/work-requests/:id  (customer only)
 */
const buildPath = (notification, role) => {
  const id = notification.relatedId;
  if (!id) return null;

  switch (notification.type) {
    case "new_quote":
      /* Professional submitted → customer receives → go to customer quote detail */
      return role === "customer"
        ? `/customer/quotes/${id}`
        : `/professional/quotes/${id}`;

    case "quote_accepted":
      /* Customer accepted → professional receives → go to professional quote detail */
      return role === "professional"
        ? `/professional/quotes/${id}`
        : `/customer/quotes/${id}`;

    case "booking_confirmed":
    case "work_started":
    case "work_completed":
    case "payment_received":
    case "review":
      return role === "professional"
        ? `/professional/bookings/${id}`
        : `/customer/bookings/${id}`;

    case "chat":
      return `/chat/${id}`;

    case "new_work":
      return `/customer/work-requests/${id}`;

    default:
      return null;
  }
};

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const handleClick = async (notification) => {
    /* Mark as read first — non-blocking */
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch {
        /* non-fatal */
      }
    }

    onClose();

    const path = buildPath(notification, user?.role);
    if (path) navigate(path);
  };

  return (
    <div className="absolute right-0 top-12 w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200/80 rounded-2xl shadow-xl overflow-hidden z-50">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a6e] hover:text-[#155f55] transition"
          >
            <HiCheckCircle className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500">
            <span className="w-4 h-4 border-2 border-[#1a7a6e] border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
              <HiBell className="w-6 h-6 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onClick={() => handleClick(n)}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate("/notifications");
          }}
          className="w-full py-3 text-xs font-semibold text-[#1a7a6e] hover:bg-teal-50/50 transition"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
