import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiCheckCircle,
} from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import { getQuotesForWorkRequest, acceptQuote } from "../../services/quote.service";
import { createChat } from "../../services/chat.service";
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

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setFetchError(null);

      const [reqResponse, quotesResponse] = await Promise.all([
        getWorkRequestById(id),
        getQuotesForWorkRequest(id),
      ]);

      const reqData = reqResponse?.data?.data || reqResponse?.data;
      const quotesData =
        quotesResponse?.data?.data || quotesResponse?.data || [];

      setRequest(reqData);
      setQuotes(Array.isArray(quotesData) ? quotesData : []);
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
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setFetchError(null);

        const [reqResponse, quotesResponse] = await Promise.all([
          getWorkRequestById(id),
          getQuotesForWorkRequest(id),
        ]);

        if (!mounted) return;
        const reqData = reqResponse?.data?.data || reqResponse?.data;
        const quotesData =
          quotesResponse?.data?.data || quotesResponse?.data || [];

        setRequest(reqData);
        setQuotes(Array.isArray(quotesData) ? quotesData : []);
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to load quotes:", error);
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load quotes.";
        setFetchError(errMsg);
        toast.error(errMsg);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleStartChat = async (quote) => {
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
        err?.response?.data?.message || err?.message || "Failed to start conversation"
      );
    }
  };

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
          "Quote accepted! Proceeding to schedule your booking..."
      );

      const acceptedQuote =
        quotes.find((quote) => quote._id === quoteId) || targetQuote;

      navigate(`/customer/bookings/create?quoteId=${quoteId}`, {
        state: {
          quote: {
            ...acceptedQuote,
            status: "accepted",
          },
          workRequest: request,
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
      setAcceptingQuoteId(null);
    }
  };

  const getDurationHoursApprox = (quote) => {
    const val = quote?.estimatedDuration?.value || 999;
    const unit = quote?.estimatedDuration?.unit || "hours";
    if (unit === "days") return val * 24;
    if (unit === "minutes") return val / 60;
    return val;
  };

  const processedQuotes = useMemo(() => {
    let result = [...quotes];

    if (statusFilter !== "all") {
      result = result.filter((q) => q.status === statusFilter);
    }

    switch (sortBy) {
      case "amount_asc":
        result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      case "amount_desc":
        result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case "duration_asc":
        result.sort(
          (a, b) => getDurationHoursApprox(a) - getDurationHoursApprox(b)
        );
        break;
      case "rating_desc":
        result.sort((a, b) => {
          const rA =
            a.professional?.professionalProfile?.averageRating || 0;
          const rB =
            b.professional?.professionalProfile?.averageRating || 0;
          return rB - rA;
        });
        break;
      case "date_asc":
        result.sort((a, b) => {
          const dA = a.availableDate ? new Date(a.availableDate) : new Date(9999, 0, 1);
          const dB = b.availableDate ? new Date(b.availableDate) : new Date(9999, 0, 1);
          return dA - dB;
        });
        break;
      default:
        break;
    }

    return result;
  }, [quotes, statusFilter, sortBy]);

  const lowestQuote = useMemo(() => {
    if (!quotes.length) return null;
    return quotes.reduce(
      (min, q) => (q.amount < min.amount ? q : min),
      quotes[0]
    );
  }, [quotes]);

  const acceptedQuote = useMemo(() => {
    return quotes.find((q) => q.status === "accepted");
  }, [quotes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuotesSkeleton />
        </main>
      </div>
    );
  }

  if (fetchError || !request) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load Quotes
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {fetchError || "We could not find the requested service."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={fetchData}
                className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#156359] text-white font-semibold text-sm transition cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => navigate("/customer/work-requests")}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                Back to Requests
              </button>
            </div>
          </div>
        </main>
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
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition shrink-0 cursor-pointer"
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
                  onChat={handleStartChat}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Quote Details Modal Component */}
      <QuoteDetailsModal
        quote={selectedQuoteForModal}
        isOpen={Boolean(selectedQuoteForModal)}
        onClose={() => setSelectedQuoteForModal(null)}
        onAccept={handleAcceptQuote}
        onChat={handleStartChat}
        isJobBooked={isJobBooked}
        acceptingQuoteId={acceptingQuoteId}
      />
    </div>
  );
};

export default CustomerQuotes;
