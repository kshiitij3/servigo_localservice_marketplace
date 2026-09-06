import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiChatBubbleBottomCenterText,
  HiMapPin,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiArrowPath,
} from "react-icons/hi2";

import { getMyQuotes } from "../../services/quote.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import QuoteCard from "../../components/professional/quote/QuoteCard";

const MyQuotes = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const response = await getMyQuotes();
      const raw =
        response?.data?.data ||
        response?.data?.quotes ||
        response?.data ||
        [];

      setQuotes(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error("Failed to load quotes:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load your quotes."
      );
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const countByStatus = (status) => {
    if (status === "ALL") {
      return quotes.length;
    }
    return quotes.filter((quote) => quote.status === status).length;
  };

  const filteredQuotes = useMemo(() => {
    if (activeFilter === "ALL") {
      return quotes;
    }
    return quotes.filter((quote) => quote.status === activeFilter);
  }, [quotes, activeFilter]);

  const filters = [
    { label: "All Quotes", value: "ALL" },
    { label: "Submitted", value: "submitted" },
    { label: "Negotiating", value: "negotiating" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Withdrawn", value: "withdrawn" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Proposals & Bids
              </p>

              <h1 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
                My Quotes
              </h1>

              <p className="text-gray-500 text-sm mt-1.5">
                Track all proposals you have submitted and manage active negotiations.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fetchQuotes}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer shadow-xs"
              >
                <HiArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/professional/jobs")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-md shadow-teal-900/10 transition cursor-pointer"
              >
                <HiMapPin className="w-4 h-4" />
                <span>Find Jobs</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Metric Stat Cards */}
        {!loading && (
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Total Submitted
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {countByStatus("ALL")}
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                Submitted
              </span>
              <p className="text-2xl font-black text-blue-700 mt-1">
                {countByStatus("submitted")}
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                Negotiating
              </span>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {countByStatus("negotiating")}
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                Accepted
              </span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {countByStatus("accepted")}
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                Rejected
              </span>
              <p className="text-2xl font-black text-rose-700 mt-1">
                {countByStatus("rejected")}
              </p>
            </div>
          </section>
        )}

        {/* Status Filters Bar */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-2 mb-6 shadow-xs overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {filters.map((filter) => {
              const count = countByStatus(filter.value);
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1a7a6e] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#1a7a6e] hover:bg-gray-100/80"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading your submitted quotes...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredQuotes.length === 0 && (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4">
              <HiChatBubbleBottomCenterText className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              {activeFilter === "ALL"
                ? "No quotes submitted yet"
                : `No quotes with status "${activeFilter}"`}
            </h2>

            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
              {activeFilter === "ALL"
                ? "Browse nearby work requests and submit your competitive offer to customers."
                : "Try selecting a different filter category above to view your other proposals."}
            </p>

            <div className="mt-5">
              {activeFilter === "ALL" ? (
                <button
                  type="button"
                  onClick={() => navigate("/professional/jobs")}
                  className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-md shadow-teal-900/10 transition cursor-pointer"
                >
                  Find Nearby Jobs
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  View All Quotes
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quotes List */}
        {!loading && filteredQuotes.length > 0 && (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyQuotes;
