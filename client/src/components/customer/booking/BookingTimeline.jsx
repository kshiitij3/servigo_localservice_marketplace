import {
  HiCheck,
  HiClock,
  HiXCircle,
} from "react-icons/hi2";

const BookingTimeline = ({ booking }) => {
  if (!booking) return null;

  const isCancelled = booking.status === "cancelled";

  const steps = [
    {
      value: "confirmed",
      label: "Confirmed",
      description: "Booking confirmed with service professional",
      time: booking.confirmedAt || booking.createdAt,
    },
    {
      value: "scheduled",
      label: "Scheduled",
      description: "Appointment scheduled in professional calendar",
      time: null,
    },
    {
      value: "on_the_way",
      label: "On The Way",
      description: "Professional has dispatched and is on the way",
      time: booking.onTheWayAt,
    },
    {
      value: "arrived",
      label: "Arrived",
      description: "Professional has reached service location",
      time: booking.arrivedAt,
    },
    {
      value: "work_started",
      label: "Work Started",
      description: "Service work is actively in progress",
      time: booking.workStartedAt,
    },
    {
      value: "work_completed",
      label: "Work Completed",
      description: "Work has finished and is ready for payment",
      time: booking.workCompletedAt,
    },
    {
      value: "payment_pending",
      label: "Payment Pending",
      description: "Waiting for invoice settlement",
      time: null,
    },
    {
      value: "paid",
      label: "Paid",
      description: "Payment received and verified",
      time: booking.paidAt,
    },
    {
      value: "closed",
      label: "Closed",
      description: "Service contract completed & closed",
      time: booking.closedAt,
    },
  ];

  const statusOrder = [
    "confirmed",
    "scheduled",
    "on_the_way",
    "arrived",
    "work_started",
    "work_completed",
    "payment_pending",
    "paid",
    "closed",
  ];

  const currentIndex = statusOrder.indexOf(booking.status);

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Booking Progress
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Live milestone tracking for your scheduled service
          </p>
        </div>

        {isCancelled && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <HiXCircle className="w-4 h-4 text-rose-600" />
            <span>Booking Cancelled</span>
          </span>
        )}
      </div>

      <div className="relative pl-2 sm:pl-4 space-y-6">
        {steps.map((step, index) => {
          const isCompleted =
            !isCancelled && currentIndex >= 0 && index <= currentIndex;
          const isCurrent =
            !isCancelled && index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.value} className="relative flex items-start gap-4">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[18px] top-9 bottom-[-24px] w-0.5 transition-colors ${
                    isCompleted && index < currentIndex
                      ? "bg-[#1a7a6e]"
                      : "bg-gray-200"
                  }`}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all relative z-10 ${
                  isCurrent
                    ? "bg-[#1a7a6e] text-white ring-4 ring-[#1a7a6e]/20 shadow-sm"
                    : isCompleted
                    ? "bg-[#1a7a6e] text-white"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <HiCheck className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step text info */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p
                    className={`text-sm font-bold ${
                      isCurrent
                        ? "text-[#1a7a6e]"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {step.time && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <HiClock className="w-3.5 h-3.5" />
                      <span>{formatTime(step.time)}</span>
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs mt-0.5 ${
                    isCurrent
                      ? "text-gray-700 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BookingTimeline;
