const AvailabilityCard = ({
  status = "available",
  onChange,
}) => {
  const statusData = {
    available: {
      label: "Available",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      description: "You are currently accepting new jobs.",
      icon: "🟢",
    },
    busy: {
      label: "Busy",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      description: "You are currently busy.",
      icon: "🟡",
    },
    unavailable: {
      label: "Unavailable",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      description: "You are not accepting new jobs.",
      icon: "🔴",
    },
  };

  const current = statusData[status] || statusData.available;

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Your Availability
          </p>

          <div className="flex items-center gap-2.5 mt-2">
            <span>{current.icon}</span>

            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold border ${current.bg} ${current.color} ${current.border}`}
            >
              {current.label}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-2.5">
            {current.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="self-start sm:self-center px-4 py-2 rounded-xl border border-gray-300 bg-white font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition cursor-pointer shadow-xs"
        >
          Change Status
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCard;
