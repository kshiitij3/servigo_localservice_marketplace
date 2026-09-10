import api from "./api";

export const register = async (data) => {
  return await api.post("/auth/register", data);
};

export const login = async (data) => {
  return await api.post("/auth/login", data);
};

export const logout = async () => {
  return await api.post("/auth/logout");
};

export const updateProfile = async (data) => {
  return await api.put("/auth/update-profile", data);
};

