import { HiCheck } from "react-icons/hi2";

const BookingTimeline = ({ status }) => {
  const steps = [
    {
      value: "confirmed",
      label: "Confirmed",
      desc: "Booking request confirmed and reserved",
    },
    {
      value: "scheduled",
      label: "Scheduled",
      desc: "Date and time slot locked in schedule",
    },
    {
      value: "on_the_way",
      label: "On The Way",
      desc: "Professional en route to client location",
    },
    {
      value: "arrived",
      label: "Arrived",
      desc: "Professional reached customer premises",
    },
    {
      value: "work_started",
      label: "Work Started",
      desc: "Service execution currently in progress",
    },
    {
      value: "work_completed",
      label: "Work Completed",
      desc: "All requested service tasks fulfilled",
    },
    {
      value: "payment_pending",
      label: "Payment Pending",
      desc: "Waiting for customer to complete payment",
    },
    {
      value: "paid",
      label: "Paid",
      desc: "Payment successfully verified & received",
    },
    {
      value: "closed",
      label: "Closed",
      desc: "Booking fully finished and archived",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.value === status
  );

  return (
    <section
      id="booking-timeline-section"
      className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Booking Progress
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status updates along service lifecycle
          </p>
        </div>

        {status && (
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-[#1a7a6e] border border-teal-200">
            {status.replaceAll("_", " ")}
          </span>
        )}
      </div>

      <div className="relative pl-2 sm:pl-4 space-y-6">
        {steps.map((step, index) => {
          const completed =
            currentIndex >= 0 && index <= currentIndex;
          const current = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.value}
              className="relative flex items-start gap-4 group"
            >
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[18px] top-10 bottom-[-24px] w-[2px] transition-colors ${
                    completed && currentIndex > index
                      ? "bg-[#1a7a6e]"
                      : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator */}
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  current
                    ? "bg-[#1a7a6e] text-white ring-4 ring-[#1a7a6e]/20 shadow-md scale-110"
                    : completed
                    ? "bg-[#1a7a6e] text-white"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {completed && !current ? (
                  <HiCheck className="w-4 h-4 stroke-2" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Details */}
              <div className="pt-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm font-bold ${
                      current
                        ? "text-[#1a7a6e]"
                        : completed
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {current && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-[#1a7a6e] animate-pulse">
                      Active Stage
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs mt-0.5 ${
                    completed || current
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.desc}
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
