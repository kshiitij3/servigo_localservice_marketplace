import {
  HiChatBubbleLeftEllipsis,
  HiCurrencyRupee,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";

const QuotesHeader = ({ request, quotesCount, lowestQuote }) => {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "Not specified";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 mb-1.5">
            <span>Work Request</span>
            {request.requestId && (
              <>
                <span>•</span>
                <span className="font-mono font-semibold text-gray-700">
                  {request.requestId}
                </span>
              </>
            )}
            <span>•</span>
            <span className="capitalize">
              {request.category?.name || "General"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {request.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
              <HiChatBubbleLeftEllipsis className="w-4 h-4 text-[#1a7a6e]" />
              <span>
                {quotesCount} {quotesCount === 1 ? "Quote" : "Quotes"} Received
              </span>
            </span>

            {request.budget?.min || request.budget?.max ? (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <HiCurrencyRupee className="w-4 h-4 text-gray-400" />
                <span>
                  Budget: ₹{request.budget?.min || 0}
                  {request.budget?.max ? ` - ₹${request.budget.max}` : "+"}
                </span>
              </span>
            ) : null}

            {lowestQuote !== null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80">
                <HiSparkles className="w-3.5 h-3.5" />
                <span>Starts at {formatAmount(lowestQuote)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Action / Tips Box */}
        <div className="bg-[#1a7a6e]/5 border border-[#1a7a6e]/20 rounded-xl p-4 lg:max-w-sm flex items-start gap-3">
          <HiShieldCheck className="w-6 h-6 text-[#1a7a6e] shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed">
            <span className="font-bold text-[#1a7a6e] block mb-0.5">
              Verified Servigo Guarantee
            </span>
            Review quotes, compare durations, and accept the offer that fits your
            schedule best. Payments are protected.
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotesHeader;
