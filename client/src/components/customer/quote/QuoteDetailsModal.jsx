import {
  HiXMark,
  HiCheckBadge,
  HiCheck,
} from "react-icons/hi2";

const QuoteDetailsModal = ({
  quote,
  requestTitle,
  isJobBooked,
  acceptingQuoteId,
  onClose,
  onAccept,
}) => {
  if (!quote) return null;

  const prof = quote.professional || {};

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

  const isAcceptable =
    ["submitted", "negotiating"].includes(quote.status) && !isJobBooked;

  const photoUrl = getProfessionalPhoto();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-gray-100">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={getProfessionalName()}
              className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center text-xl font-bold">
              {getProfessionalInitial()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-lg">
                {getProfessionalName()}
              </h3>
              <HiCheckBadge className="w-4 h-4 text-[#1a7a6e]" />
            </div>
            <p className="text-xs text-gray-500">
              Quote Proposal for: {requestTitle}
            </p>
          </div>
        </div>

        {/* Price & Duration Big Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#1a7a6e]/5 border border-[#1a7a6e]/20 rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">
              Agreed Price
            </span>
            <span className="text-2xl font-black text-[#1a7a6e] mt-1 block">
              {formatAmount(quote.amount)}
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">
              Est. Duration
            </span>
            <span className="text-lg font-bold text-gray-800 mt-1 block">
              {getDuration()}
            </span>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-gray-500">Available Date:</span>
            <span className="font-semibold text-gray-800">
              {formatDate(quote.availableDate)}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-gray-500">Available Time:</span>
            <span className="font-semibold text-gray-800">
              {quote.availableTime || "Flexible / Mutual agreement"}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-gray-500">Quote Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(
                quote.status
              )}`}
            >
              {getStatusLabel(quote.status)}
            </span>
          </div>
        </div>

        {/* Message */}
        {quote.message && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Message from Professional
            </h4>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed whitespace-pre-wrap">
              {quote.message}
            </p>
          </div>
        )}

        {/* Revisions History (if any) */}
        {quote.revisions?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Negotiation History
            </h4>
            <div className="space-y-2 text-xs">
              {quote.revisions.map((rev, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-600"
                >
                  <span>Revision #{idx + 1}</span>
                  <span className="font-bold text-gray-800">
                    {formatAmount(rev.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            Close
          </button>

          {isAcceptable && (
            <button
              type="button"
              onClick={() => onAccept(quote._id)}
              disabled={acceptingQuoteId === quote._id}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-bold text-sm hover:bg-[#156359] transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <HiCheck className="w-4 h-4" />
              <span>
                {acceptingQuoteId === quote._id
                  ? "Accepting..."
                  : "Accept Quote & Book"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailsModal;
