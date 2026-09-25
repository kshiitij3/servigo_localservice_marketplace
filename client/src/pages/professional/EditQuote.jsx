import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiBriefcase,
  HiMapPin,
  HiExclamationCircle,
  HiArrowPath,
} from "react-icons/hi2";

import { getQuoteById, updateQuote } from "../../services/quote.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import QuoteForm from "../../components/professional/quote/QuoteForm";
import QuoteRevision from "../../components/professional/quote/QuoteRevision";
import QuoteStatus from "../../components/professional/quote/QuoteStatus";

const EditQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quote, setQuote] = useState(location.state?.quote || null);
  const [workRequest, setWorkRequest] = useState(
    location.state?.workRequest || location.state?.quote?.workRequest || null
  );

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!quote);

  useEffect(() => {
    let mounted = true;

    const fetchQuote = async () => {
      try {
        setFetching(true);
        const response = await getQuoteById(id);
        const data = response?.data?.data || response?.data;
        if (mounted && data) {
          setQuote(data);
          if (data.workRequest) {
            setWorkRequest(data.workRequest);
          }
        }
      } catch (err) {
        console.error("Failed to load quote:", err);
        if (mounted) {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load quote details"
          );
        }
      } finally {
        if (mounted) {
          setFetching(false);
        }
      }
    };

    if (!quote && id) {
      fetchQuote();
    }

    return () => {
      mounted = false;
    };
  }, [id, quote]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        amount: Number(data.amount),
        message: data.message ? data.message.trim() : undefined,
        estimatedDuration: {
          value: Number(data.durationValue),
          unit: data.durationUnit,
        },
        availableDate: data.availableDate || undefined,
        availableTime: data.availableTime || undefined,
      };

      await updateQuote(id, payload);

      toast.success("Quote updated & revised successfully!");
      navigate("/professional/quotes");
    } catch (error) {
      console.error("Failed to update quote:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update quote."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading quote to edit...</p>
        </main>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <ProfessionalNavbar />

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <HiExclamationCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Quote information not available
            </h1>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              Please return to My Quotes and open the quote again to revise it.
            </p>

            <button
              onClick={() => navigate("/professional/quotes")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to My Quotes</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const revisions = quote.revisions ? [...quote.revisions].reverse() : [];

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/professional/quotes")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to My Quotes</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Service Request & Quote Context */}
          <div className="space-y-6">
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider flex items-center gap-1.5">
                  <HiBriefcase className="w-3.5 h-3.5" />
                  <span>Service Request</span>
                </span>
                <QuoteStatus status={quote.status} />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mt-3">
                {workRequest?.title || "Requested Service"}
              </h2>

              {workRequest?.description && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-4">
                  {workRequest.description}
                </p>
              )}

              {workRequest?.location && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <HiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">
                    {workRequest.location.city || workRequest.location.address || "Location provided"}
                  </span>
                </div>
              )}
            </section>

            {/* Current Proposal Info */}
            <section className="bg-teal-50/50 border border-teal-100 rounded-2xl p-6 shadow-xs">
              <span className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider block">
                Current Active Price
              </span>
              <p className="text-3xl font-black text-[#1a7a6e] mt-1">
                ₹{Number(quote.amount).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-teal-800/80 mt-2 leading-relaxed">
                Updating your quote will record the previous price in revision history and mark this proposal as active negotiation.
              </p>
            </section>

            {/* Revision History if exists */}
            {revisions.length > 0 && (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <HiArrowPath className="w-4 h-4 text-[#1a7a6e]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Previous Versions ({revisions.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {revisions.map((rev, index) => (
                    <QuoteRevision
                      key={rev._id || rev.createdAt || index}
                      revision={rev}
                      number={revisions.length - index}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Revision Form */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-100 pb-5 mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                  Revise Your Proposal
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Adjust your price or message based on conversations with the customer.
                </p>
              </div>

              <QuoteForm
                initialData={{
                  initialAmount: quote.amount,
                  message: quote.message,
                  durationValue: quote.estimatedDuration?.value,
                  durationUnit: quote.estimatedDuration?.unit,
                  availableDate: quote.availableDate
                    ? new Date(quote.availableDate).toISOString().split("T")[0]
                    : "",
                  availableTime: quote.availableTime || "",
                }}
                onSubmit={handleSubmit}
                loading={loading}
                isEdit={true}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditQuote;
