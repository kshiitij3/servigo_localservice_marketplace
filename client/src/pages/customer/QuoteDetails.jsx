import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiStar,
  HiMapPin,
  HiCheck,
  HiExclamationCircle,
  HiChatBubbleLeftEllipsis,
} from "react-icons/hi2";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import QuoteStatus from "../../components/customer/quote/QuoteStatus";
import QuoteSummary from "../../components/customer/quote/QuoteSummary";
import QuoteRevision from "../../components/customer/quote/QuoteRevision";
import { acceptQuote, getQuoteById } from "../../services/quote.service";
import { createChat } from "../../services/chat.service";

const QuoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quote, setQuote] = useState(location.state?.quote || null);
  const [workRequest, setWorkRequest] = useState(
    location.state?.workRequest || location.state?.quote?.workRequest || null
  );
  const [loading, setLoading] = useState(!quote);
  const [isAccepting, setIsAccepting] = useState(false);

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

  const handleStartChat = async () => {
    if (!quote?._id) return;
    try {
      const response = await createChat(quote._id);
      const chatData = response?.data?.data || response?.data;
      if (chatData?._id) {
        navigate(`/chat/${chatData._id}`);
      } else {
        navigate("/chat");
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to start chat"
      );
    }
  };

  const handleAcceptQuote = async () => {
    if (!quote) return;
    const professionalName =
      quote.professional?.name ||
      quote.professional?.fullName ||
      "Professional";

    const confirmed = window.confirm(
      `Are you sure you want to accept ${professionalName}'s quote for ₹${Number(
        quote.amount
      ).toLocaleString("en-IN")}? This will confirm your booking.`
    );

    if (!confirmed) return;

    try {
      setIsAccepting(true);
      await acceptQuote(quote._id);

      toast.success("Quote accepted! Proceeding to schedule your booking...");

      navigate("/customer/bookings/create", {
        state: {
          quote: {
            ...quote,
            status: "accepted",
          },
          workRequest,
        },
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <CustomerNavbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading quote details...</p>
        </main>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() =>
              navigate(`/customer/work-requests/${workRequest._id}/quotes`)
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] transition cursor-pointer group"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Quotes</span>
          </button>

          <button
            onClick={handleStartChat}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-200 bg-teal-50 text-[#1a7a6e] hover:bg-teal-100 font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <HiChatBubbleLeftEllipsis className="w-4 h-4" />
            <span>Chat & Negotiate</span>
          </button>
        </div>

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
                  "Location provided"}
              </span>
            </div>
          )}
        </section>

        {/* Quote Details Summary */}
        <QuoteSummary quote={quote} />

        {/* Negotiation & Revisions History */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 mt-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900">
            Negotiation History
          </h2>

          {revisions.length === 0 ? (
            <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-100">
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
            Review this offer, discuss via chat, and decide whether to accept it.
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

            <button
              type="button"
              onClick={handleStartChat}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-[#1a7a6e] font-semibold text-sm transition cursor-pointer shadow-xs"
            >
              <HiChatBubbleLeftEllipsis className="w-4 h-4" />
              <span>Chat & Negotiate</span>
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
                  <span>{isAccepting ? "Accepting..." : "Accept Quote & Book"}</span>
                </button>
              )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuoteDetails;
