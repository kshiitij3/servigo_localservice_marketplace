import {
  HiTag,
  HiCurrencyRupee,
  HiCalendar,
  HiClock,
  HiChatBubbleLeftEllipsis,
  HiUser,
  HiArrowRight,
} from "react-icons/hi2";

const RequestSidebar = ({
  request,
  quoteCount,
  categoryName,
  onViewQuotes,
  onViewBooking,
}) => {
  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatBudget = (budget) => {
    if (!budget?.min && !budget?.max) {
      return "Budget not specified";
    }
    if (budget.min && budget.max) {
      return `₹${budget.min.toLocaleString("en-IN")} - ₹${budget.max.toLocaleString("en-IN")}`;
    }
    if (budget.min) {
      return `From ₹${budget.min.toLocaleString("en-IN")}`;
    }
    return `Up to ₹${budget.max.toLocaleString("en-IN")}`;
  };

  return (
    <aside className="space-y-6">
      {/* Request Summary Card */}
      <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Request Summary
        </h2>

        <div className="space-y-4 mt-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiTag className="w-3.5 h-3.5 text-[#1a7a6e]" /> Category
            </p>
            <p className="font-semibold text-gray-800 mt-1">{categoryName}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiCurrencyRupee className="w-3.5 h-3.5 text-[#1a7a6e]" /> Budget
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {formatBudget(request.budget)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiCalendar className="w-3.5 h-3.5 text-[#1a7a6e]" /> Preferred Date
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {formatDate(request.preferredDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5 text-[#1a7a6e]" /> Preferred Time
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {request.preferredTimeSlot?.start && request.preferredTimeSlot?.end
                ? `${request.preferredTimeSlot.start} - ${request.preferredTimeSlot.end}`
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiChatBubbleLeftEllipsis className="w-3.5 h-3.5 text-[#1a7a6e]" />{" "}
              Quotes Received
            </p>
            <p className="font-semibold text-gray-800 mt-1 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-[#1a7a6e] font-bold text-xs">
                {quoteCount}
              </span>
              <span>{quoteCount === 1 ? "Quote" : "Quotes"}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HiCalendar className="w-3.5 h-3.5 text-[#1a7a6e]" /> Created Date
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {formatDate(request.createdAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Selected Professional Card */}
      {request.selectedProfessional && (
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <HiUser className="w-5 h-5 text-[#1a7a6e]" />
            <span>Selected Professional</span>
          </h2>

          <div className="mt-4">
            <p className="font-semibold text-gray-900 text-base">
              {request.selectedProfessional.name || "Professional"}
            </p>

            {request.status === "BOOKED" && (
              <button
                type="button"
                onClick={onViewBooking}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a7a6e] hover:underline cursor-pointer"
              >
                <span>View Booking Details</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Quotes CTA Card */}
      {(request.status === "OPEN" || request.status === "QUOTED") && (
        <section className="bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-100 rounded-2xl p-6 shadow-xs">
          <h2 className="font-bold text-gray-900 text-base">
            Ready to choose a professional?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Compare incoming quotes and select the best professional for your request.
          </p>

          <button
            type="button"
            onClick={onViewQuotes}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] text-white py-3 rounded-xl font-semibold hover:bg-[#156359] transition shadow-md shadow-teal-900/10 cursor-pointer text-sm"
          >
            <HiChatBubbleLeftEllipsis className="w-4 h-4" />
            <span>View Quotes ({quoteCount})</span>
          </button>
        </section>
      )}
    </aside>
  );
};

export default RequestSidebar;
