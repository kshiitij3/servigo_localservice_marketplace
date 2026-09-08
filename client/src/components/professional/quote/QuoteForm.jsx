import { useState, useEffect } from "react";
import {
  HiBanknotes,
  HiChatBubbleBottomCenterText,
  HiClock,
  HiCalendarDays,
  HiCheckCircle,
} from "react-icons/hi2";

const QuoteForm = ({ onSubmit, loading, initialData, suggestedBudget }) => {
  const isRevision = Boolean(initialData?.amount || initialData?.initialAmount);

  const [formData, setFormData] = useState({
    initialAmount:
      initialData?.initialAmount !== undefined && initialData?.initialAmount !== null
        ? String(initialData.initialAmount)
        : suggestedBudget?.min
        ? String(suggestedBudget.min)
        : "",
    amount:
      initialData?.amount !== undefined && initialData?.amount !== null
        ? String(initialData.amount)
        : suggestedBudget?.min
        ? String(suggestedBudget.min)
        : "",
    message: initialData?.message || "",
    durationValue:
      initialData?.durationValue !== undefined && initialData?.durationValue !== null
        ? String(initialData.durationValue)
        : "2",
    durationUnit: initialData?.durationUnit || "hours",
    availableDate:
      initialData?.availableDate || new Date().toISOString().split("T")[0],
    availableTime: initialData?.availableTime || "10:00",
  });

  const [hasCustomAmount, setHasCustomAmount] = useState(Boolean(initialData?.amount));

  useEffect(() => {
    if (initialData) {
      setFormData({
        initialAmount:
          initialData.initialAmount !== undefined && initialData.initialAmount !== null
            ? String(initialData.initialAmount)
            : "",
        amount:
          initialData.amount !== undefined && initialData.amount !== null
            ? String(initialData.amount)
            : "",
        message: initialData.message || "",
        durationValue:
          initialData.durationValue !== undefined && initialData.durationValue !== null
            ? String(initialData.durationValue)
            : "2",
        durationUnit: initialData.durationUnit || "hours",
        availableDate:
          initialData.availableDate || new Date().toISOString().split("T")[0],
        availableTime: initialData.availableTime || "10:00",
      });
      if (initialData.amount) {
        setHasCustomAmount(true);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Keep amount in sync with initialAmount unless user explicitly edits quote amount
      if (name === "initialAmount" && !hasCustomAmount) {
        next.amount = value;
      }
      return next;
    });

    if (name === "amount") {
      setHasCustomAmount(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Price Breakdown Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Initial Amount */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiBanknotes className="w-4 h-4 text-gray-400" />
            <span>{isRevision ? "Original Quote (₹)" : "Initial Proposed Price (₹)"}</span>
          </label>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">
              ₹
            </span>
            <input
              type="number"
              name="initialAmount"
              min="1"
              step="1"
              value={formData.initialAmount}
              onChange={handleChange}
              placeholder="1000"
              required
              readOnly={isRevision}
              className={`w-full border rounded-xl pl-8 pr-4 py-3 text-base font-semibold transition ${
                isRevision
                  ? "bg-gray-100/90 border-gray-200 text-gray-500 cursor-not-allowed select-none"
                  : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] focus:bg-white"
              }`}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {isRevision
              ? "Your original proposal amount remains fixed on record."
              : "Your primary quoted fee for the work requested."}
          </p>
        </div>

        {/* Current / Confirmed Amount */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiBanknotes className="w-4 h-4 text-[#1a7a6e]" />
            <span>{isRevision ? "Revised Quote Amount (₹)" : "Final Quote Amount (₹)"}</span>
          </label>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">
              ₹
            </span>
            <input
              type="number"
              name="amount"
              min="1"
              step="1"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1000"
              required
              className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-base font-bold text-[#1a7a6e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {isRevision
              ? "New price customer will review for acceptance."
              : "Amount the customer will see as your active quote."}
          </p>
        </div>
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <HiChatBubbleBottomCenterText className="w-4 h-4 text-gray-400" />
            <span>Proposal & Work Details</span>
          </label>
          <span className="text-[11px] text-gray-400 font-medium">
            {formData.message.length}/1000
          </span>
        </div>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe your expertise, what's included in this price (materials, labor, warranty), and any preparation the customer needs to do..."
          maxLength={1000}
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white resize-none"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          A clear explanation significantly increases quote acceptance rates.
        </p>
      </div>

      {/* Estimated Duration */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HiClock className="w-4 h-4 text-gray-400" />
          <span>Estimated Completion Time</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="durationValue"
            min="1"
            value={formData.durationValue}
            onChange={handleChange}
            placeholder="e.g. 2"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white"
          />

          <select
            name="durationUnit"
            value={formData.durationUnit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition cursor-pointer"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>

      {/* Availability Schedule */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HiCalendarDays className="w-4 h-4 text-gray-400" />
          <span>Available Date & Starting Time</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-gray-400 font-medium mb-1 block">
              Service Date
            </span>
            <input
              type="date"
              name="availableDate"
              value={formData.availableDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white cursor-pointer"
            />
          </div>

          <div>
            <span className="text-[11px] text-gray-400 font-medium mb-1 block">
              Arrival Time (HH:mm)
            </span>
            <input
              type="time"
              name="availableTime"
              value={formData.availableTime}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#155f55] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-teal-900/10 active:scale-[0.98] cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{isRevision ? "Updating Quote..." : "Submitting Quote to Customer..."}</span>
          </>
        ) : (
          <>
            <HiCheckCircle className="w-5 h-5" />
            <span>{isRevision ? "Submit Revised Quote" : "Submit Quote"}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default QuoteForm;
