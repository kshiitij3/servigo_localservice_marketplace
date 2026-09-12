import { useState } from "react";
import {
  HiBriefcase,
  HiChatBubbleLeftEllipsis,
  HiCalendarDays,
  HiChatBubbleBottomCenterText,
  HiClock,
} from "react-icons/hi2";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    newJobs: true,
    quoteUpdates: true,
    bookingUpdates: true,
    messages: true,
    reminders: true,
  });

  const handleChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const options = [
    {
      key: "newJobs",
      title: "New nearby jobs",
      description: "Get notified when relevant customer service requests appear in your area.",
      icon: <HiBriefcase className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
    },
    {
      key: "quoteUpdates",
      title: "Quote updates",
      description: "Receive immediate updates when customers accept or respond to your quotes.",
      icon: <HiChatBubbleLeftEllipsis className="w-5 h-5 text-teal-600" />,
      iconBg: "bg-teal-50",
    },
    {
      key: "bookingUpdates",
      title: "Booking updates",
      description: "Stay updated on scheduled appointments, reschedules, and cancellations.",
      icon: <HiCalendarDays className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
    },
    {
      key: "messages",
      title: "Direct messages",
      description: "Get notified when you receive a new chat message from customers.",
      icon: <HiChatBubbleBottomCenterText className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50",
    },
    {
      key: "reminders",
      title: "Service reminders",
      description: "Receive timely reminders about upcoming jobs and start times.",
      icon: <HiClock className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50",
    },
  ];

  return (
    <div className="divide-y divide-gray-100">
      {options.map((option, idx) => {
        const isEnabled = settings[option.key];

        return (
          <div
            key={option.key}
            className={`flex items-center justify-between gap-4 py-4 ${
              idx === 0 ? "pt-0" : ""
            } ${idx === options.length - 1 ? "pb-0" : ""}`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${option.iconBg}`}
              >
                {option.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {option.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              onClick={() => handleChange(option.key)}
              className={`relative inline-flex w-12 h-6.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 ${
                isEnabled ? "bg-[#1a7a6e]" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSettings;
