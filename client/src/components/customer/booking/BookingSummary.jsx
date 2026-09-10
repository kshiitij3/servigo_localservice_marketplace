import {
  HiBriefcase,
  HiUser,
  HiBanknotes,
  HiClock,
  HiMapPin,
  HiCheckBadge,
  HiCreditCard,
  HiCalendarDays,
  HiPhone,
} from "react-icons/hi2";

const BookingSummary = ({ booking, quote, workRequest }) => {
  const effectiveQuote = booking?.quote || quote;
  const effectiveWorkRequest = booking?.workRequest || workRequest;
  const professional = booking?.professional || effectiveQuote?.professional;

  const professionalName =
    professional?.name ||
    professional?.fullName ||
    "Professional";

  const amount =
    booking?.agreedAmount !== undefined
      ? booking.agreedAmount
      : effectiveQuote?.amount !== undefined
      ? effectiveQuote.amount
      : null;

  const formattedAmount =
    amount !== null
      ? `₹${Number(amount).toLocaleString("en-IN")}`
      : "Not available";

  const duration =
    effectiveQuote?.estimatedDuration?.value
      ? `${effectiveQuote.estimatedDuration.value} ${effectiveQuote.estimatedDuration.unit}`
      : "Not specified";

  const location =
    booking?.workLocation || effectiveWorkRequest?.location;

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const scheduledDate =
    booking?.scheduledDate || effectiveQuote?.availableDate;

  const scheduledTime =
    booking?.scheduledTime || {
      start: effectiveQuote?.availableTime,
      end: null,
    };

  const paymentStatus = booking?.paymentStatus || "pending";

  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      default:
        return "bg-yellow-50 text-yellow-800 border-yellow-200/80";
    }
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0">
          <HiCheckBadge className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Booking Summary
          </h2>
          <p className="text-xs text-gray-500">
            Confirmed service details
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Service */}
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiBriefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>Service Request</span>
          </span>
          <p className="font-semibold text-gray-800 text-base mt-1">
            {effectiveWorkRequest?.title || "Service Request"}
          </p>
          {effectiveWorkRequest?.category && (
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 mt-1 capitalize">
              {effectiveWorkRequest.category}
            </span>
          )}
        </div>

        {/* Professional */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiUser className="w-3.5 h-3.5 text-gray-400" />
            <span>Assigned Professional</span>
          </span>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="w-9 h-9 rounded-full bg-[#1a7a6e]/10 text-[#1a7a6e] font-bold text-sm flex items-center justify-center shrink-0 border border-[#1a7a6e]/20">
              {professionalName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {professionalName}
              </p>
              {professional?.phone ? (
                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <HiPhone className="w-3 h-3 text-gray-400" />
                  <span>{professional.phone}</span>
                </p>
              ) : (
                <p className="text-[11px] text-teal-700 font-medium">
                  Verified Service Partner
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Agreed Amount */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
            <span>Agreed Amount</span>
          </span>
          <p className="text-2xl font-extrabold text-[#1a7a6e] mt-1">
            {formattedAmount}
          </p>
          <p className="text-[11px] text-gray-400">
            Agreed fixed price
          </p>
        </div>

        {/* Scheduled Date */}
        {scheduledDate && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
              <span>Scheduled Date</span>
            </span>
            <p className="font-semibold text-gray-800 text-sm mt-1">
              {formatDate(scheduledDate)}
            </p>
          </div>
        )}

        {/* Scheduled Time */}
        {(scheduledTime?.start || duration) && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <HiClock className="w-3.5 h-3.5 text-gray-400" />
              <span>Scheduled Time</span>
            </span>
            <p className="font-semibold text-gray-800 text-sm mt-1">
              {scheduledTime?.start && scheduledTime?.end
                ? `${scheduledTime.start} - ${scheduledTime.end}`
                : scheduledTime?.start || duration}
            </p>
          </div>
        )}

        {/* Location */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiMapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>Service Location</span>
          </span>
          <p className="text-sm font-medium text-gray-800 mt-1">
            {location?.address || location?.city || "Location details provided"}
          </p>
          {location?.city && (
            <p className="text-xs text-gray-500 mt-0.5">
              {location.city}
              {location.state ? `, ${location.state}` : ""}
              {location.pincode ? ` - ${location.pincode}` : ""}
            </p>
          )}
        </div>

        {/* Payment Status (if booking is provided) */}
        {booking && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <HiCreditCard className="w-3.5 h-3.5 text-gray-400" />
              <span>Payment Status</span>
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getPaymentBadge(
                paymentStatus
              )}`}
            >
              {paymentStatus}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSummary;
