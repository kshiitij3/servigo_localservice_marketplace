import Chat from "../models/Chat.js";
import {
  createMessage,
  markChatAsRead,
  negotiateQuote,
} from "../services/chat.service.js";
import { createNotification } from "../services/notification.service.js";

const getChatRoom = (chatId) => {
  return `chat:${chatId}`;
};

const isChatParticipant = (chat, userId) => {
  return (
    chat.customer.toString() === userId.toString() ||
    chat.professional.toString() === userId.toString()
  );
};

export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    /*
     * Join a personal room so notification:new events
     * can be delivered to only this user.
     *   notification.service.js  →  io.to(`user:${receiver}`)
     */
    const userRoom = `user:${socket.user._id}`;
    socket.join(userRoom);

    console.log(
      "Socket connected:",
      socket.id,
      "User:",
      socket.user._id.toString(),
      `| joined ${userRoom}`
    );

    /*
     * JOIN CHAT
     */
    socket.on("chat:join", async (chatId, callback = () => {}) => {
      try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
          socket.emit("chat:error", {
            message: "Chat not found",
          });
          return callback({
            success: false,
            message: "Chat not found",
          });
        }

        /*
         * Only customer or professional
         * belonging to this chat can join.
         */
        if (
          !isChatParticipant(
            chat,
            socket.user._id
          )
        ) {
          socket.emit("chat:error", {
            message:
              "You are not authorized to access this chat",
          });
          return callback({
            success: false,
            message: "You are not authorized to access this chat",
          });
        }

        /*
         * Only active chats can be joined.
         */
        if (chat.status !== "active") {
          socket.emit("chat:error", {
            message: "This chat is not active",
          });
          return callback({
            success: false,
            message: "This chat is not active",
          });
        }

        const room = getChatRoom(chatId);

        socket.join(room);

        console.log(
          `User ${socket.user._id} joined ${room}`
        );

        socket.emit("chat:joined", {
          chatId,
        });

        callback({
          success: true,
          data: { chatId },
        });
      } catch (error) {
        console.error(
          "Chat join error:",
          error
        );

        socket.emit("chat:error", {
          message: "Failed to join chat",
        });

        callback({
          success: false,
          message: error.message || "Failed to join chat",
        });
      }
    });

    /*
     * LEAVE CHAT
     */
    socket.on("chat:leave", (chatId) => {
      const room = getChatRoom(chatId);

      socket.leave(room);

      console.log(
        `User ${socket.user._id} left ${room}`
      );
    });

    socket.on("message:send", async (payload, callback = () => {}) => {
      try {
        const { chatId, type = "text", content = "", media, quoteUpdate } = payload || {};
        const chat = await Chat.findById(chatId);

        if (!chat || !isChatParticipant(chat, socket.user._id)) {
          return callback({ success: false, message: "You are not authorized to send messages here" });
        }

        const message = await createMessage({
          chatId,
          senderId: socket.user._id,
          type,
          content,
          media,
          quoteUpdate,
        });

        /* ── Chat Notification ── */
        const senderId       = socket.user._id.toString();
        const customerId     = chat.customer.toString();
        const receiverId     = senderId === customerId ? chat.professional : chat.customer;

        const messagePreview =
          type === "image"
            ? "Sent you an image."
            : content?.trim()
              ? content.trim().slice(0, 100)
              : "Sent you a message.";

        await createNotification({
          receiver:     receiverId,
          sender:       socket.user._id,
          title:        `New message from ${socket.user.name}`,
          message:      messagePreview,
          type:         "chat",
          relatedId:    chat._id,
          relatedModel: "Chat",
        });

        io.to(getChatRoom(chatId)).emit("message:new", message);
        callback({ success: true, data: message });
      } catch (error) {
        callback({ success: false, message: error.message || "Failed to send message" });
      }
    });

    /*
     * REAL-TIME QUOTE NEGOTIATION
     */
    socket.on("quote:negotiate", async (payload, callback = () => {}) => {
      try {
        const { chatId, newAmount } = payload || {};

        if (!chatId) {
          throw new Error("Chat ID is required");
        }

        if (!newAmount) {
          throw new Error("New amount is required");
        }

        const result = await negotiateQuote({
          chatId,
          userId: socket.user._id,
          newAmount,
        });

        // Broadcast updated quote and message to everyone in the chat room
        io.to(getChatRoom(chatId)).emit("quote:updated", {
          quote: result.quote,
          message: result.message,
        });

        callback({
          success: true,
          data: result,
        });
      } catch (error) {
        console.error("Quote negotiation error:", error.message);
        socket.emit("chat:error", {
          message: error.message || "Failed to negotiate quote",
        });

        callback({
          success: false,
          message: error.message || "Failed to negotiate quote",
        });
      }
    });

    /*
     * REAL-TIME QUOTE ACCEPTED NOTIFICATION
     */
    socket.on("quote:accepted", async (payload, callback = () => {}) => {
      try {
        const { chatId, quote } = payload || {};
        if (chatId) {
          io.to(getChatRoom(chatId)).emit("quote:accepted", { quote });
        }
        callback({ success: true });
      } catch (error) {
        callback({ success: false, message: error.message });
      }
    });

    const relayTyping = (event) => (chatId) => {
      socket.to(getChatRoom(chatId)).emit(event, { chatId, userId: socket.user._id });
    };

    socket.on("typing:start", relayTyping("typing:start"));
    socket.on("typing:stop", relayTyping("typing:stop"));

    socket.on("messages:read", async (chatId) => {
      try {
        await markChatAsRead(chatId, socket.user._id);
        socket.to(getChatRoom(chatId)).emit("messages:read", {
          chatId,
          userId: socket.user._id,
        });
      } catch (error) {
        socket.emit("chat:error", { message: error.message || "Failed to mark messages as read" });
      }
    });

    /*
     * DISCONNECT
     */
    socket.on("disconnect", (reason) => {
      console.log(
        "Socket disconnected:",
        socket.id,
        reason
      );
    });
  });
};
