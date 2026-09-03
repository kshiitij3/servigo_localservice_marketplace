import api from "./api";

export const createWorkRequest = async (data) => {
  return await api.post("/work-requests", data);
};

export const getMyWorkRequests = async () => {
  return await api.get("/work-requests/my");
};

export const getWorkRequestById = async (id) => {
  return await api.get(`/work-requests/${id}`);
};

export const updateWorkRequest = async (id, data) => {
  return await api.put(`/work-requests/${id}`, data);
};

export const deleteWorkRequest = async (id) => {
  return await api.delete(`/work-requests/${id}`);
};

export const getNearbyWorkRequests = async (params) => {
  return await api.get("/work-requests/nearby", {
    params,
  });
};
