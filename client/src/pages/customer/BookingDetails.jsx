import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiMapPin,
  HiExclamationCircle,
  HiCreditCard,
  HiDocumentText,
} from "react-icons/hi2";

import { getBookingById } from "../../services/booking.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import BookingSummary from "../../components/customer/booking/BookingSummary";
import BookingTimeline from "../../components/customer/booking/BookingTimeline";
import LocationMap from "../../components/map/LocationMap";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await getBookingById(id);
        const data = response?.data?.data || response?.data || null;

        if (isMounted && data) {
          setBooking(data);
        }
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        if (isMounted) {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load booking details."
          );
          navigate("/customer/bookings");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchBooking();
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading booking details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />

        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 sm:p-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
              <HiExclamationCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Booking Not Found
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              The booking you are trying to view does not exist or you do not have permission to view it.
            </p>

            <button
              onClick={() => navigate("/customer/bookings")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to My Bookings</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const coordinates = booking.workLocation?.coordinates;
  const hasLocation =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number";

  const longitude = hasLocation ? coordinates[0] : null;
  const latitude = hasLocation ? coordinates[1] : null;

  const paymentPending =
    booking.status === "payment_pending" ||
    (booking.paymentStatus === "pending" && Boolean(booking.workCompletedAt));

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/customer/bookings")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </button>

        {/* Header Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
                  Booking Overview
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  #{booking.bookingId || booking._id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 tracking-tight">
                {booking.workRequest?.title || "Service Booking"}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {booking.workRequest?.category ? (
                  <span className="capitalize">{booking.workRequest.category} • </span>
                ) : null}
                Managed through ServiGo Service Guarantee
              </p>
            </div>

            {paymentPending && (
              <button
                id="btn-pay-now-header"
                type="button"
                onClick={() => navigate(`/customer/payment/${booking._id}`)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm transition shadow-md shadow-teal-900/10 cursor-pointer"
              >
                <HiCreditCard className="w-5 h-5" />
                <span>Pay Now</span>
              </button>
            )}
          </div>
        </section>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary */}
          <div>
            <BookingSummary booking={booking} />
          </div>

          {/* Right Column: Timeline, Location, Description, Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Progress Timeline */}
            <BookingTimeline booking={booking} />

            {/* Service Location */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0">
                  <HiMapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Service Location
                  </h2>
                  <p className="text-xs text-gray-500">
                    Destination address for professional visit
                  </p>
                </div>
              </div>

              {hasLocation ? (
                <LocationMap latitude={latitude} longitude={longitude} />
              ) : (
                <div className="h-[200px] bg-gray-50 border border-gray-200/60 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                  Map coordinates unavailable
                </div>
              )}

              <div className="mt-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100 text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">
                  {booking.workLocation?.address || "Address details available"}
                </p>
                {(booking.workLocation?.city || booking.workLocation?.state) && (
                  <p className="text-gray-500 text-xs">
                    {booking.workLocation.city}
                    {booking.workLocation.state ? `, ${booking.workLocation.state}` : ""}
                    {booking.workLocation.pincode ? ` - ${booking.workLocation.pincode}` : ""}
                  </p>
                )}
              </div>
            </section>

            {/* Service Details / Notes */}
            {booking.workRequest?.description && (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0">
                    <HiDocumentText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Service Description
                    </h2>
                    <p className="text-xs text-gray-500">
                      Customer specifications for this task
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {booking.workRequest.description}
                </p>
              </section>
            )}

            {/* Payment Overview Card */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0">
                  <HiCreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Payment Status
                  </h2>
                  <p className="text-xs text-gray-500">
                    Payment settlement for this service
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">
                    Current Status
                  </span>
                  <p className="text-base font-bold text-gray-900 capitalize mt-0.5">
                    {booking.paymentStatus || "pending"}
                  </p>
                </div>

                {paymentPending && (
                  <button
                    id="btn-pay-now-card"
                    type="button"
                    onClick={() => navigate(`/customer/payment/${booking._id}`)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
                  >
                    <span>Make Payment</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetails;
