import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiPaperAirplane,
  HiInformationCircle,
  HiExclamationCircle,
  HiChatBubbleBottomCenterText,
  HiUserGroup,
} from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import { createQuote, getMyQuotes } from "../../services/quote.service";

import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import JobSummary from "../../components/professional/jobs/JobSummary";
import QuoteForm from "../../components/professional/quote/QuoteForm";

const CreateQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [existingQuote, setExistingQuote] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadJobAndQuotes = async () => {
      try {
        setLoadingJob(true);
        const [jobRes, quotesRes] = await Promise.allSettled([
          getWorkRequestById(id),
          getMyQuotes(),
        ]);

        if (jobRes.status === "fulfilled") {
          const data = jobRes.value?.data?.data || jobRes.value?.data || null;
          if (isMounted) {
            setJob(data);
          }
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
        console.error("Failed to load job:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load job details."
        );
        navigate("/professional/jobs");
      } finally {
        if (isMounted) setLoadingJob(false);
      }
    };

    if (id) {
      loadJobAndQuotes();
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);

      const payload = {
        workRequest: id,
        initialAmount: Number(data.initialAmount),
        amount: Number(data.amount || data.initialAmount),
        message: data.message ? data.message.trim() : undefined,
        estimatedDuration: data.durationValue
          ? {
              value: Number(data.durationValue),
              unit: data.durationUnit,
            }
          : undefined,
        availableDate: data.availableDate || undefined,
        availableTime: data.availableTime || undefined,
      };

      await createQuote(payload);

      toast.success("Quote submitted successfully to the customer!");
      navigate("/professional/quotes");
    } catch (error) {
      console.error("Failed to create quote:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit quote."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <main className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              Loading service request details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const isAcceptingQuotes =
    ["OPEN", "QUOTED"].includes(job.status) &&
    job.status !== "BOOKED" &&
    job.status !== "IN_PROGRESS" &&
    job.status !== "COMPLETED" &&
    !job.status?.startsWith("CANCELLED");

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={() => navigate(`/professional/jobs/${id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Job Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Job Overview Column */}
          <div className="lg:col-span-1 space-y-4">
            <JobSummary job={job} />

            <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl text-xs text-teal-800 space-y-2">
              <p className="font-bold flex items-center gap-1 text-[#1a7a6e]">
                <HiUserGroup className="w-4 h-4" />
                <span>Competitive Quotations</span>
              </p>
              <p className="leading-relaxed">
                Multiple verified professionals can quote on this service request. Customers will review quotes, negotiate terms in chat, and accept their preferred professional.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-600 space-y-2">
              <p className="font-bold flex items-center gap-1 text-gray-800">
                <HiInformationCircle className="w-4 h-4 text-[#1a7a6e]" />
                <span>Tips for Winning Quotes</span>
              </p>
              <p className="leading-relaxed">
                Be explicit about what materials or replacement parts are included in your price. Fast response and clear availability help you win bookings.
              </p>
            </div>
          </div>

          {/* Quote Form Column */}
          <div className="lg:col-span-2">
            {existingQuote ? (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <HiChatBubbleBottomCenterText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Quote Already Submitted
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  You have already submitted a quote of{" "}
                  <span className="font-extrabold text-[#1a7a6e]">
                    ₹{Number(existingQuote.amount).toLocaleString("en-IN")}
                  </span>{" "}
                  for this service request.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/professional/quotes/${existingQuote._id}`)
                    }
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm shadow-md shadow-teal-900/10 transition cursor-pointer"
                  >
                    <HiChatBubbleBottomCenterText className="w-4 h-4" />
                    <span>View / Revise Your Quote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/professional/jobs")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span>Browse Other Jobs</span>
                  </button>
                </div>
              </section>
            ) : !isAcceptingQuotes ? (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
                <HiExclamationCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  No Longer Accepting Quotes
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  This work request has already been confirmed or closed (Status: {job.status}).
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/professional/jobs")}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm shadow-md transition cursor-pointer"
                >
                  <span>Back to Nearby Jobs</span>
                </button>
              </section>
            ) : (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                      <HiPaperAirplane className="w-6 h-6 text-[#1a7a6e]" />
                      <span>Send Your Quote</span>
                    </h1>

                    <p className="text-xs text-gray-500 mt-1">
                      Customer:{" "}
                      <span className="font-semibold text-gray-700">
                        {job.customer?.name || "Verified Customer"}
                      </span>{" "}
                      • Service:{" "}
                      <span className="font-semibold text-gray-700">
                        {job.title}
                      </span>
                    </p>
                  </div>

                  <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#1a7a6e] border border-teal-200/60">
                    {job.quoteCount > 0
                      ? `${job.quoteCount} Quote${job.quoteCount > 1 ? "s" : ""} Submitted`
                      : "First Proposal"}
                  </span>
                </div>

                <QuoteForm
                  onSubmit={handleSubmit}
                  loading={submitting}
                  suggestedBudget={job.budget}
                />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateQuote;
