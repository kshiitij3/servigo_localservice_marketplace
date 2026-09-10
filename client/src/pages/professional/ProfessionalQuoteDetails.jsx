import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiBriefcase,
  HiMapPin,
  HiBanknotes,
  HiClock,
  HiCalendarDays,
  HiPencilSquare,
  HiCheckCircle,
  HiExclamationCircle,
  HiChatBubbleBottomCenterText,
  HiUser,
  HiArrowPath,
} from "react-icons/hi2";

import { getQuoteById } from "../../services/quote.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import QuoteStatus from "../../components/professional/quote/QuoteStatus";
import QuoteRevision from "../../components/professional/quote/QuoteRevision";

const ProfessionalQuoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quote, setQuote] = useState(location.state?.quote || null);
  const [workRequest, setWorkRequest] = useState(
    location.state?.workRequest || location.state?.quote?.workRequest || null
  );
  const [loading, setLoading] = useState(!location.state?.quote);

  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      try {
        setLoading(true);
        const response = await getQuoteById(id);
        const data = response?.data?.data || response?.data;
        if (isMounted && data) {
          setQuote(data);
          if (data.workRequest) {
            setWorkRequest(data.workRequest);
          }
        }
      } catch (error) {
        console.error("Failed to load quote details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load quote details."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!quote && id) {
      fetchQuote();
    }

    return () => {
      isMounted = false;
    };
  }, [id, quote]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <main className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading quote details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <HiExclamationCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Quote information not found
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              We couldn't retrieve the details for this quote. Please return to your quotes list.
            </p>

            <button
              onClick={() => navigate("/professional/quotes")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to My Quotes</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isAccepted = quote.status === "accepted";
  const isEditable = ["submitted", "negotiating"].includes(quote.status);
  const revisions = quote.revisions ? [...quote.revisions].reverse() : [];

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const duration = quote.estimatedDuration?.value
    ? `${quote.estimatedDuration.value} ${quote.estimatedDuration.unit}`
    : "Not specified";

  const customerName =
    quote.customer?.name ||
    workRequest?.customer?.name ||
    "Customer";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate("/professional/quotes")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] transition cursor-pointer"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to My Quotes</span>
          </button>

          {isEditable && (
            <button
              onClick={() =>
                navigate(`/professional/quotes/${quote._id}/edit`, {
                  state: {
                    quote,
                    workRequest,
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-xs active:scale-[0.98] transition cursor-pointer"
            >
              <HiPencilSquare className="w-4 h-4" />
              <span>Edit / Revise Quote</span>
            </button>
          )}
        </div>

        {/* Header Hero Banner */}
        <section
          className={`bg-white border rounded-2xl p-6 sm:p-8 shadow-xs ${
            isAccepted
              ? "border-emerald-300 ring-2 ring-emerald-500/15 bg-gradient-to-b from-emerald-50/25 to-white"
              : "border-gray-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Quote Details
                </span>
                {workRequest?.requestId && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    #{workRequest.requestId}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {workRequest?.title || "Service Quote"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <QuoteStatus status={quote.status} />

                {isAccepted && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                    <HiCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Customer Accepted & Confirmed Booking</span>
                  </span>
                )}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Current Quote Amount
              </span>
              <p className="text-3xl font-black text-[#1a7a6e] mt-1">
                ₹{Number(quote.amount).toLocaleString("en-IN")}
              </p>
              {quote.initialAmount && quote.initialAmount !== quote.amount && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Initial proposed: ₹
                  {Number(quote.initialAmount).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Quote Schedule & Terms Metrics */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Offer Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/70 border border-gray-100 rounded-xl p-4">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <HiBanknotes className="w-3.5 h-3.5 text-gray-400" />
                <span>Quote Amount</span>
              </span>
              <p className="text-lg font-extrabold text-[#1a7a6e] mt-1">
                ₹{Number(quote.amount).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5 text-gray-400" />
                <span>Est. Duration</span>
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1.5">
                {duration}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <HiCalendarDays className="w-3.5 h-3.5 text-gray-400" />
                <span>Proposed Date</span>
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1.5">
                {formatDate(quote.availableDate)}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5 text-gray-400" />
                <span>Arrival Time</span>
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1.5">
                {quote.availableTime || "Flexible"}
              </p>
            </div>
          </div>

          {/* Proposal Message */}
          {quote.message && (
            <div className="mt-5 bg-teal-50/30 border border-teal-100/70 rounded-xl p-4">
              <p className="text-xs font-bold text-[#1a7a6e] uppercase tracking-wider flex items-center gap-1.5">
                <HiChatBubbleBottomCenterText className="w-4 h-4" />
                <span>Your Proposal Note</span>
              </p>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                {quote.message}
              </p>
            </div>
          )}
        </section>

        {/* Service Request & Customer Overview */}
        {workRequest && (
          <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Service Request Details
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Request Title
                </span>
                <p className="font-semibold text-gray-800 text-base mt-0.5">
                  {workRequest.title}
                </p>
              </div>

              {workRequest.description && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Description
                  </span>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-wrap">
                    {workRequest.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HiUser className="w-3.5 h-3.5 text-gray-400" />
                    <span>Customer</span>
                  </span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {customerName}
                  </p>
                </div>

                {workRequest.location && (
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HiMapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>Service Location</span>
                    </span>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {workRequest.location.address || workRequest.location.city || "Location provided"}
                    </p>
                    {workRequest.location.city && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {workRequest.location.city}
                        {workRequest.location.state ? `, ${workRequest.location.state}` : ""}
                        {workRequest.location.pincode ? ` - ${workRequest.location.pincode}` : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {workRequest.budget?.min && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Customer's Estimated Budget
                  </span>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    ₹{Number(workRequest.budget.min).toLocaleString("en-IN")} - ₹{Number(workRequest.budget.max).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Revisions History */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <HiArrowPath className="w-4 h-4 text-[#1a7a6e]" />
            <h2 className="text-base font-bold text-gray-900">
              Negotiation & Revision History
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Record of previous versions and adjustments for this quote.
          </p>

          {revisions.length === 0 ? (
            <div className="bg-gray-50/80 rounded-xl p-4 text-xs text-gray-500 border border-gray-100">
              No revisions made yet. This is your initial proposal.
            </div>
          ) : (
            <div className="space-y-3">
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
      </main>
    </div>
  );
};

export default ProfessionalQuoteDetails;
