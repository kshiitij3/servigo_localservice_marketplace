import {
  HiChatBubbleLeftEllipsis,
  HiPencilSquare,
  HiTrash,
  HiExclamationTriangle,
} from "react-icons/hi2";

const statusStyles = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  QUOTED: "bg-blue-50 text-blue-700 border-blue-200/80",
  BOOKED: "bg-purple-50 text-purple-700 border-purple-200/80",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200/80",
  COMPLETED: "bg-gray-100 text-gray-700 border-gray-200/80",
  CANCELLED_BY_CUSTOMER: "bg-rose-50 text-rose-700 border-rose-200/80",
  CANCELLED_BY_PROFESSIONAL: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const RequestDetailsHeader = ({
  request,
  quoteCount,
  deleting,
  onDelete,
  onViewQuotes,
  onEdit,
}) => {
  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    if (status.startsWith("CANCELLED")) return "Cancelled";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isCancellable =
    request.status === "OPEN" || request.status === "QUOTED";

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {request.title}
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                statusStyles[request.status] ||
                "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {getStatusLabel(request.status)}
            </span>

            {request.isUrgent && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 animate-pulse">
                <HiExclamationTriangle className="w-3.5 h-3.5" />
                <span>URGENT</span>
              </span>
            )}
          </div>

          {request.requestId && (
            <p className="text-gray-500 text-sm mt-2">
              Request ID:{" "}
              <span className="font-mono font-semibold text-gray-700">
                {request.requestId}
              </span>
            </p>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap gap-2.5">
          {isCancellable && (
            <>
              <button
                type="button"
                onClick={onViewQuotes}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a7a6e] text-white text-sm font-semibold hover:bg-[#156359] transition shadow-md shadow-teal-900/10 cursor-pointer"
              >
                <HiChatBubbleLeftEllipsis className="w-4 h-4" />
                <span>View Quotes ({quoteCount})</span>
              </button>

              {request.status === "OPEN" && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  <HiPencilSquare className="w-4 h-4 text-gray-500" />
                  <span>Edit</span>
                </button>
              )}

              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
                <span>{deleting ? "Cancelling..." : "Cancel Request"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RequestDetailsHeader;
