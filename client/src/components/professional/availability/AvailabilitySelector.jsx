import { useState, useEffect } from "react";
import { HiCheckCircle } from "react-icons/hi2";

const availabilityOptions = [
  {
    value: "available",
    label: "Available",
    icon: "🟢",
    description: "You are available to accept new service requests and leads.",
    activeClass: "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconBg: "bg-emerald-100/80",
  },
  {
    value: "busy",
    label: "Busy",
    icon: "🟡",
    description: "You are currently occupied with jobs but may become available soon.",
    activeClass: "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100/80",
  },
  {
    value: "unavailable",
    label: "Unavailable",
    icon: "🔴",
    description: "You are off-duty and not accepting new service requests.",
    activeClass: "border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    iconBg: "bg-rose-100/80",
  },
];

const AvailabilitySelector = ({
  currentStatus = "available",
  onChange,
  loading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleSelect = async (status) => {
    if (status === selectedStatus || loading) {
      return;
    }

    const previousStatus = selectedStatus;
    setSelectedStatus(status);

    try {
      await onChange(status);
    } catch (error) {
      setSelectedStatus(previousStatus);
    }
  };

  return (
    <div className="space-y-4">
      {availabilityOptions.map((option) => {
        const selected = selectedStatus === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            disabled={loading}
            className={`w-full text-left border-2 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-xs ${
              selected
                ? option.activeClass
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
            } ${loading ? "opacity-60 cursor-not-allowed" : "active:scale-[0.99]"}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${
                  selected ? option.iconBg : "bg-gray-100"
                }`}
              >
                {option.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-gray-900 text-base">
                      {option.label}
                    </h3>
                    {selected && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${option.badgeClass}`}
                      >
                        Active
                      </span>
                    )}
                  </div>

                  {selected && (
                    <HiCheckCircle className="w-5 h-5 text-[#1a7a6e] shrink-0" />
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AvailabilitySelector;
