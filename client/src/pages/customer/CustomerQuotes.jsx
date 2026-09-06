import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiArrowPath,
  HiExclamationTriangle,
  HiCheckCircle,
} from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import { getQuotesForWorkRequest, acceptQuote } from "../../services/quote.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  QuotesHeader,
  QuotesFilterBar,
  QuoteCard,
  QuoteDetailsModal,
  QuotesEmptyState,
  QuotesSkeleton,
} from "../../components/customer/quote";

const CustomerQuotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [acceptingQuoteId, setAcceptingQuoteId] = useState(null);
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState(null);
  const [sortBy, setSortBy] = useState("amount_asc");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const [requestResponse, quotesResponse] = await Promise.all([
        getWorkRequestById(id),
        getQuotesForWorkRequest(id),
      ]);

      // Unpack work request
      const rawReq = requestResponse?.data;
      const reqData = rawReq?.data?._id
        ? rawReq.data
        : rawReq?._id
        ? rawReq
        : rawReq?.data || null;

      // Unpack quotes array
      const rawQuotes = quotesResponse?.data;
      const quotesData = Array.isArray(rawQuotes?.data)
        ? rawQuotes.data
        : Array.isArray(rawQuotes)
        ? rawQuotes
        : Array.isArray(rawQuotes?.quotes)
        ? rawQuotes.quotes
        : [];

      setRequest(reqData);
      setQuotes(quotesData);
    } catch (error) {
      console.error("Failed to load quotes:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load quotes.";
      setFetchError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAcceptQuote = async (quoteId) => {
    const targetQuote = quotes.find((q) => q._id === quoteId);
    const profName =
      targetQuote?.professional?.name ||
      targetQuote?.professional?.fullName ||
      "this professional";

    const confirmed = window.confirm(
      `Are you sure you want to accept ${profName}'s quote for ₹${Number(
        targetQuote?.amount || 0
      ).toLocaleString("en-IN")}? This will book the professional and close other offers.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setAcceptingQuoteId(quoteId);

      const response = await acceptQuote(quoteId);

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Quote accepted successfully! Your booking is confirmed."
      );

      // Update state locally
      setQuotes((prev) =>
        prev.map((quote) => {
          if (quote._id === quoteId) {
            return {
              ...quote,
              status: "accepted",
            };
          }

          if (["submitted", "negotiating"].includes(quote.status)) {
            return {
              ...quote,
              status: "rejected",
            };
          }

          return quote;
        })
      );

      setRequest((prev) =>
        prev
          ? {
              ...prev,
              status: "BOOKED",
              selectedQuote: quoteId,
              selectedProfessional: targetQuote?.professional?._id,
            }
          : prev
      );

      if (selectedQuoteForModal?._id === quoteId) {
        setSelectedQuoteForModal(null);
      }
    } catch (error) {
      console.error("Failed to accept quote:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept quote."
      );
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  const getDurationHoursApprox = (quote) => {
    const val = quote?.estimatedDuration?.value || 999;
    const unit = quote?.estimatedDuration?.unit || "hours";
    if (unit === "minutes") return val / 60;
    if (unit === "days") return val * 24;
    return val;
  };

  // Filtered & Sorted Quotes
  const processedQuotes = useMemo(() => {
    let list = [...quotes];

    if (statusFilter !== "all") {
      list = list.filter((q) => q.status === statusFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "amount_asc") {
        return (a.amount || 0) - (b.amount || 0);
      }
      if (sortBy === "amount_desc") {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (sortBy === "rating_desc") {
        const ratingA =
          a.professional?.professionalProfile?.averageRating || 0;
        const ratingB =
          b.professional?.professionalProfile?.averageRating || 0;
        return ratingB - ratingA;
      }
      if (sortBy === "duration_asc") {
        return getDurationHoursApprox(a) - getDurationHoursApprox(b);
      }
      return 0;
    });

    return list;
  }, [quotes, statusFilter, sortBy]);

  const lowestQuote = useMemo(() => {
    if (!quotes.length) return null;
    return quotes.reduce(
      (min, q) => (!min || q.amount < min ? q.amount : min),
      null
    );
  }, [quotes]);

  const acceptedQuote = useMemo(() => {
    return quotes.find((q) => q.status === "accepted");
  }, [quotes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <QuotesSkeleton />
      </div>
    );
  }

  if (fetchError || !request) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <HiExclamationTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {fetchError ? "Unable to Load Quotes" : "Work Request Not Found"}
            </h1>

            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              {fetchError ||
                "The requested service request could not be located or may have been deleted."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/customer/work-requests")}
                className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#156359] transition shadow-xs cursor-pointer"
              >
                Back to My Requests
              </button>

              <button
                type="button"
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <HiArrowPath className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleViewQuote = (quote) => {
    navigate(`/customer/quotes/${quote._id}`, {
      state: {
        quote,
        workRequest: request,
      },
    });
  };

  const isJobBooked = request.status === "BOOKED";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(`/customer/work-requests/${id}`)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] transition cursor-pointer group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Request Details</span>
          </button>

          <Link
            to="/customer/work-requests"
            className="text-xs font-medium text-gray-500 hover:text-[#1a7a6e] transition"
          >
            All Work Requests
          </Link>
        </div>

        {/* Booked / Accepted Banner */}
        {isJobBooked && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-300/70 rounded-2xl p-5 flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <HiCheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-emerald-900 text-base">
                Professional Hired & Work Booked!
              </h2>
              <p className="text-sm text-emerald-700 mt-0.5">
                You have accepted a quote for this work request. The selected
                professional has been notified to proceed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/customer/work-requests/${id}`)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition shrink-0"
            >
              <span>View Details</span>
            </button>
          </div>
        )}

        {/* Header Hero Component */}
        <QuotesHeader
          request={request}
          quotesCount={quotes.length}
          lowestQuote={lowestQuote}
        />

        {/* Empty State Component */}
        {quotes.length === 0 ? (
          <QuotesEmptyState workRequestId={id} onRefresh={fetchData} />
        ) : (
          <div className="space-y-6">
            {/* Filter & Sort Bar Component */}
            <QuotesFilterBar
              totalQuotes={quotes.length}
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
              hasAcceptedQuote={Boolean(acceptedQuote)}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Empty Filter Result */}
            {processedQuotes.length === 0 && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-8 text-center text-gray-500 text-sm">
                No quotes match the selected filter.
              </div>
            )}

            {/* Quote Cards Component List */}
            <div className="space-y-4">
              {processedQuotes.map((quote) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  isJobBooked={isJobBooked}
                  acceptingQuoteId={acceptingQuoteId}
                  onAccept={handleAcceptQuote}
                  onViewDetails={handleViewQuote}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Quote Details Modal Component */}
      <QuoteDetailsModal
        quote={selectedQuoteForModal}
        requestTitle={request?.title}
        isJobBooked={isJobBooked}
        acceptingQuoteId={acceptingQuoteId}
        onClose={() => setSelectedQuoteForModal(null)}
        onAccept={handleAcceptQuote}
      />
    </div>
  );
};

export default CustomerQuotes;
