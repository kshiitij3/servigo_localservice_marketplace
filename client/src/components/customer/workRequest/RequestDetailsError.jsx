import { HiArrowPath, HiExclamationTriangle } from "react-icons/hi2";

const RequestDetailsError = ({ fetchError, onBack, onRetry }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xs">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiExclamationTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Unable to Load Work Request
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          {fetchError || "The work request details could not be retrieved."}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#156359] transition cursor-pointer"
          >
            Back to My Requests
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <HiArrowPath className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsError;
