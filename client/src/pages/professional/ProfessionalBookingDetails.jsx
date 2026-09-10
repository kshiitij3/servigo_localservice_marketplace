import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiMapPin,
  HiExclamationCircle,
  HiClock,
  HiCheckBadge,
} from "react-icons/hi2";

import ProfessionalNavbar from "../../components/professional/navigation/ProfessionalNavbar";
import BookingSummary from "../../components/professional/booking/BookingSummary";
import BookingTimeline from "../../components/professional/booking/BookingTimeline";
import BookingStatusActions from "../../components/professional/booking/BookingStatusActions";
import LocationMap from "../../components/map/LocationMap";
import { getBookingById } from "../../services/booking.service";

const ProfessionalBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(
    location.state?.booking || null
  );
  const [loading, setLoading] = useState(!location.state?.booking);

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
        console.error("Failed to load booking details:", error);
        if (isMounted && !booking) {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load booking details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id && (!booking || !booking.workRequest?.title)) {
      fetchBooking();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading booking details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 sm:p-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
              <HiExclamationCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Booking information is unavailable
            </h1>

            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              Please open the booking again from your bookings list or dashboard to view live details.
            </p>

            <button
              id="btn-back-to-bookings-fallback"
              type="button"
              onClick={() => navigate("/professional/bookings")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#1a7a6e] hover:bg-[#155f55] text-white rounded-xl font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to Bookings</span>
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

  // GeoJSON is [longitude, latitude]
  const longitude = hasLocation ? coordinates[0] : null;
  const latitude = hasLocation ? coordinates[1] : null;

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          id="btn-back-to-bookings"
          type="button"
          onClick={() => navigate("/professional/bookings")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bookings</span>
        </button>

        {/* Header Banner */}
        <section
          id="booking-details-header"
          className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
                  Booking Reference
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {booking.bookingId || id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">
                {booking.bookingId || `Booking #${id?.slice(-6) || id}`}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Current Status:</span>
                <span className="font-bold text-gray-800 capitalize bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">
                  {booking.status?.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(booking.status === "work_completed" ||
                booking.status === "payment_pending") && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <HiClock className="w-4 h-4" />
                  <span>Payment Pending</span>
                </span>
              )}

              {booking.status === "paid" && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <HiCheckBadge className="w-4 h-4" />
                  <span>Paid & Verified</span>
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Summary & Actions */}
          <div className="space-y-6">
            <BookingSummary booking={booking} />

            <BookingStatusActions
              booking={booking}
              onStatusUpdated={setBooking}
            />
          </div>

          {/* Right Column: Timeline & Map */}
          <div className="lg:col-span-2 space-y-6">
            <BookingTimeline status={booking.status} />

            {/* Location Section */}
            <section
              id="booking-location-section"
              className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center font-bold">
                  <HiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Service Location
                  </h2>
                  <p className="text-xs text-gray-500">
                    Verified job execution site coordinates
                  </p>
                </div>
              </div>

              {hasLocation ? (
                <div className="mt-5 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                  <LocationMap
                    latitude={latitude}
                    longitude={longitude}
                  />
                </div>
              ) : (
                <div className="mt-5 h-[280px] bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2">
                  <HiMapPin className="w-8 h-8 text-gray-300" />
                  <span className="text-sm font-medium">
                    Map preview unavailable
                  </span>
                </div>
              )}

              <div className="mt-5 p-4 rounded-xl bg-gray-50/70 border border-gray-100 text-sm text-gray-700 space-y-1.5">
                <div className="flex items-start gap-2">
                  <HiMapPin className="w-4 h-4 text-[#1a7a6e] shrink-0 mt-0.5" />
                  <span className="font-semibold text-gray-900">
                    {booking.workLocation?.address || "Address unavailable"}
                  </span>
                </div>

                {(booking.workLocation?.city || booking.workLocation?.state) && (
                  <p className="pl-6 text-xs text-gray-500">
                    {booking.workLocation.city}
                    {booking.workLocation.city && booking.workLocation.state ? ", " : ""}
                    {booking.workLocation.state}
                  </p>
                )}

                {booking.workLocation?.pincode && (
                  <p className="pl-6 text-xs text-gray-500">
                    Pincode: {booking.workLocation.pincode}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalBookingDetails;
