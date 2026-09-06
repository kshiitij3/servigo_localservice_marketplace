import { useNavigate } from "react-router-dom";
import {
  HiBanknotes,
  HiClock,
  HiCalendarDays,
  HiEye,
  HiPencilSquare,
  HiChatBubbleBottomCenterText,
  HiCheckCircle,
} from "react-icons/hi2";
import QuoteStatus from "./QuoteStatus";

const QuoteCard = ({ quote }) => {
  const navigate = useNavigate();

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const duration = quote.estimatedDuration?.value
    ? `${quote.estimatedDuration.value} ${quote.estimatedDuration.unit}`
    : "Not specified";

  const isAccepted = quote.status === "accepted";
  const isEditable = ["submitted", "negotiating"].includes(quote.status);

  return (
    <div
      className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all ${
        isAccepted
          ? "border-emerald-300 ring-2 ring-emerald-500/15 bg-gradient-to-b from-emerald-50/20 to-white"
          : "border-gray-200/80 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Service Request
            </span>
            {quote.workRequest?.requestId && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                #{quote.workRequest.requestId}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-900 mt-1 truncate">
            {quote.workRequest?.title || "Service Request"}
          </h2>

          {quote.workRequest?.location?.city && (
            <p className="text-xs text-gray-500 mt-0.5">
              📍 {quote.workRequest.location.city}
            </p>
          )}
        </div>

        <div className="self-start">
          <QuoteStatus status={quote.status} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 bg-gray-50/70 border border-gray-100 rounded-xl p-4 mt-5">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
            <span>Quote Amount</span>
          </span>
          <p className="text-lg font-extrabold text-[#1a7a6e] mt-1">
            {formatAmount(quote.amount)}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Est. Duration</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1.5 truncate">
            {duration}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <span>Available Date</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1.5 truncate">
            {formatDate(quote.availableDate)}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Arrival Time</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1.5 truncate">
            {quote.availableTime || "Flexible"}
          </p>
        </div>
      </div>

      {/* Message Preview */}
      {quote.message && (
        <div className="mt-4 bg-teal-50/30 border border-teal-100/60 rounded-xl p-3.5">
          <p className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider mb-1 flex items-center gap-1">
            <HiChatBubbleBottomCenterText className="w-3.5 h-3.5" />
            <span>Your Proposal Note</span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {quote.message.length > 160
              ? `${quote.message.slice(0, 160)}...`
              : quote.message}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate(`/professional/quotes/${quote._id}`, {
                state: {
                  quote,
                  workRequest: quote.workRequest,
                },
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition cursor-pointer shadow-xs"
          >
            <HiEye className="w-4 h-4 text-gray-500" />
            <span>View Quote</span>
          </button>

          {isEditable && (
            <button
              type="button"
              onClick={() =>
                navigate(`/professional/quotes/${quote._id}/edit`, {
                  state: {
                    quote,
                    workRequest: quote.workRequest,
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-xs active:scale-[0.98] transition cursor-pointer"
            >
              <HiPencilSquare className="w-4 h-4" />
              <span>Edit Quote</span>
            </button>
          )}
        </div>

        {isAccepted && (
          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
            <HiCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Customer Accepted Your Offer</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;
