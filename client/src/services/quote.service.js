import api from "./api";

export const createQuote = async (data) => {
  return await api.post("/quotes", data);
};

export const getMyQuotes = async () => {
  return await api.get("/quotes/my");
};

export const getQuotesForWorkRequest = async (
  workRequestId
) => {
  return await api.get(
    `/quotes/work-request/${workRequestId}`
  );
};

export const updateQuote = async (id, data) => {
  return await api.put(`/quotes/${id}`, data);
};

export const acceptQuote = async (id) => {
  return await api.patch(`/quotes/${id}/accept`);
};

export const getQuoteById = async (id) => {
  return await api.get(`/quotes/${id}`);
};

