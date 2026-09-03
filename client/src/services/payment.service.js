import api from "./api";

export const createPaymentOrder = async (booking) => {
  return await api.post(
    "/payments/create-order",
    { booking }
  );
};

export const verifyPayment = async (data) => {
  return await api.post(
    "/payments/verify",
    data
  );
};

export const onboardProfessional = async (data) => {
  return await api.post(
    "/payments/professional/onboard",
    data
  );
};
