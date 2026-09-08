import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiBriefcase,
  HiMapPin,
  HiBanknotes,
  HiExclamationCircle,
  HiClock,
  HiArrowPath,
} from "react-icons/hi2";

import { updateQuote } from "../../services/quote.service";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import QuoteForm from "../../components/professional/quote/QuoteForm";
import QuoteRevision from "../../components/professional/quote/QuoteRevision";
import QuoteStatus from "../../components/professional/quote/QuoteStatus";

const EditQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const quote = location.state?.quote;
  const workRequest = location.state?.workRequest || quote?.workRequest;

  const [loading, setLoading] = useState(false);

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

      toast.success("Quote updated successfully!");
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

              <h1 className="text-xl font-bold text-gray-900 mt-3 leading-snug">
                {workRequest?.title || "Service Request"}
              </h1>

              {workRequest?.location?.city && (
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <HiMapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{workRequest.location.city}</span>
                </p>
              )}

              {workRequest?.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Job Description
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    {workRequest.description}
                  </p>
                </div>
              )}

              {/* Price Details */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Original Quote:</span>
                  <span className="text-sm font-bold text-gray-700">
                    ₹{Number(quote.initialAmount || quote.amount).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Active Quote Amount:</span>
                  <span className="text-xl font-extrabold text-[#1a7a6e]">
                    ₹{Number(quote.amount).toLocaleString("en-IN")}
                  </span>
                </div>

                {workRequest?.budget?.min && (
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Customer Budget:</span>
                    <span>
                      ₹{Number(workRequest.budget.min).toLocaleString("en-IN")} - ₹{Number(workRequest.budget.max).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Negotiation / Revision History if exists */}
            {revisions.length > 0 && (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <HiArrowPath className="w-4 h-4 text-[#1a7a6e]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Revision History ({revisions.length})
                  </h3>
                </div>
                <div className="space-y-3 mt-3">
                  {revisions.map((rev, idx) => (
                    <QuoteRevision
                      key={idx}
                      revision={rev}
                      number={revisions.length - idx}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Revision Form */}
          <section className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Revise Your Quote
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your price or scheduling details based on discussions with the customer.
              </p>
            </div>

            <QuoteForm
              onSubmit={handleSubmit}
              loading={loading}
              initialData={{
                initialAmount: quote.initialAmount || quote.amount || "",
                amount: quote.amount || "",
                message: quote.message || "",
                durationValue: quote.estimatedDuration?.value || "",
                durationUnit: quote.estimatedDuration?.unit || "hours",
                availableDate: quote.availableDate
                  ? quote.availableDate.split("T")[0]
                  : "",
                availableTime: quote.availableTime || "",
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditQuote;
