import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiClipboardDocumentList,
  HiCheckCircle,
  HiArrowRight,
} from "react-icons/hi2";

import { createBooking } from "../../services/booking.service";
import { getQuoteById } from "../../services/quote.service";
import { getMyWorkRequests } from "../../services/workRequest.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import BookingSummary from "../../components/customer/booking/BookingSummary";
import BookingSchedule from "../../components/customer/booking/BookingSchedule";

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const urlQuoteId = searchParams.get("quoteId");

  const [quote, setQuote] = useState(location.state?.quote || null);
  const [workRequest, setWorkRequest] = useState(
    location.state?.workRequest || location.state?.quote?.workRequest || null
  );

  const [loadingQuote, setLoadingQuote] = useState(!quote);
  const [submitting, setSubmitting] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeQuotedRequests, setActiveQuotedRequests] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const resolveQuoteData = async () => {
      // 1. If we already have quote and workRequest in state, we're ready
      if (location.state?.quote && (location.state?.workRequest || location.state?.quote?.workRequest)) {
        if (isMounted) {
          setQuote(location.state.quote);
          setWorkRequest(location.state.workRequest || location.state.quote.workRequest);
          setLoadingQuote(false);
        }
        return;
      }

      // 2. If quoteId is in URL search params or location.state
      const quoteId = urlQuoteId || location.state?.quote?._id;
      if (quoteId) {
        try {
          if (isMounted) setLoadingQuote(true);
          const response = await getQuoteById(quoteId);
          const data = response?.data?.data || response?.data;

          if (isMounted && data?._id) {
            setQuote(data);
            setWorkRequest(data.workRequest || null);
            setLoadingQuote(false);
            return;
          }
        } catch (error) {
          console.error("Failed to load quote details:", error);
          if (isMounted) {
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                "Failed to load quote details for booking."
            );
          }
        }
      }

      // 3. Fallback: Search for customer's requests that have accepted quote awaiting booking
      try {
        if (isMounted) setLoadingQuote(true);
        const reqResponse = await getMyWorkRequests();
        const allRequests = reqResponse?.data?.data || reqResponse?.data || [];
        const reqList = Array.isArray(allRequests) ? allRequests : [];

        // Requests with an accepted quote ready to schedule
        const readyToBook = reqList.filter(
          (r) => r.status === "BOOKED" && r.selectedQuote
        );

        // Requests that have quotes but customer hasn't accepted yet
        const hasQuotes = reqList.filter(
          (r) => (r.status === "QUOTED" || (r.quoteCount && r.quoteCount > 0)) && r.status !== "BOOKED"
        );

        if (isMounted) {
          setPendingRequests(readyToBook);
          setActiveQuotedRequests(hasQuotes);

          // If there is exactly one request ready for booking scheduling, auto-fetch its quote
          if (readyToBook.length === 1 && readyToBook[0].selectedQuote) {
            const singleQuoteId =
              typeof readyToBook[0].selectedQuote === "object"
                ? readyToBook[0].selectedQuote._id
                : readyToBook[0].selectedQuote;

            try {
              const qRes = await getQuoteById(singleQuoteId);
              const qData = qRes?.data?.data || qRes?.data;
              if (qData?._id) {
                setQuote(qData);
                setWorkRequest(qData.workRequest || readyToBook[0]);
              }
            } catch (qErr) {
              console.error("Failed to auto-load pending quote:", qErr);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer requests:", err);
      } finally {
        if (isMounted) {
          setLoadingQuote(false);
        }
      }
    };

    resolveQuoteData();

    return () => {
      isMounted = false;
    };
  }, [urlQuoteId, location.state]);

  const handleCreateBooking = async (schedule) => {
    if (!quote?._id) {
      toast.error("Quote information is missing.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        quote: quote._id,
        scheduledDate: schedule.scheduledDate,
        scheduledTime: schedule.scheduledTime,
      };

      const response = await createBooking(payload);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Booking confirmed & scheduled successfully!"
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
      setSubmitting(false);
    }
  };

  if (loadingQuote) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <CustomerNavbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-9 h-9 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-700">
            Loading booking information...
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Retrieving accepted proposal details and professional schedule.
          </p>
        </main>
      </div>
    );
  }

  // If quote or workRequest not resolved yet, present actionable choices
  if (!quote || !workRequest) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            type="button"
            onClick={() => navigate("/customer/work-requests")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to My Requests</span>
          </button>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-10 shadow-xs text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4 border border-teal-100">
              <HiCalendarDays className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Schedule Your Booking
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
              To confirm a booking, please select a work request that has received proposals or accepted quotes.
            </p>
          </div>

          {/* Pending Schedule Confirmation */}
          {pendingRequests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-[#1a7a6e]" />
                <span>Accepted Quotes Awaiting Schedule Confirmation</span>
              </h2>

              <div className="space-y-3">
                {pendingRequests.map((req) => {
                  const targetQuoteId =
                    typeof req.selectedQuote === "object"
                      ? req.selectedQuote?._id
                      : req.selectedQuote;

                  return (
                    <div
                      key={req._id}
                      className="bg-white border border-gray-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs hover:border-[#1a7a6e]/40 transition"
                    >
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {req.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Category:{" "}
                          <span className="font-semibold text-gray-700">
                            {req.category?.name || "Service"}
                          </span>{" "}
                          • Budget: ₹{req.budget?.min || 0} - ₹{req.budget?.max || 0}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/customer/bookings/create?quoteId=${targetQuoteId}`)
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white text-sm font-bold shadow-xs transition cursor-pointer"
                      >
                        <HiClock className="w-4 h-4" />
                        <span>Confirm Schedule</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Active Requests with Quotes */}
          {activeQuotedRequests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HiClipboardDocumentList className="w-5 h-5 text-blue-600" />
                <span>Service Requests with Quotes to Review</span>
              </h2>

              <div className="space-y-3">
                {activeQuotedRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {req.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Received {req.quoteCount || 1} quotes from professionals
                      </p>
                    </div>

                    <Link
                      to={`/customer/work-requests/${req._id}/quotes`}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#1a7a6e] hover:bg-teal-100 text-sm font-bold shadow-xs transition"
                    >
                      <span>Review & Accept Quote</span>
                      <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Fallback Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/customer/work-requests")}
              className="px-6 py-2.5 rounded-xl bg-[#1a7a6e] text-white text-sm font-bold hover:bg-[#155f55] transition shadow-xs cursor-pointer"
            >
              Go to My Requests
            </button>
            <button
              type="button"
              onClick={() => navigate("/customer/work-requests/new")}
              className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Create New Request
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Full Booking Confirmation Form
  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          type="button"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div>
            <BookingSummary quote={quote} workRequest={workRequest} />
          </div>

          <div className="lg:col-span-2">
            <BookingSchedule
              quote={quote}
              onSubmit={handleCreateBooking}
              loading={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateBooking;
