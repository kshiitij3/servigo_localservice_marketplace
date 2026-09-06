import { useNavigate } from "react-router-dom";
import { HiChatBubbleLeftEllipsis, HiArrowPath } from "react-icons/hi2";

const QuotesEmptyState = ({ workRequestId, onRefresh }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-10 sm:p-14 text-center shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
        <HiChatBubbleLeftEllipsis className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        No quotes submitted yet
      </h2>

      <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
        We've notified qualified professionals in your area. As soon as they
        review your requirements, their custom proposals and pricing will appear
        here in real time.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => navigate(`/customer/work-requests/${workRequestId}`)}
          className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#156359] transition shadow-xs cursor-pointer"
        >
          View Request Details
        </button>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <HiArrowPath className="w-4 h-4" />
            <span>Refresh Quotes</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default QuotesEmptyState;
