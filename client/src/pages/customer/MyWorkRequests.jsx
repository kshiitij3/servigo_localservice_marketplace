import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiPlus,
  HiMapPin,
  HiCalendar,
  HiCurrencyRupee,
  HiChatBubbleLeftEllipsis,
  HiTag,
  HiExclamationTriangle,
  HiMagnifyingGlass,
  HiEye,
  HiPaperClip
} from "react-icons/hi2";

import { getMyWorkRequests } from "../../services/workRequest.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

const statusStyles = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  QUOTED: "bg-blue-50 text-blue-700 border-blue-200/80",
  BOOKED: "bg-purple-50 text-purple-700 border-purple-200/80",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200/80",
  COMPLETED: "bg-gray-100 text-gray-700 border-gray-200/80",
  CANCELLED_BY_CUSTOMER: "bg-rose-50 text-rose-700 border-rose-200/80",
  CANCELLED_BY_PROFESSIONAL: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const filterOptions = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Quoted", value: "QUOTED" },
  { label: "Booked", value: "BOOKED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED_BY_CUSTOMER" },
];

const MyWorkRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getMyWorkRequests();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load your requests."
        );
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Filter by status
      let matchesFilter = true;
      if (activeFilter !== "ALL") {
        if (activeFilter === "CANCELLED_BY_CUSTOMER") {
          matchesFilter =
            request.status === "CANCELLED_BY_CUSTOMER" ||
            request.status === "CANCELLED_BY_PROFESSIONAL";
        } else {
          matchesFilter = request.status === activeFilter;
        }
      }

      // Filter by search query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = request.title?.toLowerCase().includes(query);
        const descMatch = request.description?.toLowerCase().includes(query);
        const catMatch = (
          request.category?.name || request.customCategory || ""
        )
          .toLowerCase()
          .includes(query);
        const cityMatch = request.location?.city?.toLowerCase().includes(query);
        matchesSearch = titleMatch || descMatch || catMatch || cityMatch;
      }

      return matchesFilter && matchesSearch;
    });
  }, [requests, activeFilter, searchQuery]);

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    if (status.startsWith("CANCELLED")) return "Cancelled";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return "Budget not specified";
    const { min, max } = budget;

    if (min && max) {
      return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
    }
    if (min) {
      return `From ₹${min.toLocaleString("en-IN")}`;
    }
    if (max) {
      return `Up to ₹${max.toLocaleString("en-IN")}`;
    }
    return "Budget not specified";
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Work Requests
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Track, manage, and monitor quotes for all the services you’ve requested.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/customer/work-requests/new")}
            className="inline-flex items-center justify-center gap-2 bg-[#1a7a6e] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#156359] active:scale-[0.99] transition shadow-md shadow-teal-900/10 cursor-pointer"
          >
            <HiPlus className="w-5 h-5 stroke-2" />
            <span>Post New Request</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Status Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none min-w-max">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${isActive
                      ? "bg-[#1a7a6e] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="w-1/3 h-6 bg-gray-200 rounded-md mb-3" />
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                </div>
                <div className="w-3/4 h-4 bg-gray-100 rounded-md mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 sm:p-14 text-center shadow-xs">
            <div className="w-16 h-16 bg-teal-50 text-[#1a7a6e] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              📋
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery
                ? "No matching requests found"
                : activeFilter === "ALL"
                  ? "No work requests yet"
                  : "No requests in this status"}
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery
                ? `No request matches "${searchQuery}". Try searching with different keywords.`
                : activeFilter === "ALL"
                  ? "Post your first service request to connect with vetted professionals near you."
                  : "Try selecting another status filter or create a new request."}
            </p>

            {activeFilter === "ALL" && !searchQuery && (
              <button
                type="button"
                onClick={() => navigate("/customer/work-requests/new")}
                className="mt-6 inline-flex items-center gap-2 bg-[#1a7a6e] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#156359] transition shadow-md shadow-teal-900/10 cursor-pointer"
              >
                <HiPlus className="w-5 h-5" />
                <span>Create Request</span>
              </button>
            )}
          </div>
        )}
        *
        {/* Request List */}
        {!loading && filteredRequests.length > 0 && (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const requestId = request._id || request.id;
              const statusClass =
                statusStyles[request.status] ||
                "bg-gray-100 text-gray-700 border-gray-200";

              const categoryName =
                request.category?.name ||
                request.customCategory ||
                "General Service";

              const locationText =
                request.location?.city ||
                request.location?.address ||
                "Location selected";

              const quoteCount = request.quoteCount || request.quotes?.length || 0;
              const hasMedia = request.media && request.media.length > 0;

              return (
                <div
                  key={requestId}
                  className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1 min-w-0">
                      {/* Title + Badges */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2
                          onClick={() =>
                            navigate(`/customer/work-requests/${requestId}`)
                          }
                          className="text-lg sm:text-xl font-bold text-gray-900 hover:text-[#1a7a6e] transition cursor-pointer"
                        >
                          {request.title}
                        </h2>

                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>

                        {request.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 animate-pulse">
                            <HiExclamationTriangle className="w-3.5 h-3.5" />
                            <span>URGENT</span>
                          </span>
                        )}

                        {hasMedia && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                            <HiPaperClip className="w-3.5 h-3.5" />
                            <span>{request.media.length} Attachment{request.media.length > 1 ? "s" : ""}</span>
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm sm:text-base mt-2.5 leading-relaxed line-clamp-2">
                        {request.description}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <HiTag className="w-3.5 h-3.5 text-[#1a7a6e]" /> Category
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                            {categoryName}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <HiCurrencyRupee className="w-3.5 h-3.5 text-[#1a7a6e]" /> Budget
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                            {formatBudget(request.budget)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <HiCalendar className="w-3.5 h-3.5 text-[#1a7a6e]" /> Preferred Date
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                            {formatDate(request.preferredDate)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <HiChatBubbleLeftEllipsis className="w-3.5 h-3.5 text-[#1a7a6e]" /> Quotes
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-[#1a7a6e] font-bold text-xs">
                              {quoteCount}
                            </span>
                            <span>{quoteCount === 1 ? "Quote" : "Quotes"}</span>
                          </p>
                        </div>
                      </div>

                      {/* Location & Visibility */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <HiMapPin className="w-4 h-4 text-[#1a7a6e]" />
                          {locationText}
                        </span>

                        {request.visibilityRadius && (
                          <span className="flex items-center gap-1.5 text-gray-500">
                            🎯 Visible within {request.visibilityRadius} km
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-row lg:flex-col gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/customer/work-requests/${requestId}`)
                        }
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a7a6e] text-white text-sm font-semibold hover:bg-[#156359] transition cursor-pointer"
                      >
                        <HiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>

                      {(request.status === "OPEN" || request.status === "QUOTED") && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/customer/work-requests/${requestId}/quotes`
                            )
                          }
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer"
                        >
                          <HiChatBubbleLeftEllipsis className="w-4 h-4 text-[#1a7a6e]" />
                          <span>View Quotes ({quoteCount})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyWorkRequests;
