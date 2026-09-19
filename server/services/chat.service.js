import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Quote from "../models/Quote.js";
import User from "../models/User.js";
import WorkRequest from "../models/WorkRequest.js";
import ApiError from "../utils/ApiError.js";

const isParticipant = (chat, userId) =>
  chat.customer.toString() === userId.toString() ||
  chat.professional.toString() === userId.toString();

export const createOrGetChat = async ({
  userId,
  customerId,
  professionalId,
  workRequestId,
  quoteId,
}) => {
  let resolvedQuoteId = quoteId;
  let resolvedWorkRequestId = workRequestId;
  let resolvedCustomerId = customerId;
  let resolvedProfessionalId = professionalId;

  if (resolvedQuoteId) {
    const quote = await Quote.findById(resolvedQuoteId);
    if (!quote) {
      throw new ApiError(404, "Quote not found");
    }
    resolvedWorkRequestId = quote.workRequest;
    resolvedCustomerId = quote.customer;
    resolvedProfessionalId = quote.professional;
  }

  if (
    !resolvedCustomerId ||
    !resolvedProfessionalId ||
    !resolvedWorkRequestId ||
    !resolvedQuoteId
  ) {
    throw new ApiError(
      400,
      "Professional, work request, and quote are required"
    );
  }

  if (
    userId &&
    userId.toString() !== resolvedCustomerId.toString() &&
    userId.toString() !== resolvedProfessionalId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to access this conversation"
    );
  }

  const [professional, workRequest] = await Promise.all([
    User.findOne({
      _id: resolvedProfessionalId,
      role: "professional",
      isActive: true,
    }),
    WorkRequest.findOne({
      _id: resolvedWorkRequestId,
      isDeleted: false,
    }),
  ]);

  if (!professional) {
    throw new ApiError(404, "Professional not found or inactive");
  }

  if (!workRequest) {
    throw new ApiError(404, "Work request not found");
  }

  let chat = await Chat.findOne({
    workRequest: resolvedWorkRequestId,
    professional: resolvedProfessionalId,
  });

  if (chat) {
    return chat;
  }

  try {
    chat = await Chat.create({
      customer: resolvedCustomerId,
      professional: resolvedProfessionalId,
      workRequest: resolvedWorkRequestId,
      quote: resolvedQuoteId,
    });
  } catch (error) {
    // Another request may have created the unique chat between the read
    // and the insert. Return that chat instead of leaking a duplicate-key 500.
    if (error?.code === 11000) {
      chat = await Chat.findOne({
        workRequest: resolvedWorkRequestId,
        professional: resolvedProfessionalId,
      });
    } else {
      throw error;
    }
  }

  return chat;
};

export const getMyChats = async (userId) => {
  return await Chat.find({
    $or: [
      { customer: userId },
      { professional: userId },
    ],
    status: "active",
  })
    .populate("customer", "name email phone profileImage")
    .populate("professional", "name email phone profileImage professionalProfile")
    .populate(
      "workRequest",
      "requestId title status location category"
    )
    .populate("quote")
    .populate("booking")
    .populate("lastMessage")
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });
};

export const getChatById = async (
  chatId,
  userId
) => {
  const chat = await Chat.findById(chatId)
    .populate("customer", "name email phone profileImage")
    .populate("professional", "name email phone profileImage professionalProfile")
    .populate(
      "workRequest",
      "requestId title description status location category"
    )
    .populate("quote")
    .populate("booking")
    .populate("lastMessage");

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const isParticipant =
    chat.customer._id.toString() === userId.toString() ||
    chat.professional._id.toString() === userId.toString();

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant in this chat"
    );
  }

  return chat;
};

export const getChatMessages = async (
  chatId,
  userId
) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const isParticipant =
    chat.customer.toString() === userId.toString() ||
    chat.professional.toString() === userId.toString();

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant in this chat"
    );
  }

  return await Message.find({
    chat: chatId,
    isDeleted: false,
  })
    .populate("sender", "name email profileImage")
    .sort({ createdAt: 1 });
};

export const createMessage = async ({
  chatId,
  senderId,
  type = "text",
  content = "",
  media = null,
  quoteUpdate = null,
}) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  if (chat.status !== "active") {
    throw new ApiError(
      400,
      "This chat is not active"
    );
  }

  const isParticipant =
    chat.customer.toString() === senderId.toString() ||
    chat.professional.toString() === senderId.toString();

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant in this chat"
    );
  }

  if (
    type === "text" &&
    !content?.trim()
  ) {
    throw new ApiError(
      400,
      "Message content cannot be empty"
    );
  }

  if (
    type === "quote_update" &&
    !quoteUpdate
  ) {
    throw new ApiError(
      400,
      "Quote update details are required"
    );
  }

  const message = await Message.create({
    chat: chatId,
    sender: senderId,
    type,
    content: content?.trim() || "",
    media,
    quoteUpdate,
  });

  chat.lastMessage = message._id;
  chat.lastMessageAt = message.createdAt;

  await chat.save();

  return await Message.findById(
    message._id
  ).populate("sender", "name email profileImage");
};

export const markChatAsRead = async (chatId, userId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new ApiError(403, "You are not a participant in this chat");
  }

  await Message.updateMany(
    { chat: chatId, sender: { $ne: userId }, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return { chatId, userId };
};
