import { useNavigate } from "react-router-dom";
import {
  HiBell,
  HiCheckCircle,
  HiArrowLeft,
  HiChatBubbleLeftEllipsis,
  HiCalendarDays,
  HiCurrencyDollar,
  HiClipboardDocumentList,
  HiStar,
  HiCheckBadge,
  HiWrenchScrewdriver,
  HiSparkles,
  HiCreditCard,
} from "react-icons/hi2";
import { useNotifications } from "../../context/NotificationContext";
import useAuth from "../../hooks/useAuth";

/* ── Per-type icon + colour palette ── */
const TYPE_CONFIG = {
  new_quote:         { Icon: HiCurrencyDollar,         bg: "bg-amber-50",   ring: "ring-amber-200",   text: "text-amber-600"   },
  quote_accepted:    { Icon: HiCheckBadge,             bg: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-600" },
  booking_confirmed: { Icon: HiCalendarDays,           bg: "bg-blue-50",    ring: "ring-blue-200",    text: "text-blue-600"    },
  work_started:      { Icon: HiWrenchScrewdriver,      bg: "bg-orange-50",  ring: "ring-orange-200",  text: "text-orange-600"  },
  work_completed:    { Icon: HiSparkles,               bg: "bg-purple-50",  ring: "ring-purple-200",  text: "text-purple-600"  },
  payment_received:  { Icon: HiCreditCard,             bg: "bg-green-50",   ring: "ring-green-200",   text: "text-green-600"   },
  review:            { Icon: HiStar,                   bg: "bg-yellow-50",  ring: "ring-yellow-200",  text: "text-yellow-600"  },
  chat:              { Icon: HiChatBubbleLeftEllipsis, bg: "bg-teal-50",    ring: "ring-teal-200",    text: "text-[#1a7a6e]"   },
  new_work:          { Icon: HiClipboardDocumentList,  bg: "bg-indigo-50",  ring: "ring-indigo-200",  text: "text-indigo-600"  },
  system:            { Icon: HiBell,                   bg: "bg-gray-50",    ring: "ring-gray-200",    text: "text-gray-500"    },
};
const DEFAULT_CFG = { Icon: HiBell, bg: "bg-gray-50", ring: "ring-gray-200", text: "text-gray-500" };

/* ── Role-aware navigation (mirrors AppRoutes.jsx) ── */
const buildPath = (notification, role) => {
  const id = notification.relatedId;
  if (!id) return null;

  switch (notification.type) {
    case "chat":
      return `/chat/${id}`;

    case "new_quote":
      return role === "customer"
        ? `/customer/quotes/${id}`
        : `/professional/quotes/${id}`;

    case "quote_accepted":
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

    case "new_work":
      return `/customer/work-requests/${id}`;

    default:
      return null;
  }
};

/* ── Relative timestamp ── */
const timeAgo = (iso) => {
  const secs = (Date.now() - new Date(iso)) / 1000;
  if (secs < 60)     return "just now";
  if (secs < 3600)   return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)  return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

/* ─────────────────────────────────────────────── */

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const handleClick = async (n) => {
    if (!n.isRead) {
      try { await markAsRead(n._id); } catch { /* non-fatal */ }
    }
    const path = buildPath(n, user?.role);
    if (path) navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50/60">

      {/* ── Sticky top bar ── */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-[11px] text-gray-400 leading-none mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1a7a6e] bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition"
            >
              <HiCheckCircle className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-2.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse"
              >
                <div className="w-11 h-11 rounded-2xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3 bg-gray-100 rounded w-2/5" />
                  <div className="h-2.5 bg-gray-100 rounded w-3/5" />
                  <div className="h-2 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>

        /* Empty state */
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <HiBell className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-base font-bold text-gray-800">All caught up!</h2>
            <p className="text-sm text-gray-400 mt-1.5">
              No notifications yet. We&apos;ll alert you when something happens.
            </p>
          </div>

        /* Notification list */
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const cfg = TYPE_CONFIG[n.type] ?? DEFAULT_CFG;
              const { Icon } = cfg;

              return (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => handleClick(n)}
                  className={`w-full text-left rounded-2xl border transition-all group ${
                    !n.isRead
                      ? "bg-teal-50/50 border-teal-200/60 hover:bg-teal-50 shadow-sm"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/70"
                  }`}
                >
                  <div className="flex items-start gap-4 p-4">
                    {/* Coloured icon bubble */}
                    <div
                      className={`relative shrink-0 w-11 h-11 rounded-2xl ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      <Icon className={`w-5 h-5 ${cfg.text}`} />
                      {!n.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#1a7a6e] border-2 border-white" />
                      )}
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`text-sm leading-snug ${
                            !n.isRead
                              ? "font-bold text-gray-900"
                              : "font-semibold text-gray-800"
                          }`}
                        >
                          {n.title}
                        </h3>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>

                      {n.sender?.name && (
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                          <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase shrink-0">
                            {n.sender.name.charAt(0)}
                          </span>
                          {n.sender.name}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
