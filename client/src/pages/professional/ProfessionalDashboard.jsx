import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiMapPin, HiSparkles } from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import ProfessionalStats from "../../components/professional/dashboard/ProfessionalStats";
import QuickActionCard from "../../components/professional/dashboard/QuickActionCard";
import AvailabilityCard from "../../components/professional/dashboard/AvailabilityCard";
import { getMyQuotes } from "../../services/quote.service";
import { getNearbyWorkRequests } from "../../services/workRequest.service";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    nearbyJobs: 0,
    quotes: 0,
    activeBookings: 0,
    completedJobs: 0,
  });

  const [nearbyPreview, setNearbyPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        const [quotesRes, nearbyRes] = await Promise.allSettled([
          getMyQuotes(),
          getNearbyWorkRequests(),
        ]);

        let quotesCount = 0;
        if (quotesRes.status === "fulfilled") {
          const raw = quotesRes.value?.data;
          const list = Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.quotes)
            ? raw.quotes
            : [];
          quotesCount = list.length;
        }

        let nearbyJobsCount = 0;
        let nearbyList = [];
        if (nearbyRes.status === "fulfilled") {
          const raw = nearbyRes.value?.data;
          nearbyList = Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.requests)
            ? raw.requests
            : [];
          nearbyJobsCount = nearbyList.length;
        }

        if (mounted) {
          setStats((prev) => ({
            ...prev,
            quotes: quotesCount,
            nearbyJobs: nearbyJobsCount,
          }));
          setNearbyPreview(nearbyList.slice(0, 3));
        }
      } catch (err) {
        console.warn("Failed to load initial professional stats:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const availabilityStatus =
    user?.professionalProfile?.availabilityStatus || "available";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Greeting */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Professional Dashboard
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1 tracking-tight">
                Welcome, {user?.name || "Professional"} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">
                Manage your services, quotes and bookings from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/professional/jobs")}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition cursor-pointer"
            >
              <HiMapPin className="w-4 h-4" />
              <span>Find Nearby Jobs</span>
            </button>
          </div>
        </section>

        {/* Key Metrics Stats */}
        <section className="mb-8">
          <ProfessionalStats
            nearbyJobs={stats.nearbyJobs}
            quotes={stats.quotes}
            activeBookings={stats.activeBookings}
            completedJobs={stats.completedJobs}
          />
        </section>

        {/* Availability Card */}
        <section className="mb-8">
          <AvailabilityCard
            status={availabilityStatus}
            onChange={() => navigate("/professional/availability")}
          />
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon="📍"
              title="Find Nearby Jobs"
              description="Discover service requests within your service area."
              onClick={() => navigate("/professional/jobs")}
            />

            <QuickActionCard
              icon="💬"
              title="My Quotes"
              description="View and manage the quotes you have submitted."
              onClick={() => navigate("/professional/quotes")}
            />

            <QuickActionCard
              icon="📅"
              title="My Bookings"
              description="Manage active appointments and customer jobs."
              onClick={() => navigate("/professional/bookings")}
            />

            <QuickActionCard
              icon="🌐"
              title="Service Area"
              description="Adjust your travel radius and match distance."
              onClick={() => navigate("/professional/service-area")}
            />
          </div>
        </section>

        {/* Nearby Opportunities Preview */}
        {nearbyPreview.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Nearby Opportunities</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1a7a6e] font-semibold">
                  Live
                </span>
              </h2>

              <button
                type="button"
                onClick={() => navigate("/professional/jobs")}
                className="text-xs font-semibold text-[#1a7a6e] hover:underline"
              >
                View all ({stats.nearbyJobs})
              </button>
            </div>

            <div className="space-y-3">
              {nearbyPreview.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1a7a6e]/40 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base truncate">
                        {job.title}
                      </h3>
                      {job.category?.name && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          {job.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {job.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {job.location?.city && (
                        <span className="flex items-center gap-1">
                          <HiMapPin className="w-3.5 h-3.5" />
                          <span>{job.location.city}</span>
                        </span>
                      )}
                      {job.budget?.max && (
                        <span className="font-semibold text-gray-700">
                          Budget: ₹{job.budget.min || 0} - ₹{job.budget.max}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/professional/jobs`)}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-xs transition cursor-pointer shadow-xs"
                  >
                    View Job
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location & Jobs CTA Banner */}
        <section className="bg-gradient-to-r from-[#1a7a6e] via-[#176a60] to-[#12534a] rounded-3xl p-7 sm:p-9 text-white shadow-xl shadow-teal-950/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-sm mb-3">
                <HiSparkles className="w-3.5 h-3.5 text-teal-200" />
                <span>Nearby Leads Ready</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Find high-paying jobs near you
              </h2>
              <p className="text-teal-100 text-sm mt-2 leading-relaxed">
                Connect with local customers seeking immediate repairs, installations, and maintenance services in your city.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/professional/jobs")}
              className="self-start lg:self-center inline-flex items-center gap-2 bg-white text-[#1a7a6e] hover:bg-teal-50 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Nearby Jobs</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
