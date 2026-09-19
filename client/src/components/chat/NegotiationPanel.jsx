import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiBanknotes,
  HiCheckCircle,
  HiArrowRight,
  HiLockClosed,
} from "react-icons/hi2";
import useSocket from "../../hooks/useSocket";
import { acceptQuote } from "../../services/quote.service";

const NegotiationPanel = ({
  chat,
  quote,
  currentUser,
  workRequest,
  onQuoteUpdated,
  onQuoteAccepted,
  onContinueBooking,
}) => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const [proposedAmount, setProposedAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  if (!quote) return null;

  const currentUserId = currentUser?._id || currentUser?.id;
  const isCustomer =
    (chat?.customer?._id || chat?.customer)?.toString() ===
    currentUserId?.toString();

  const isAccepted = quote.status === "accepted";
  const isRejected = ["rejected", "withdrawn"].includes(quote.status);
  const isLocked = isAccepted || isRejected;

  const handleProposeAmount = async (e) => {
    e?.preventDefault();

    const numericAmount = Number(proposedAmount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    if (numericAmount === Number(quote.amount)) {
      toast.error("Proposed amount must be different from current quote");
      return;
    }

    if (!isConnected) {
      toast.error("Chat connection is unavailable. Retrying...");
      return;
    }

    try {
      setIsSubmitting(true);

      socket.emit(
        "quote:negotiate",
        {
          chatId: chat?._id,
          newAmount: numericAmount,
        },
        (response) => {
          setIsSubmitting(false);

          if (!response?.success) {
            toast.error(
              response?.message || "Failed to negotiate quote"
            );
            return;
          }

          toast.success(
            `Proposed new amount of ₹${numericAmount.toLocaleString("en-IN")}`
          );
          setProposedAmount("");

          if (onQuoteUpdated && response.data?.quote) {
            onQuoteUpdated(response.data.quote);
          }
        }
      );
    } catch (error) {
      console.error("Negotiation error:", error);
      setIsSubmitting(false);
      toast.error(error.message || "Failed to negotiate quote");
    }
  };

  const handleAcceptQuote = async () => {
    if (!quote?._id) return;

    const confirmed = window.confirm(
      `Accept this agreed quote of ₹${Number(quote.amount).toLocaleString(
        "en-IN"
      )} and proceed to schedule your booking?`
    );
    if (!confirmed) return;

    try {
      setIsAccepting(true);
      const res = await acceptQuote(quote._id);
      const acceptedData = res?.data?.data || res?.data || { ...quote, status: "accepted" };

      // Notify the other user in real-time via socket
      if (socket && isConnected) {
        socket.emit("quote:accepted", {
          chatId: chat?._id,
          quote: acceptedData,
        });

        socket.emit("message:send", {
          chatId: chat?._id,
          type: "system",
          content: `Customer accepted quote for ₹${Number(quote.amount).toLocaleString("en-IN")}.`,
        });
      }

      if (onQuoteAccepted) {
        onQuoteAccepted(acceptedData);
      }

      toast.success("Quote accepted! Proceeding to booking confirmation...");
      navigate(`/customer/bookings/create?quoteId=${quote._id}`, {
        state: {
          quote: acceptedData,
          workRequest: workRequest || chat?.workRequest,
        },
      });
    } catch (error) {
      console.error("Failed to accept quote:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept quote"
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200/90 shadow-2xs px-4 py-3 shrink-0">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        
        {/* Left Info: Current Quote & Details */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
              isAccepted
                ? "bg-emerald-500 text-white"
                : "bg-teal-50 text-[#1a7a6e] border border-teal-100"
            }`}
          >
            {isAccepted ? (
              <HiCheckCircle className="w-6 h-6" />
            ) : (
              <HiBanknotes className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Current Quote:
              </span>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                ₹{Number(quote.amount).toLocaleString("en-IN")}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isAccepted
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : quote.status === "negotiating"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : isRejected
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {quote.status}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm sm:max-w-md">
              <span className="font-medium text-gray-700">
                {workRequest?.title || chat?.workRequest?.title || "Service Request"}
              </span>
              {quote.estimatedDuration?.value && (
                <span className="ml-2 text-gray-400">
                  • Est. {quote.estimatedDuration.value} {quote.estimatedDuration.unit}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions: Propose Amount & Customer Accept */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isLocked ? (
            <>
              {/* Proposal Input & Button */}
              <form
                onSubmit={handleProposeAmount}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter new amount"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    disabled={isSubmitting}
                    className="w-36 sm:w-44 pl-7 pr-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !proposedAmount}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#1a7a6e] text-[#1a7a6e] hover:bg-teal-50 text-xs font-bold transition shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? "Proposing..." : "Propose Amount"}
                </button>
              </form>

              {/* Customer Accept Button */}
              {isCustomer && (
                <button
                  type="button"
                  onClick={handleAcceptQuote}
                  disabled={isAccepting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <HiCheckCircle className="w-4 h-4" />
                  <span>{isAccepting ? "Accepting..." : "Accept Quote"}</span>
                </button>
              )}
            </>
          ) : isAccepted ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <HiCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Quote Accepted (₹{Number(quote.amount).toLocaleString("en-IN")})</span>
              </span>

              {isCustomer && (
                <button
                  type="button"
                  onClick={
                    onContinueBooking ||
                    (() =>
                      navigate(`/customer/bookings/create?quoteId=${quote._id}`, {
                        state: {
                          quote,
                          workRequest: workRequest || chat?.workRequest,
                        },
                      }))
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <span>Continue to Booking</span>
                  <HiArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">
              <HiLockClosed className="w-3.5 h-3.5 text-gray-400" />
              <span>Negotiation Closed ({quote.status})</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NegotiationPanel;
