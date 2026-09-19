import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import {
  getChatById,
  getChatMessages,
  markChatAsRead,
} from "../../services/chat.service";

import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import TypingIndicator from "../../components/chat/TypingIndicator";
import NegotiationPanel from "../../components/chat/NegotiationPanel";

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
   * Real-time Quote Updates & Acceptance Events
   */
  useEffect(() => {
    if (!socket || !chatId) {
      return;
    }

    const handleQuoteUpdated = ({ quote: updatedQuote, message }) => {
      if (updatedQuote) {
        setChat((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            quote: updatedQuote,
          };
        });
      }

      if (message) {
        setMessages((prev) => {
          const exists = prev.some((item) => item._id === message._id);
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    const handleQuoteAccepted = ({ quote: acceptedQuote, message }) => {
      if (acceptedQuote) {
        setChat((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            quote: acceptedQuote,
          };
        });
      }

      if (message) {
        setMessages((prev) => {
          const exists = prev.some((item) => item._id === message._id);
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    socket.on("quote:updated", handleQuoteUpdated);
    socket.on("quote:accepted", handleQuoteAccepted);

    return () => {
      socket.off("quote:updated", handleQuoteUpdated);
      socket.off("quote:accepted", handleQuoteAccepted);
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

  const quote = chat?.quote;

  const handleContinueBooking = () => {
    if (!quote?._id) return;
    navigate(`/customer/bookings/create?quoteId=${quote._id}`, {
      state: {
        quote,
        workRequest: chat?.workRequest,
      },
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <ChatHeader
        chat={chat}
        currentUser={user}
        isConnected={isConnected}
      />

      {/* Interactive Real-Time Negotiation Panel */}
      {quote && (
        <NegotiationPanel
          chat={chat}
          quote={quote}
          currentUser={user}
          workRequest={chat?.workRequest}
          onQuoteUpdated={(updatedQuote) => {
            setChat((prev) => (prev ? { ...prev, quote: updatedQuote } : prev));
          }}
          onQuoteAccepted={(acceptedQuote) => {
            setChat((prev) => (prev ? { ...prev, quote: acceptedQuote } : prev));
          }}
          onContinueBooking={handleContinueBooking}
        />
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
          (chat?.customer?._id || chat?.customer)?.toString() === getCurrentUserId()?.toString()
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

    </div>
  );
};

export default Chat;
