import {
  HiTag,
  HiBanknotes,
  HiCalendarDays,
  HiClock,
  HiSignal,
  HiChatBubbleLeftEllipsis,
} from "react-icons/hi2";

const JobSummary = ({ job }) => {
  if (!job) return null;

  const formatBudget = (budget) => {
    if (!budget?.min && !budget?.max) {
      return "Budget not specified";
    }

    if (budget.min && budget.max) {
      return `₹${Number(budget.min).toLocaleString("en-IN")} - ₹${Number(
        budget.max
      ).toLocaleString("en-IN")}`;
    }

    if (budget.min) {
      return `From ₹${Number(budget.min).toLocaleString("en-IN")}`;
    }

    return `Up to ₹${Number(budget.max).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Flexible";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const items = [
    {
      label: "Category",
      value: job.category?.name || job.customCategory || "General Service",
      icon: HiTag,
      accent: "text-teal-700 bg-teal-50",
    },
    {
      label: "Budget",
      value: formatBudget(job.budget),
      icon: HiBanknotes,
      accent: "text-emerald-700 bg-emerald-50 font-bold",
    },
    {
      label: "Preferred Date",
      value: formatDate(job.preferredDate),
      icon: HiCalendarDays,
      accent: "text-blue-700 bg-blue-50",
    },
    {
      label: "Preferred Time",
      value:
        job.preferredTimeSlot?.start && job.preferredTimeSlot?.end
          ? `${job.preferredTimeSlot.start} - ${job.preferredTimeSlot.end}`
          : "Flexible Window",
      icon: HiClock,
      accent: "text-amber-700 bg-amber-50",
    },
    {
      label: "Visibility Radius",
      value: `${job.visibilityRadius || 10} km`,
      icon: HiSignal,
      accent: "text-indigo-700 bg-indigo-50",
    },
    {
      label: "Quotes Received",
      value: `${job.quoteCount ?? job.quotes?.length ?? 0} submitted`,
      icon: HiChatBubbleLeftEllipsis,
      accent: "text-purple-700 bg-purple-50 font-semibold",
    },
  ];

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
        Job Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        {items.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
              <span>{label}</span>
            </div>

            <p className={`text-sm text-gray-900 mt-1 truncate ${accent}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSummary;
