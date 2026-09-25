import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createOrGetChat,
  getMyChats as fetchMyChats,
  getChatById,
  getChatMessages,
  markChatAsRead as markMessagesAsRead,
} from "../services/chat.service.js";

export const create = asyncHandler(
  async (req, res) => {
    const quoteId = req.body.quote || req.body.quoteId;
    const {
      professional,
      workRequest,
    } = req.body;

    const chat = await createOrGetChat({
      userId: req.user._id,
      customerId: req.user.role === "customer" ? req.user._id : undefined,
      professionalId: professional || (req.user.role === "professional" ? req.user._id : undefined),
      workRequestId: workRequest,
      quoteId,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Chat created successfully",
          chat
        )
      );
  }
);

export const getMyChats = asyncHandler(
  async (req, res) => {
    const chats = await fetchMyChats(
      req.user._id
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Chats fetched successfully",
          chats
        )
      );
  }
);

export const getById = asyncHandler(
  async (req, res) => {
    const chat = await getChatById(
      req.params.id,
      req.user._id
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Chat fetched successfully",
          chat
        )
      );
  }
);

export const getMessages = asyncHandler(
  async (req, res) => {
    const messages =
      await getChatMessages(
        req.params.id,
        req.user._id
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Messages fetched successfully",
          messages
        )
      );
  }
);

export const markAsRead = asyncHandler(async (req, res) => {
  const result = await markMessagesAsRead(req.params.id, req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Chat marked as read", result)
  );
});
