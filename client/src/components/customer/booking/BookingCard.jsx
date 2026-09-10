import { useNavigate } from "react-router-dom";
import {
  HiUser,
  HiCalendarDays,
  HiClock,
  HiBanknotes,
  HiMapPin,
  HiArrowRight,
} from "react-icons/hi2";

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const statusStyles = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200/80",
    scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    on_the_way: "bg-amber-50 text-amber-700 border-amber-200/80",
    arrived: "bg-orange-50 text-orange-700 border-orange-200/80",
    work_started: "bg-purple-50 text-purple-700 border-purple-200/80",
    work_completed: "bg-teal-50 text-teal-700 border-teal-200/80",
    payment_pending: "bg-yellow-50 text-yellow-800 border-yellow-200/80",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    closed: "bg-gray-100 text-gray-700 border-gray-200/80",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200/80",
  };

  const statusLabel =
    booking?.status
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const locationText =
    booking?.workLocation?.city ||
    booking?.workLocation?.address ||
    "Location details available";

  return (
    <div
      id={`customer-booking-card-${booking?._id}`}
      className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Booking
            </span>
            <span className="text-xs text-gray-400 font-mono">
              #{booking?.bookingId || booking?._id?.slice(-6) || booking?._id}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1 group-hover:text-[#1a7a6e] transition-colors">
            {booking?.workRequest?.title || "Service Booking"}
          </h2>

          {booking?.workRequest?.category && (
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 capitalize">
              {booking.workRequest.category}
            </span>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border w-fit shrink-0 ${
            statusStyles[booking?.status] ||
            "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 p-3.5 rounded-xl bg-gray-50/60 border border-gray-100">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiUser className="w-3.5 h-3.5 text-gray-400" />
            <span>Professional</span>
          </span>
          <p className="text-sm font-bold text-gray-800 mt-1 truncate">
            {booking?.professional?.name || "Professional"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
            <span>Amount</span>
          </span>
          <p className="text-sm font-bold text-[#1a7a6e] mt-1">
            {formatAmount(booking?.agreedAmount)}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <span>Scheduled Date</span>
          </span>
          <p className="text-sm font-bold text-gray-800 mt-1">
            {formatDate(booking?.scheduledDate)}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Scheduled Time</span>
          </span>
          <p className="text-sm font-bold text-gray-800 mt-1">
            {booking?.scheduledTime?.start && booking?.scheduledTime?.end
              ? `${booking.scheduledTime.start} - ${booking.scheduledTime.end}`
              : "Not specified"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
          <HiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>

        <button
          id={`btn-view-booking-${booking?._id}`}
          type="button"
          onClick={() => navigate(`/customer/bookings/${booking?._id}`)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:shadow"
        >
          <span>View Booking</span>
          <HiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
