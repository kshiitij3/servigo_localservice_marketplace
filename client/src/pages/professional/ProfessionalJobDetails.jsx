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
} from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import { getMyQuotes } from "../../services/quote.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import JobSummary from "../../components/professional/jobs/JobSummary";
import JobMedia from "../../components/professional/jobs/JobMedia";
import LocationMap from "../../components/map/LocationMap";

const ProfessionalJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [existingQuote, setExistingQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const [jobRes, quotesRes] = await Promise.allSettled([
          getWorkRequestById(id),
          getMyQuotes(),
        ]);

        if (jobRes.status === "fulfilled") {
          const data = jobRes.value?.data?.data || jobRes.value?.data || null;
          if (isMounted) setJob(data);
        } else {
          throw jobRes.reason;
        }

        if (quotesRes.status === "fulfilled") {
          const raw =
            quotesRes.value?.data?.data ||
            quotesRes.value?.data?.quotes ||
            quotesRes.value?.data ||
            [];
          const list = Array.isArray(raw) ? raw : [];
          const myQ = list.find(
            (q) =>
              (q.workRequest?._id || q.workRequest)?.toString() ===
              id.toString()
          );
          if (isMounted && myQ) {
            setExistingQuote(myQ);
          }
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

  const isAcceptingQuotes =
    ["OPEN", "QUOTED"].includes(job.status) &&
    job.status !== "BOOKED" &&
    job.status !== "IN_PROGRESS" &&
    job.status !== "COMPLETED" &&
    !job.status?.startsWith("CANCELLED");

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
                    isAcceptingQuotes
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.status === "QUOTED"
                    ? `Accepting Proposals (${job.quoteCount || 1} received)`
                    : job.status === "OPEN"
                    ? "Accepting Proposals"
                    : job.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {job.title}
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Posted on{" "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently"}
              </p>
            </div>

            {existingQuote ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/professional/quotes/${existingQuote._id}`)
                }
                className="self-start lg:self-center inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-50 border border-teal-200 text-[#1a7a6e] hover:bg-teal-100 font-bold text-sm shadow-xs transition cursor-pointer shrink-0"
              >
                <HiChatBubbleBottomCenterText className="w-4 h-4" />
                <span>
                  View Your Quote (₹
                  {Number(existingQuote.amount).toLocaleString("en-IN")})
                </span>
              </button>
            ) : isAcceptingQuotes ? (
              <button
                type="button"
                onClick={() => navigate(`/professional/jobs/${job._id}/quote`)}
                className="self-start lg:self-center inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm shadow-md shadow-teal-900/10 active:scale-[0.98] transition cursor-pointer shrink-0"
              >
                <HiChatBubbleBottomCenterText className="w-4 h-4" />
                <span>Send Quote</span>
              </button>
            ) : null}
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <HiBriefcase className="w-5 h-5 text-[#1a7a6e]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Service Description
                </h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            {/* Media/Images */}
            {job.media && job.media.length > 0 && (
              <JobMedia media={job.media} />
            )}

            {/* Location & Map Section */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <HiMapPin className="w-5 h-5 text-[#1a7a6e]" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Service Location
                  </h2>
                </div>

                {job.location?.city && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#1a7a6e]">
                    {job.location.city}
                  </span>
                )}
              </div>

              {hasLocation ? (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <LocationMap
                    longitude={longitude}
                    latitude={latitude}
                    title={job.title}
                    address={
                      job.location.address ||
                      [job.location.city, job.location.state]
                        .filter(Boolean)
                        .join(", ")
                    }
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-500">
                  Map coordinates not provided for this job.
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">Exact Address:</p>
                <p className="mt-0.5">
                  {job.location?.address ||
                    [job.location?.city, job.location?.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "City not specified"}
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

              {existingQuote ? (
                <div className="mt-5 space-y-3">
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-800">
                    <p className="font-semibold text-[#1a7a6e]">
                      You have submitted a quote
                    </p>
                    <p className="mt-1">
                      Active offer:{" "}
                      <span className="font-bold">
                        ₹{Number(existingQuote.amount).toLocaleString("en-IN")}
                      </span>{" "}
                      ({existingQuote.status})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/professional/quotes/${existingQuote._id}`)
                    }
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#155f55] text-white py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <span>View / Revise Quote</span>
                  </button>
                </div>
              ) : isAcceptingQuotes ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/professional/jobs/${job._id}/quote`)
                  }
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
