import { HiBanknotes, HiClock, HiChatBubbleBottomCenterText } from "react-icons/hi2";

const QuoteRevision = ({ revision, number }) => {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border-l-4 border-[#1a7a6e] bg-gray-50/90 rounded-r-xl p-4 shadow-xs">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-900">
            Revision #{number}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] border border-teal-100">
            Past Offer
          </span>
        </div>

        {revision?.createdAt && (
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatDate(revision.createdAt)}</span>
          </p>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-xs font-semibold text-gray-500">Offered:</span>
        <span className="text-base font-extrabold text-[#1a7a6e]">
          {formatAmount(revision?.amount)}
        </span>
      </div>

      {revision?.message && (
        <div className="mt-2 text-xs text-gray-600 bg-white/70 rounded-lg p-2.5 border border-gray-200/60 leading-relaxed whitespace-pre-wrap flex items-start gap-1.5">
          <HiChatBubbleBottomCenterText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>{revision.message}</span>
        </div>
      )}
    </div>
  );
};

export default QuoteRevision;
