import { useNavigate } from "react-router-dom";
import {
  HiMapPin,
  HiCalendarDays,
  HiBanknotes,
  HiBolt,
  HiSignal,
  HiArrowRight,
  HiChatBubbleBottomCenterText,
} from "react-icons/hi2";

const JobCard = ({ job, distanceKm }) => {
  const navigate = useNavigate();

  const budget = job.budget;

  const budgetText =
    budget?.min && budget?.max
      ? `₹${Number(budget.min).toLocaleString("en-IN")} - ₹${Number(
          budget.max
        ).toLocaleString("en-IN")}`
      : budget?.min
      ? `From ₹${Number(budget.min).toLocaleString("en-IN")}`
      : budget?.max
      ? `Up to ₹${Number(budget.max).toLocaleString("en-IN")}`
      : "Budget not specified";

  const dateText = job.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Flexible";

  const formattedDistance =
    distanceKm !== undefined && distanceKm !== null
      ? `${distanceKm.toFixed(1)} km away`
      : `${job.visibilityRadius ?? 10} km radius`;

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:border-[#1a7a6e]/40 transition-all flex flex-col justify-between shadow-xs">
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight truncate">
                {job.title}
              </h3>

              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[11px] font-bold uppercase tracking-wider">
                  <HiBolt className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>Urgent</span>
                </span>
              )}

              {job.category?.name && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1a7a6e] border border-teal-200/60 text-xs font-semibold">
                  {job.category.name}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {job.description?.length > 140
                ? `${job.description.slice(0, 140)}...`
                : job.description}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3.5 bg-gray-50/70 border border-gray-100 rounded-xl p-4 mt-5">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
              <span>Budget</span>
            </span>
            <p className="text-sm font-bold text-gray-900 mt-1 truncate">
              {budgetText}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
              <span>Preferred Date</span>
            </span>
            <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
              {dateText}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <HiMapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>Location</span>
            </span>
            <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
              {job.location?.city || "Location available"}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <HiSignal className="w-3.5 h-3.5 text-gray-400" />
              <span>Distance / Radius</span>
            </span>
            <p className="text-sm font-semibold text-[#1a7a6e] mt-1 truncate">
              📍 {formattedDistance}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 mt-5 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate(`/professional/jobs/${job._id}`)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition cursor-pointer shadow-xs"
        >
          <span>View Details</span>
          <HiArrowRight className="w-4 h-4 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/professional/jobs/${job._id}/quote`)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition cursor-pointer"
        >
          <HiChatBubbleBottomCenterText className="w-4 h-4" />
          <span>Send Quote</span>
        </button>
      </div>
    </div>
  );
};

export default JobCard;
