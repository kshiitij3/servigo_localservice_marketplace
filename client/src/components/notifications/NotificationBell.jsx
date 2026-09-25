import { useEffect, useRef, useState } from "react";
import { HiBell } from "react-icons/hi2";

import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../../context/NotificationContext";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { unreadCount } = useNotifications();

  /* Close on outside click */
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        id="btn-notification-bell"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
          open
            ? "bg-teal-50 border-teal-200 text-[#1a7a6e]"
            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <HiBell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
