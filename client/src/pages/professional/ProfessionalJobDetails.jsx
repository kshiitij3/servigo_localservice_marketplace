import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiBolt,
  HiMapPin,
  HiChatBubbleBottomCenterText,
  HiSparkles,
  HiExclamationCircle,
  HiBriefcase,
  HiClock,
} from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import JobSummary from "../../components/professional/jobs/JobSummary";
import JobMedia from "../../components/professional/jobs/JobMedia";
import LocationMap from "../../components/map/LocationMap";

const ProfessionalJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await getWorkRequestById(id);
        const data = response?.data?.data || response?.data || null;

        if (isMounted) {
          setJob(data);
        }
      } catch (error) {
        console.error("Failed to load job details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load job details."
        );
        navigate("/professional/jobs");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading service request details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 shadow-xs">
            <HiExclamationCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900">Job Not Found</h2>
            <p className="text-sm text-gray-500 mt-2">
              This work request may have been removed or fulfilled.
            </p>
            <button
              type="button"
              onClick={() => navigate("/professional/jobs")}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#155f55] transition shadow-xs cursor-pointer"
            >
              Back to Nearby Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MongoDB coordinates: [longitude, latitude]
  const coordinates = job.location?.coordinates;
  const hasLocation =
    Array.isArray(coordinates) && coordinates.length === 2;

  const longitude = hasLocation ? coordinates[0] : null;
  const latitude = hasLocation ? coordinates[1] : null;

  const isAcceptingQuotes = job.status === "OPEN";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/professional/jobs")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Nearby Jobs</span>
        </button>

        {/* Top Header Card */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  ID: {job.requestId || job._id?.slice(-8)}
                </span>

                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-bold uppercase tracking-wider">
                    <HiBolt className="w-3.5 h-3.5 fill-rose-500" />
                    <span>Urgent Service</span>
                  </span>
                )}

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    job.status === "OPEN"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {job.title}
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Posted on{" "}
                {new Date(job.createdAt || Date.now()).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {isAcceptingQuotes && (
              <button
                type="button"
                onClick={() => navigate(`/professional/jobs/${job._id}/quote`)}
                className="self-start lg:self-center inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition cursor-pointer shrink-0"
              >
                <HiChatBubbleBottomCenterText className="w-4 h-4" />
                <span>Send Quote</span>
              </button>
            )}
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <HiBriefcase className="w-5 h-5 text-[#1a7a6e]" />
                <span>Service Description</span>
              </h2>

              <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {job.description}
              </p>
            </section>

            {/* Photos & Videos */}
            <JobMedia media={job.media} />

            {/* Location Map & Address Details */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <HiMapPin className="w-5 h-5 text-[#1a7a6e]" />
                    <span>Service Location</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Customer's designated work site
                  </p>
                </div>

                {job.visibilityRadius && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#1a7a6e] border border-teal-200/60">
                    {job.visibilityRadius} km visibility
                  </span>
                )}
              </div>

              {hasLocation && latitude && longitude ? (
                <div className="rounded-xl overflow-hidden border border-gray-200/80">
                  <LocationMap latitude={latitude} longitude={longitude} />
                </div>
              ) : (
                <div className="h-[240px] bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                  GPS location not pinned for this request
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50/70 border border-gray-100 rounded-xl space-y-1 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  📍 {job.location?.address || "Address available upon booking"}
                </p>
                <p className="text-xs text-gray-500">
                  {[job.location?.city, job.location?.state]
                    .filter(Boolean)
                    .join(", ") || "City not specified"}
                  {job.location?.pincode ? ` - ${job.location.pincode}` : ""}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <JobSummary job={job} />

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 border border-teal-200/70 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a7a6e] mb-1">
                <HiSparkles className="w-4 h-4" />
                <span>Ready to take this job?</span>
              </div>

              <h3 className="font-bold text-gray-900 text-base">
                Submit Your Proposal
              </h3>

              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Provide your estimated service fee, availability time window, and expected completion duration.
              </p>

              {isAcceptingQuotes ? (
                <button
                  type="button"
                  onClick={() => navigate(`/professional/jobs/${job._id}/quote`)}
                  className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#155f55] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition cursor-pointer"
                >
                  <HiChatBubbleBottomCenterText className="w-4 h-4" />
                  <span>Send Your Quote</span>
                </button>
              ) : (
                <div className="mt-4 p-3 bg-gray-100 rounded-xl text-center text-xs text-gray-500 font-medium">
                  This work request is no longer accepting new quotes.
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalJobDetails;
