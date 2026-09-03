import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaLocationDot, FaIndianRupeeSign } from "react-icons/fa6";

const RequestCard = ({ request }) => {
  const navigate = useNavigate();
  const hasBudget = request.budget?.min || request.budget?.max;
  const budget = hasBudget
    ? `₹${request.budget?.min || 0} - ₹${request.budget?.max || 0}`
    : "Budget not set";
  const location =
    request.location?.city || request.location?.address || "Location added";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {request.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {request.description?.slice(0, 100)}
            {request.description?.length > 100 ? "..." : ""}
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e8f5f3] px-3 py-1 text-xs font-medium text-[#1a7a6e]">
          {request.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <p className="inline-flex items-center gap-2"><FaLocationDot className="text-[#1a7a6e]" aria-hidden="true" /> {location}</p>
        <p className="inline-flex items-center gap-2"><FaIndianRupeeSign className="text-[#1a7a6e]" aria-hidden="true" /> {budget}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/customer/work-requests/${request._id}`)}
        className="mt-4 font-medium text-[#1a7a6e] hover:underline"
      >
        <span className="inline-flex items-center gap-2">View Request <FaArrowRight size={13} /></span>
      </button>
    </div>
  );
};

export default RequestCard;
