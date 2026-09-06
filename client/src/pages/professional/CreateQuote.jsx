import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft, HiPaperAirplane, HiInformationCircle } from "react-icons/hi2";

import { getWorkRequestById } from "../../services/workRequest.service";
import { createQuote } from "../../services/quote.service";

import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import JobSummary from "../../components/professional/jobs/JobSummary";
import QuoteForm from "../../components/professional/quote/QuoteForm";

const CreateQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      try {
        setLoadingJob(true);
        const response = await getWorkRequestById(id);
        const data = response?.data?.data || response?.data || null;

        if (isMounted) {
          setJob(data);
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
      loadJob();
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
                <HiInformationCircle className="w-4 h-4" />
                <span>Tips for Winning Quotes</span>
              </p>
              <p className="leading-relaxed">
                Be explicit about what materials or replacement parts are included in your price. Customers value clear estimates and immediate arrival times.
              </p>
            </div>
          </div>

          {/* Quote Form Column */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                    <HiPaperAirplane className="w-6 h-6 text-[#1a7a6e]" />
                    <span>Send Your Quote</span>
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Customer: <span className="font-semibold text-gray-700">{job.customer?.name || "Verified Customer"}</span> • Service: <span className="font-semibold text-gray-700">{job.title}</span>
                  </p>
                </div>

                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#1a7a6e] border border-teal-200/60">
                  New Proposal
                </span>
              </div>

              <QuoteForm
                onSubmit={handleSubmit}
                loading={submitting}
                suggestedBudget={job.budget}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateQuote;
