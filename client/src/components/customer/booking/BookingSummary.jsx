import {
  HiBriefcase,
  HiUser,
  HiBanknotes,
  HiClock,
  HiMapPin,
  HiCheckBadge,
} from "react-icons/hi2";

const BookingSummary = ({ quote, workRequest }) => {
  const professionalName =
    quote?.professional?.name ||
    quote?.professional?.fullName ||
    "Professional";

  const amount =
    quote?.amount !== undefined
      ? `₹${Number(quote.amount).toLocaleString("en-IN")}`
      : "Not available";

  const duration =
    quote?.estimatedDuration?.value
      ? `${quote.estimatedDuration.value} ${quote.estimatedDuration.unit}`
      : "Not specified";

  const location = workRequest?.location;

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
            Confirmed quote details
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
            {workRequest?.title || "Service Request"}
          </p>
          {workRequest?.category && (
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 mt-1 capitalize">
              {workRequest.category}
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
              <p className="text-[11px] text-teal-700 font-medium">
                Verified Service Partner
              </p>
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
            {amount}
          </p>
          <p className="text-[11px] text-gray-400">
            Fixed price agreed in accepted quote
          </p>
        </div>

        {/* Duration */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Estimated Duration</span>
          </span>
          <p className="font-semibold text-gray-800 text-sm mt-1">
            {duration}
          </p>
        </div>

        {/* Location */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiMapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>Service Location</span>
          </span>
          <p className="text-sm font-medium text-gray-800 mt-1">
            {location?.address || location?.city || "Location selected"}
          </p>
          {location?.city && (
            <p className="text-xs text-gray-500 mt-0.5">
              {location.city}
              {location.state ? `, ${location.state}` : ""}
              {location.pincode ? ` - ${location.pincode}` : ""}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSummary;
