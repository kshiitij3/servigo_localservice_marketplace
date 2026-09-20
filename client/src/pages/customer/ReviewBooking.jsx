import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";

import { getBookingReview } from "../../services/review.service";
import { getBookingById } from "../../services/booking.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import ReviewForm from "../../components/customer/review/ReviewForm";

const ReviewBooking = () => {
  /*
   * The route is /customer/bookings/:id/review
   * so we use `id` — matching the BookingDetails convention.
   */
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [bookingResponse, reviewResponse] = await Promise.allSettled([
          getBookingById(id),
          getBookingReview(id),
        ]);

        if (!isMounted) return;

        if (bookingResponse.status === "fulfilled") {
          const data =
            bookingResponse.value?.data?.data ||
            bookingResponse.value?.data ||
            null;
          setBooking(data);
        } else {
          setError(
            bookingResponse.reason?.response?.data?.message ||
              bookingResponse.reason?.message ||
              "Failed to load booking"
          );
        }

        if (reviewResponse.status === "fulfilled") {
          const rev =
            reviewResponse.value?.data?.data ||
            reviewResponse.value?.data ||
            null;
          setExistingReview(rev);
        }
        // If the review 404s (no review yet), that's expected — ignore it
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load booking");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSuccess = () => {
    navigate(`/customer/bookings/${id}`);
  };

  /* ── Loading ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading review page...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ── Error ────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <HiExclamationCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Unable to open review
            </h2>
            <p className="text-sm text-red-600 mt-2">{error}</p>
            <button
              type="button"
              onClick={() => navigate(`/customer/bookings/${id}`)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to Booking
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ── Already reviewed ─────────────────────────────── */
  if (existingReview) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4 border border-teal-100">
              <HiCheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-1">
              Review already submitted
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              You have already reviewed this booking.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/customer/bookings/${id}`)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to Booking
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ── Review form ──────────────────────────────────── */
  const professionalName =
    booking?.professional?.name || "the professional";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate(`/customer/bookings/${id}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Booking Details
        </button>

        {/* Page heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
              Review
            </span>
            <span className="text-xs text-gray-400 font-mono">
              #{booking?.bookingId || id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Rate your experience
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Share your feedback after the service.
          </p>
        </div>

        <ReviewForm
          bookingId={id}
          professionalName={professionalName}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
};

export default ReviewBooking;
