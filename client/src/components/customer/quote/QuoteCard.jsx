import {
  HiClock,
  HiCalendar,
  HiStar,
  HiCheckBadge,
  HiChatBubbleLeftEllipsis,
  HiCheck,
  HiBriefcase,
  HiEye,
  HiSparkles,
  HiCheckCircle,
} from "react-icons/hi2";

const QuoteCard = ({
  quote,
  isJobBooked,
  acceptingQuoteId,
  onAccept,
  onViewDetails,
}) => {
  const isAcceptable =
    ["submitted", "negotiating"].includes(quote.status) && !isJobBooked;

  const prof = quote.professional || {};
  const profProfile = prof.professionalProfile || {};

  const getProfessionalName = () => {
    return prof.name || prof.fullName || "Verified Professional";
  };

  const getProfessionalInitial = () => {
    return getProfessionalName().charAt(0).toUpperCase();
  };

  const getProfessionalPhoto = () => {
    const img = prof.profileImage;
    if (!img) return null;
    if (typeof img === "string" && img.trim()) return img;
    if (img.url && typeof img.url === "string") return img.url;
    return null;
  };

  const formatDate = (date) => {
    if (!date) return "Flexible / To be agreed";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "Not specified";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getDuration = () => {
    if (!quote?.estimatedDuration?.value) return "Not specified";
    return `${quote.estimatedDuration.value} ${quote.estimatedDuration.unit}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "negotiating":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "withdrawn":
        return "bg-gray-100 text-gray-600 border-gray-200/80";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/80";
    }
  };

  const getStatusLabel = (status) => {
    return (
      status
        ?.replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) || "Submitted"
    );
  };

  const photoUrl = getProfessionalPhoto();
  const rating = profProfile.averageRating;
  const reviewsCount = profProfile.totalReviews || 0;
  const experience = profProfile.experience;
  const isAccepted = quote.status === "accepted";

  return (
    <section
      className={`bg-white border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        isAccepted
          ? "border-emerald-400 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/20 to-white"
          : "border-gray-200/80 hover:border-gray-300"
      }`}
    >
      {/* Top Ribbon for Accepted quote */}
      {isAccepted && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-xs">
          <HiCheck className="w-3.5 h-3.5" />
          <span>Accepted Offer</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Professional Column */}
        <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
          <div className="flex items-center gap-3.5">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={getProfessionalName()}
                className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center text-xl font-bold shadow-xs">
                {getProfessionalInitial()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-gray-900 truncate text-base">
                  {getProfessionalName()}
                </h2>
                <HiCheckBadge
                  className="w-4 h-4 text-[#1a7a6e] shrink-0"
                  title="Verified Professional"
                />
              </div>

              <p className="text-xs text-gray-500">Service Professional</p>

              {/* Ratings & Reviews */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center text-amber-500">
                  <HiStar className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold text-gray-800 ml-1">
                    {rating !== undefined && rating !== null
                      ? Number(rating).toFixed(1)
                      : "New"}
                  </span>
                </div>
                {reviewsCount > 0 && (
                  <span className="text-xs text-gray-400">
                    ({reviewsCount} reviews)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Extra Professional Stats */}
          <div className="mt-4 pt-3 border-t border-gray-50 flex flex-wrap gap-2 text-xs text-gray-500">
            {experience !== undefined && experience > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                <HiBriefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>{experience} yrs exp</span>
              </span>
            )}

            {profProfile.availabilityStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs capitalize ${
                  profProfile.availabilityStatus === "available"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    profProfile.availabilityStatus === "available"
                      ? "bg-emerald-500"
                      : "bg-gray-400"
                  }`}
                />
                <span>{profProfile.availabilityStatus}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quote Information & Proposal Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Status and revision badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                  quote.status
                )}`}
              >
                {getStatusLabel(quote.status)}
              </span>

              {quote.status === "negotiating" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/80">
                  <HiSparkles className="w-3 h-3 text-amber-600" />
                  <span>Revised Offer</span>
                </span>
              )}

              {quote.revisions?.length > 0 && (
                <span className="text-xs text-gray-400">
                  {quote.revisions.length} previous version(s)
                </span>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Quoted Price
                </span>
                <div className="flex items-center text-[#1a7a6e] font-extrabold text-xl mt-0.5">
                  <span>{formatAmount(quote.amount)}</span>
                </div>
                {quote.initialAmount && quote.initialAmount !== quote.amount && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {formatAmount(quote.initialAmount)}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Est. Duration
                </span>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm mt-1.5">
                  <HiClock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{getDuration()}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Available Date
                </span>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm mt-1.5">
                  <HiCalendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">
                    {formatDate(quote.availableDate)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Time Window
                </span>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm mt-1.5">
                  <span className="text-xs text-gray-700 font-medium truncate">
                    {quote.availableTime || "Flexible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Message / Notes */}
            {quote.message && (
              <div className="mt-4 bg-teal-50/30 border border-teal-100/60 rounded-xl p-3.5">
                <p className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <HiChatBubbleLeftEllipsis className="w-3.5 h-3.5" />
                  <span>Note from Professional:</span>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  “{quote.message}”
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onViewDetails && onViewDetails(quote)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer shadow-xs"
            >
              <HiEye className="w-4 h-4 text-gray-500" />
              <span>View Quote</span>
            </button>

            <div className="flex items-center gap-3">
              {isAcceptable && (
                <button
                  type="button"
                  onClick={() => onAccept(quote._id)}
                  disabled={acceptingQuoteId === quote._id}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-bold text-sm hover:bg-[#156359] active:scale-[0.98] transition shadow-md shadow-teal-900/10 disabled:opacity-50 cursor-pointer"
                >
                  <HiCheck className="w-4 h-4" />
                  <span>
                    {acceptingQuoteId === quote._id
                      ? "Accepting Quote..."
                      : "Accept Quote & Book"}
                  </span>
                </button>
              )}

              {isAccepted && (
                <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-sm">
                  <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Accepted on this Job</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteCard;
