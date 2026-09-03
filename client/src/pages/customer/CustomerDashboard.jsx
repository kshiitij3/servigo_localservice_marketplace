import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiPlusCircle,
  HiClipboardDocumentList,
  HiCalendarDays,
  HiClock,
  HiCheckBadge,
  HiSparkles,
  HiArrowRight,
  HiFolderOpen
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";
import { getMyWorkRequests } from "../../services/workRequest.service";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import StatCard from "../../components/customer/StatCard";
import QuickActionCard from "../../components/customer/QuickActionCard";
import RequestCard from "../../components/customer/RequestCard";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const response = await getMyWorkRequests();
        setRequests(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch work requests:", error);
        setRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const countByStatus = (status) =>
    requests.filter((request) => request.status === status).length;

  const createRequest = () => navigate("/customer/work-requests/new");

  return (
    <div className="min-h-screen bg-gray-50/60 pb-12">
      <CustomerNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <section className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1a7a6e]">
            Customer Portal
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.name || "Customer"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find trusted, background-checked professionals for your home & business services.
          </p>
        </section>

        {/* Hero CTA Box */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-teal-900 via-[#1a7a6e] to-[#2a9d8f] p-6 text-white sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-2">
                <HiSparkles className="w-3.5 h-3.5" /> Fast Booking
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Need a service right away?</h2>
              <p className="mt-1 text-teal-100/90 text-sm max-w-xl">
                Tell us what you need, set your budget, and receive quotes from nearby verified service experts.
              </p>
            </div>
            <button
              type="button"
              onClick={createRequest}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#1a7a6e] transition hover:bg-teal-50 shadow-md hover:shadow-lg active:scale-98 cursor-pointer shrink-0"
            >
              <HiPlusCircle className="w-5 h-5 text-[#1a7a6e]" />
              <span>Post a Service Request</span>
            </button>
          </div>
        </section>

        {/* Stat Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={requests.length}
            description="All created work requests"
            icon={HiClipboardDocumentList}
          />
          <StatCard
            title="Open Requests"
            value={countByStatus("OPEN")}
            description="Awaiting quotes"
            icon={HiClock}
          />
          <StatCard
            title="Booked Jobs"
            value={countByStatus("BOOKED")}
            description="Confirmed services"
            icon={HiCalendarDays}
          />
          <StatCard
            title="Completed Services"
            value={countByStatus("COMPLETED")}
            description="Finished requests"
            icon={HiCheckBadge}
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              icon={HiPlusCircle}
              title="Post a Service Request"
              description="Describe the job, pin your location, and set your budget."
              onClick={createRequest}
            />
            <QuickActionCard
              icon={HiClipboardDocumentList}
              title="My Requests"
              description="View, edit, and track status of all active work requests."
              onClick={() => navigate("/customer/work-requests")}
            />
            <QuickActionCard
              icon={HiCalendarDays}
              title="My Bookings"
              description="Check upcoming appointments and review past service bookings."
              onClick={() => navigate("/customer/bookings")}
            />
          </div>
        </section>

        {/* Recent Requests Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
            <button
              type="button"
              onClick={() => navigate("/customer/work-requests")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1a7a6e] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingRequests ? (
            <div className="rounded-2xl border border-gray-200/80 bg-white p-10 text-center text-gray-500 shadow-xs">
              <div className="w-6 h-6 border-2 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-sm font-medium">Loading your requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-gray-200/80 bg-white p-10 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-3 border border-teal-100">
                <HiFolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No service requests yet</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Post your first service request to start receiving quotes from verified local experts.
              </p>
              <button
                type="button"
                onClick={createRequest}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1a7a6e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145f56] transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <HiPlusCircle className="w-4 h-4" />
                <span>Create Request</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <RequestCard key={request._id} request={request} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default CustomerDashboard;
