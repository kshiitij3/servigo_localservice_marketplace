import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiStar,
  HiMapPin,
  HiCheck,
  HiExclamationCircle,
} from "react-icons/hi2";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import QuoteStatus from "../../components/customer/quote/QuoteStatus";
import QuoteSummary from "../../components/customer/quote/QuoteSummary";
import QuoteRevision from "../../components/customer/quote/QuoteRevision";
import { acceptQuote } from "../../services/quote.service";

const QuoteDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAccepting, setIsAccepting] = useState(false);

  const quote = location.state?.quote;
  const workRequest = location.state?.workRequest;

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
              Quote information not available
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              Please return to the quotes list and select the quote again to view its details.
            </p>

            <button
              onClick={() => navigate("/customer/work-requests")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#156359] transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Go to My Requests</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const professionalName =
    quote.professional?.name ||
    quote.professional?.fullName ||
    "Professional";

  const revisions = [...(quote.revisions || [])].reverse();

  const handleAcceptQuote = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to accept ${professionalName}'s quote for ₹${Number(
        quote.amount
      ).toLocaleString("en-IN")}? This will confirm your booking.`
    );

    if (!confirmed) return;

    try {
      setIsAccepting(true);
      await acceptQuote(quote._id);

      toast.success("Quote accepted successfully! Booking confirmed.");

      /*
       * After acceptance, redirect to customer bookings page.
       */
      navigate("/customer/bookings");
    } catch (error) {
      console.error("Failed to accept quote:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept quote."
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <button
          onClick={() =>
            navigate(`/customer/work-requests/${workRequest._id}/quotes`)
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Quotes</span>
        </button>

        {/* Header Hero */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quote from
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {professionalName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <QuoteStatus status={quote.status} />

                {quote.professional?.professionalProfile?.averageRating !==
                  undefined && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
                    <HiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>
                      {Number(
                        quote.professional.professionalProfile.averageRating
                      ).toFixed(1)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Current Quote
              </p>

              <p className="text-3xl font-black text-[#1a7a6e] mt-1">
                ₹{Number(quote.amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </section>

        {/* Work Request Overview */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900">
            Service Request
          </h2>

          <div className="mt-3">
            <h3 className="font-semibold text-gray-800 text-base">
              {workRequest.title}
            </h3>

            <p className="text-gray-600 mt-2 text-sm leading-6 whitespace-pre-wrap">
              {workRequest.description}
            </p>
          </div>

          {workRequest.location && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <HiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>
                {workRequest.location.city ||
                  workRequest.location.address ||
                  "Service location selected"}
              </span>
            </div>
          )}
        </section>

        {/* Quote Details & Summary */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Quote Details
          </h2>

          <QuoteSummary quote={quote} />

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Available Time
            </p>

            <p className="font-semibold text-gray-700 text-sm mt-1">
              {quote.availableTime || "Not specified"}
            </p>
          </div>

          {quote.message && (
            <div className="mt-6 bg-teal-50/30 border border-teal-100/70 rounded-xl p-5">
              <p className="text-xs font-bold text-[#1a7a6e] uppercase tracking-wider">
                Professional's Message
              </p>

              <p className="text-gray-700 mt-2 text-sm leading-6 whitespace-pre-wrap">
                {quote.message}
              </p>
            </div>
          )}
        </section>

        {/* Revisions History */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900">
            Quote History
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Previous versions of this quote.
          </p>

          {revisions.length === 0 ? (
            <div className="mt-5 bg-gray-50 rounded-xl p-4 text-sm text-gray-500 border border-gray-100">
              No revisions yet. This is the original quote.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {revisions.map((revision, index) => (
                <QuoteRevision
                  key={revision._id || revision.createdAt || index}
                  revision={revision}
                  number={revisions.length - index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900">
            Next Step
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review this offer and decide whether to accept it.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() =>
                navigate(`/customer/work-requests/${workRequest._id}/quotes`)
              }
              className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              Back to Quotes
            </button>

            {["submitted", "negotiating"].includes(quote.status) &&
              workRequest.status !== "BOOKED" && (
                <button
                  type="button"
                  onClick={handleAcceptQuote}
                  disabled={isAccepting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#156359] text-white font-bold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
                >
                  <HiCheck className="w-4 h-4" />
                  <span>{isAccepting ? "Accepting..." : "Accept Quote"}</span>
                </button>
              )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuoteDetails;
