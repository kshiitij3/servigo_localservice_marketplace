import {
  HiUser,
  HiPhone,
  HiCalendarDays,
  HiClock,
  HiBanknotes,
  HiCreditCard,
  HiBriefcase,
} from "react-icons/hi2";

const BookingSummary = ({ booking }) => {
  const professional = booking?.professional;
  const customer = booking?.customer;

  const amount =
    booking?.agreedAmount !== undefined
      ? `₹${Number(booking.agreedAmount).toLocaleString("en-IN")}`
      : "Not specified";

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center font-bold">
          <HiBriefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Booking Summary
          </h2>
          <p className="text-xs text-gray-500">
            Customer and service agreement
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-5">
        {/* Customer Information */}
        <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <HiUser className="w-3.5 h-3.5 text-gray-400" />
            <span>Customer</span>
          </div>

          <p className="font-semibold text-gray-800 mt-1.5 text-base">
            {customer?.name || customer?.fullName || "Customer"}
          </p>

          {customer?.phone && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <HiPhone className="w-3.5 h-3.5 text-gray-400" />
              <a
                href={`tel:${customer.phone}`}
                className="hover:text-[#1a7a6e] hover:underline"
              >
                {customer.phone}
              </a>
            </div>
          )}

          {customer?.email && (
            <p className="text-xs text-gray-500 mt-0.5">
              {customer.email}
            </p>
          )}
        </div>

        {/* Professional Information */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Assigned Professional
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            {professional?.name || professional?.fullName || "Professional"}
          </p>
        </div>

        {/* Agreed Amount */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
            <span>Agreed Amount</span>
          </div>

          <p className="text-2xl font-black text-gray-900 mt-1 tracking-tight text-[#1a7a6e]">
            {amount}
          </p>
        </div>

        {/* Scheduled Date */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <span>Scheduled Date</span>
          </div>

          <p className="font-medium text-gray-700 mt-1">
            {formatDate(booking?.scheduledDate)}
          </p>
        </div>

        {/* Scheduled Time */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Scheduled Time</span>
          </div>

          <p className="font-medium text-gray-700 mt-1">
            {booking?.scheduledTime?.start &&
            booking?.scheduledTime?.end
              ? `${booking.scheduledTime.start} - ${booking.scheduledTime.end}`
              : "Not specified"}
          </p>
        </div>

        {/* Payment Status */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            <HiCreditCard className="w-3.5 h-3.5 text-gray-400" />
            <span>Payment Status</span>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getPaymentBadge(
              booking?.paymentStatus
            )}`}
          >
            {booking?.paymentStatus || "pending"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default BookingSummary;
