import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft, HiExclamationCircle } from "react-icons/hi2";

import { createBooking } from "../../services/booking.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import BookingSummary from "../../components/customer/booking/BookingSummary";
import BookingSchedule from "../../components/customer/booking/BookingSchedule";

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quote = location.state?.quote;
  const workRequest = location.state?.workRequest || quote?.workRequest;

  const [loading, setLoading] = useState(false);

  if (!quote || !workRequest) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <CustomerNavbar />

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <HiExclamationCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Booking information is missing
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              Please return to your service requests, review the received quotes, and select an accepted quote to proceed.
            </p>

            <button
              onClick={() => navigate("/customer/work-requests")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to Requests</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleCreateBooking = async (schedule) => {
    try {
      setLoading(true);

      const payload = {
        quote: quote._id,
        scheduledDate: schedule.scheduledDate,
        scheduledTime: schedule.scheduledTime,
      };

      const response = await createBooking(payload);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Booking confirmed & created successfully!"
      );

      navigate("/customer/bookings");
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider">
            Final Step
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Confirm Your Service Booking
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Review the accepted quote agreement and schedule the service arrival time.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <BookingSummary quote={quote} workRequest={workRequest} />
          </div>

          <div className="lg:col-span-2">
            <BookingSchedule
              quote={quote}
              onSubmit={handleCreateBooking}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateBooking;
