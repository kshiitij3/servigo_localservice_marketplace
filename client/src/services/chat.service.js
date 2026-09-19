import api from "./api";

export const createChat = (quote) =>
  api.post("/chats", {
    quote,
  });

export const getMyChats = () =>
  api.get("/chats/my");

export const getChatById = (id) =>
  api.get(`/chats/${id}`);

export const getChatMessages = (
  id,
  params = {}
) =>
  api.get(`/chats/${id}/messages`, {
    params,
  });

export const markChatAsRead = (id) =>
  api.patch(`/chats/${id}/read`);
