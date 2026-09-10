import { useState } from "react";
import {
  HiCalendarDays,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi2";

const BookingSchedule = ({ quote, onSubmit, loading }) => {
  const defaultDate = quote?.availableDate
    ? quote.availableDate.split("T")[0]
    : "";

  const defaultStartTime = quote?.availableTime || "";

  // Helper to suggest end time based on duration
  const getSuggestedEndTime = (start, duration) => {
    if (!start || !duration?.value) return "";
    const [h, m] = start.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "";

    let totalMinutes = h * 60 + m;
    if (duration.unit === "hours") {
      totalMinutes += Math.round(Number(duration.value) * 60);
    } else if (duration.unit === "minutes") {
      totalMinutes += Math.round(Number(duration.value));
    } else if (duration.unit === "days") {
      totalMinutes += 120; // default 2 hours window if in days
    } else {
      totalMinutes += 60;
    }

    const endH = Math.min(23, Math.floor(totalMinutes / 60));
    const endM = Math.min(59, totalMinutes % 60);
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  const [scheduledDate, setScheduledDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(
    getSuggestedEndTime(defaultStartTime, quote?.estimatedDuration)
  );
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!scheduledDate) {
      setError("Please select a service date.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select both start time and end time.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    /*
     * Backend validation expects an ISO date.
     * Example: 2026-09-10 -> 2026-09-10T00:00:00.000Z
     */
    const isoDate = new Date(`${scheduledDate}T00:00:00`).toISOString();

    onSubmit({
      scheduledDate: isoDate,
      scheduledTime: {
        start: startTime,
        end: endTime,
      },
    });
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Schedule Your Service
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose the final date and service time slot for this booking.
        </p>
      </div>

      {quote?.availableDate && (
        <div className="mb-6 p-4 rounded-xl bg-teal-50/60 border border-teal-100/80 flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-[#1a7a6e] shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950 leading-relaxed">
            <span className="font-bold">Professional's Proposed Timing: </span>
            {new Date(quote.availableDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            at {quote.availableTime || "any preferred time"}. You may keep this or adjust it.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scheduled Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiCalendarDays className="w-4 h-4 text-[#1a7a6e]" />
            <span>Scheduled Service Date</span>
          </label>
          <input
            type="date"
            min={today}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white cursor-pointer"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Choose the day you want the professional to visit.
          </p>
        </div>

        {/* Time Slot (Start & End) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HiClock className="w-4 h-4 text-[#1a7a6e]" />
              <span>Start Time (Arrival)</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartTime(newStart);
                if (!endTime || endTime <= newStart) {
                  setEndTime(getSuggestedEndTime(newStart, quote?.estimatedDuration));
                }
              }}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HiClock className="w-4 h-4 text-[#1a7a6e]" />
              <span>Estimated End Time</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white cursor-pointer"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center gap-2">
            <HiExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#155f55] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-teal-900/10 active:scale-[0.98] cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Confirmed Booking...</span>
            </>
          ) : (
            <>
              <HiCheckCircle className="w-5 h-5" />
              <span>Confirm Booking & Schedule</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default BookingSchedule;
