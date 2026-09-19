import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiSparkles,
  HiCheck,
  HiPencilSquare,
  HiXMark,
  HiBanknotes,
} from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import {
  getChatById,
  getChatMessages,
  markChatAsRead,
} from "../../services/chat.service";
import { acceptQuote, updateQuote } from "../../services/quote.service";

import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import TypingIndicator from "../../components/chat/TypingIndicator";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // Negotiation revision modal state (for professional)
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [reviseAmount, setReviseAmount] = useState("");
  const [reviseMessage, setReviseMessage] = useState("");
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  // Accepting quote state (for customer)
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);

  const getCurrentUserId = useCallback(
    () => user?._id || user?.id,
    [user]
  );

  /*
   * Load chat + old messages
   */
  useEffect(() => {
    let mounted = true;

    const loadChat = async () => {
      try {
        setLoading(true);
        setError("");

        const [chatResponse, messagesResponse] = await Promise.all([
          getChatById(chatId),
          getChatMessages(chatId, {
            page: 1,
            limit: 50,
          }),
        ]);

        if (mounted) {
          const chatData = chatResponse?.data?.data || chatResponse?.data || null;
          setChat(chatData);

          const messagesData =
            messagesResponse?.data?.data ||
            messagesResponse?.data?.messages ||
            messagesResponse?.data ||
            [];
          setMessages(Array.isArray(messagesData) ? messagesData : []);

          if (chatData?.quote?.amount) {
            setReviseAmount(String(chatData.quote.amount));
          }
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load chat"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (chatId && user) {
      loadChat();
    }

    return () => {
      mounted = false;
    };
  }, [chatId, user]);

  /*
   * Join Socket.IO chat room
   */
  useEffect(() => {
    if (!socket || !isConnected || !chatId) {
      return;
    }

    socket.emit("chat:join", chatId, (response) => {
      if (response && response.success === false) {
        setError(response?.message || "Unable to join chat");
      }
    });

    return () => {
      socket.emit("chat:leave", chatId);
    };
  }, [socket, isConnected, chatId]);

  /*
   * Receive messages
   */
  useEffect(() => {
    if (!socket || !chatId) {
      return;
    }

    const handleNewMessage = (message) => {
      const messageChatId =
        message?.chat?._id || message?.chat;

      if (messageChatId?.toString() !== chatId.toString()) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some((item) => item._id === message._id);
        if (exists) {
          return prev;
        }
        return [...prev, message];
      });

      // If this message was a quote update, update local chat.quote amount
      if (message.type === "quote_update" && message.quoteUpdate?.newAmount) {
        setChat((prev) => {
          if (!prev || !prev.quote) return prev;
          return {
            ...prev,
            quote: {
              ...prev.quote,
              amount: message.quoteUpdate.newAmount,
              status: "negotiating",
            },
          };
        });
      }
    };

    const handleChatError = (data) => {
      setError(data?.message || "Chat error");
    };

    socket.on("message:new", handleNewMessage);
    socket.on("chat:error", handleChatError);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("chat:error", handleChatError);
    };
  }, [socket, chatId]);

  /*
   * Typing events
   */
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleTypingStart = (data) => {
      const currentUserId = getCurrentUserId();
      if (
        data?.chatId?.toString() === chatId.toString() &&
        data?.userId?.toString() !== currentUserId?.toString()
      ) {
        setOtherUserTyping(true);
      }
    };

    const handleTypingStop = (data) => {
      const currentUserId = getCurrentUserId();
      if (
        data?.chatId?.toString() === chatId.toString() &&
        data?.userId?.toString() !== currentUserId?.toString()
      ) {
        setOtherUserTyping(false);
      }
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, chatId, getCurrentUserId]);

  /*
   * Mark messages as read
   */
  useEffect(() => {
    if (!socket || !isConnected || !chatId) {
      return;
    }

    socket.emit("messages:read", chatId);
    markChatAsRead(chatId).catch((err) => {
      console.error("Failed to mark chat as read:", err);
    });
  }, [socket, isConnected, chatId]);

  const handleSend = (content) => {
    if (!isConnected || !chatId) {
      return;
    }

    socket.emit(
      "message:send",
      {
        chatId,
        type: "text",
        content,
      },
      (response) => {
        if (!response?.success) {
          setError(response?.message || "Failed to send message");
        } else {
          setError("");
        }
      }
    );
  };

  const handleTypingStart = () => {
    if (!isConnected || !chatId) {
      return;
    }
    socket.emit("typing:start", chatId);
  };

  const handleTypingStop = () => {
    if (!isConnected || !chatId) {
      return;
    }
    socket.emit("typing:stop", chatId);
  };

  // Negotiation Actions: Propose revised quote
  const handleProposeRevision = async (e) => {
    e.preventDefault();
    if (!chat?.quote?._id) return;

    const parsedAmount = Number(reviseAmount);
    if (!parsedAmount || parsedAmount < 1) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setIsSubmittingRevision(true);
      const previousAmount = chat.quote.amount;

      await updateQuote(chat.quote._id, {
        amount: parsedAmount,
        message: reviseMessage.trim(),
      });

      // Emit quote_update message over socket so both sides see it instantly
      if (socket && isConnected) {
        socket.emit("message:send", {
          chatId,
          type: "quote_update",
          content: reviseMessage.trim()
            ? `Proposed revision: ${reviseMessage.trim()}`
            : `Proposed revised quote of ₹${parsedAmount.toLocaleString("en-IN")}`,
          quoteUpdate: {
            previousAmount,
            newAmount: parsedAmount,
          },
        });
      }

      setChat((prev) => ({
        ...prev,
        quote: {
          ...prev.quote,
          amount: parsedAmount,
          status: "negotiating",
        },
      }));

      setShowReviseModal(false);
      setReviseMessage("");
      toast.success("Quote revised & shared with customer!");
    } catch (err) {
      console.error("Failed to update quote:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to revise quote"
      );
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  // Negotiation Actions: Customer accepts quote
  const handleAcceptQuote = async () => {
    if (!chat?.quote?._id) return;

    const confirmed = window.confirm(
      `Accept this quote of ₹${Number(chat.quote.amount).toLocaleString(
        "en-IN"
      )} and proceed to booking?`
    );
    if (!confirmed) return;

    try {
      setIsAcceptingQuote(true);
      await acceptQuote(chat.quote._id);

      if (socket && isConnected) {
        socket.emit("message:send", {
          chatId,
          type: "system",
          content: `Customer accepted quote for ₹${Number(
            chat.quote.amount
          ).toLocaleString("en-IN")}.`,
        });
      }

      toast.success("Quote accepted! Proceeding to schedule your booking...");
      navigate(`/customer/bookings/create?quoteId=${chat.quote._id}`, {
        state: {
          quote: {
            ...chat.quote,
            status: "accepted",
          },
          workRequest: chat.workRequest,
        },
      });
    } catch (err) {
      console.error("Failed to accept quote:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to accept quote"
      );
    } finally {
      setIsAcceptingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading conversation...</p>
      </div>
    );
  }

  if (error && !chat) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl mb-3">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Unable to open chat
          </h2>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white text-sm font-semibold hover:bg-[#155f55] transition cursor-pointer"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  const currentUserId = getCurrentUserId();
  const isCustomer =
    (chat?.customer?._id || chat?.customer)?.toString() ===
    currentUserId?.toString();
  const isProfessional = !isCustomer;
  const quote = chat?.quote;
  const isNegotiable =
    quote && ["submitted", "negotiating"].includes(quote.status);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <ChatHeader
        chat={chat}
        currentUser={user}
        isConnected={isConnected}
      />

      {/* Interactive Negotiation & Offer Banner */}
      {quote && (
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50/50 to-teal-50 border-b border-teal-100/80 px-4 py-3 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <HiBanknotes className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Current Offer:
                  </span>
                  <span className="text-base font-black text-[#1a7a6e]">
                    ₹{Number(quote.amount).toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      quote.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : quote.status === "negotiating"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 truncate max-w-xs sm:max-w-md">
                  {chat?.workRequest?.title || "Active Quote Negotiation"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Professional can revise quote */}
              {isProfessional && isNegotiable && (
                <button
                  type="button"
                  onClick={() => setShowReviseModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-teal-200 text-[#1a7a6e] font-semibold text-xs hover:bg-teal-50 transition shadow-2xs cursor-pointer"
                >
                  <HiPencilSquare className="w-4 h-4" />
                  <span>Revise Quote</span>
                </button>
              )}

              {/* Customer can accept quote */}
              {isCustomer && isNegotiable && (
                <button
                  type="button"
                  onClick={handleAcceptQuote}
                  disabled={isAcceptingQuote}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <HiCheck className="w-4 h-4" />
                  <span>
                    {isAcceptingQuote ? "Accepting..." : "Accept & Book"}
                  </span>
                </button>
              )}

              {quote.status === "accepted" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                  <HiSparkles className="w-3.5 h-3.5" />
                  <span>Offer Accepted</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 shrink-0">
          <p className="max-w-4xl mx-auto text-xs text-red-600">{error}</p>
        </div>
      )}

      <MessageList messages={messages} currentUser={user} />

      <TypingIndicator
        visible={otherUserTyping}
        userName={
          (chat?.customer?._id || chat?.customer)?.toString() === currentUserId?.toString()
            ? chat?.professional?.name
            : chat?.customer?.name
        }
      />

      <MessageInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!isConnected || !chat}
      />

      {/* Professional Revision Modal */}
      {showReviseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <HiPencilSquare className="w-5 h-5 text-[#1a7a6e]" />
                <span>Revise Quote Amount</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReviseModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposeRevision} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Quoted Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={reviseAmount}
                    onChange={(e) => setReviseAmount(e.target.value)}
                    placeholder="Enter revised quote amount"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a7a6e]/30 focus:border-[#1a7a6e] font-semibold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Revision Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviseMessage}
                  onChange={(e) => setReviseMessage(e.target.value)}
                  placeholder="e.g. As discussed, discounted by ₹300 if you provide paints."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a7a6e]/30 focus:border-[#1a7a6e] text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviseModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-xs hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevision || !reviseAmount}
                  className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingRevision ? "Updating..." : "Send Revised Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
