import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiCalendarDays,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiSquares2X2,
  HiArrowPath,
  HiPlus,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import { getMyBookings } from "../../services/booking.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import BookingCard from "../../components/customer/booking/BookingCard";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await getMyBookings();
      const list = response?.data?.data || response?.data || [];

      setBookings(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to fetch customer bookings:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load your bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filters = [
    {
      label: "All",
      value: "ALL",
      icon: HiSquares2X2,
    },
    {
      label: "Upcoming",
      value: "UPCOMING",
      icon: HiCalendarDays,
    },
    {
      label: "In Progress",
      value: "IN_PROGRESS",
      icon: HiClock,
    },
    {
      label: "Completed",
      value: "COMPLETED",
      icon: HiCheckCircle,
    },
    {
      label: "Cancelled",
      value: "CANCELLED",
      icon: HiXCircle,
    },
  ];

  const isUpcoming = (booking) =>
    ["confirmed", "scheduled"].includes(booking?.status);

  const isInProgress = (booking) =>
    [
      "on_the_way",
      "arrived",
      "work_started",
      "work_completed",
      "payment_pending",
    ].includes(booking?.status);

  const isCompleted = (booking) =>
    ["paid", "closed"].includes(booking?.status);

  const isCancelled = (booking) =>
    booking?.status === "cancelled";

  const filteredBookings = useMemo(() => {
    switch (activeFilter) {
      case "UPCOMING":
        return bookings.filter(isUpcoming);

      case "IN_PROGRESS":
        return bookings.filter(isInProgress);

      case "COMPLETED":
        return bookings.filter(isCompleted);

      case "CANCELLED":
        return bookings.filter(isCancelled);

      default:
        return bookings;
    }
  }, [bookings, activeFilter]);

  const getCount = (filter) => {
    switch (filter) {
      case "UPCOMING":
        return bookings.filter(isUpcoming).length;

      case "IN_PROGRESS":
        return bookings.filter(isInProgress).length;

      case "COMPLETED":
        return bookings.filter(isCompleted).length;

      case "CANCELLED":
        return bookings.filter(isCancelled).length;

      default:
        return bookings.length;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
                Customer Bookings
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">
                My Bookings
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Track your active appointments, ongoing services, and completed jobs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-refresh-customer-bookings"
                type="button"
                onClick={fetchBookings}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <HiArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                id="btn-new-request"
                type="button"
                onClick={() => navigate("/customer/work-requests/new")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                <HiPlus className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter Navigation */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-2 mb-6 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.value;
              const count = getCount(filter.value);

              return (
                <button
                  key={filter.value}
                  id={`tab-customer-filter-${filter.value.toLowerCase()}`}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1a7a6e] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{filter.label}</span>
                  <span
                    className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading your bookings...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4 border border-teal-200/60">
              <HiCalendarDays className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No bookings found
            </h2>

            <p className="text-gray-500 text-sm mt-1.5 max-w-md mx-auto">
              {activeFilter === "ALL"
                ? "Your confirmed appointments will appear here once you accept a quote and confirm the schedule."
                : `There are currently no bookings in the "${activeFilter.toLowerCase().replaceAll("_", " ")}" category.`}
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/customer/work-requests")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
              >
                <span>View Service Requests</span>
              </button>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
