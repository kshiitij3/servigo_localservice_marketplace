import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowRight,
  HiClock,
  HiCheckCircle,
  HiCurrencyRupee,
  HiArchiveBox,
  HiExclamationCircle,
} from "react-icons/hi2";

import { updateBookingStatus } from "../../../services/booking.service";

const BookingStatusActions = ({ booking, onStatusUpdated }) => {
  const [loading, setLoading] = useState(false);

  const nextStatusMap = {
    confirmed: {
      status: "scheduled",
      label: "Mark as Scheduled",
      description: "Confirm booking schedule is set and ready",
    },

    scheduled: {
      status: "on_the_way",
      label: "I'm On The Way",
      description: "Notify customer that you are traveling to the job site",
    },

    on_the_way: {
      status: "arrived",
      label: "Mark Arrived",
      description: "Confirm your arrival at customer location",
    },

    arrived: {
      status: "work_started",
      label: "Start Work",
      description: "Begin service execution and start timer",
    },

    work_started: {
      status: "work_completed",
      label: "Mark Work Completed",
      description: "Finish service job and request payment from customer",
    },
  };

  const nextAction = nextStatusMap[booking?.status];

  const handleUpdate = async () => {
    if (!nextAction || !booking?._id) {
      return;
    }

    try {
      setLoading(true);

      const response = await updateBookingStatus(
        booking._id,
        nextAction.status
      );

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Booking status updated successfully."
      );

      const returnedBooking =
        response?.data?.data || response?.data || null;

      const mergedBooking = {
        ...booking,
        ...(returnedBooking || {}),
        status: returnedBooking?.status || nextAction.status,
        // Preserve customer & professional objects if populated in initial booking
        customer:
          typeof returnedBooking?.customer === "object" &&
          returnedBooking?.customer !== null
            ? returnedBooking.customer
            : booking?.customer,
        professional:
          typeof returnedBooking?.professional === "object" &&
          returnedBooking?.professional !== null
            ? returnedBooking.professional
            : booking?.professional,
        workLocation:
          returnedBooking?.workLocation || booking?.workLocation,
      };

      onStatusUpdated?.(mergedBooking);
    } catch (error) {
      console.error("Failed to update booking status:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update booking status."
      );
    } finally {
      setLoading(false);
    }
  };

  if (
    booking?.status === "payment_pending" ||
    booking?.status === "paid" ||
    booking?.status === "closed"
  ) {
    return (
      <div
        id="booking-status-completed-card"
        className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 shadow-xs"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            {booking.status === "payment_pending" ? (
              <HiClock className="w-5 h-5" />
            ) : booking.status === "paid" ? (
              <HiCurrencyRupee className="w-5 h-5" />
            ) : (
              <HiArchiveBox className="w-5 h-5" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">
              {booking.status === "payment_pending"
                ? "Work Completed"
                : booking.status === "paid"
                ? "Payment Received"
                : "Booking Closed"}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {booking.status === "payment_pending"
                ? "Work is completed. Waiting for customer to finalize and release payment."
                : booking.status === "paid"
                ? "Payment has been received and confirmed."
                : "This booking is closed and fully settled."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (booking?.status === "cancelled") {
    return (
      <div
        id="booking-status-cancelled-card"
        className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-6 shadow-xs"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <HiExclamationCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Booking Cancelled
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              This booking has been cancelled and no further actions can be taken.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!nextAction) {
    return null;
  }

  return (
    <section
      id="booking-status-actions-card"
      className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <HiCheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Update Booking
          </h2>
          <p className="text-xs text-gray-500">
            Advance the service progress milestone
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Current Status
          </span>
          <p className="font-semibold text-gray-800 text-base capitalize mt-0.5">
            {booking?.status?.replaceAll("_", " ")}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
            Next Milestone
          </span>
          <p className="text-sm font-semibold text-blue-900 mt-0.5">
            {nextAction.label}
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            {nextAction.description}
          </p>
        </div>

        <button
          id="btn-update-booking-status"
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#155f55] text-white py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Updating Status...</span>
            </>
          ) : (
            <>
              <span>{nextAction.label}</span>
              <HiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default BookingStatusActions;
