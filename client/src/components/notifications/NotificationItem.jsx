import { HiBell } from "react-icons/hi2";

/* Notification type → icon label */
const TYPE_ICONS = {
  new_quote: "💬",
  quote_accepted: "✅",
  booking_confirmed: "📅",
  work_started: "🔧",
  work_completed: "🎉",
  payment_received: "💰",
  review: "⭐",
  chat: "💬",
  new_work: "📋",
  system: "ℹ️",
};

const NotificationItem = ({ notification, onClick }) => {
  const icon = TYPE_ICONS[notification.type] || "🔔";

  const timeLabel = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${
        !notification.isRead ? "bg-teal-50/40" : "bg-white"
      }`}
    >
      <div className="flex gap-3">
        {/* Type icon + unread dot */}
        <div className="relative mt-0.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base">
            {icon}
          </div>
          {!notification.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#1a7a6e] border-2 border-white" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm leading-snug ${
              notification.isRead
                ? "font-medium text-gray-800"
                : "font-bold text-gray-900"
            }`}
          >
            {notification.title}
          </h4>

          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <p className="text-[11px] text-gray-400 mt-1.5">{timeLabel}</p>
        </div>
      </div>
    </button>
  );
};

export default NotificationItem;
