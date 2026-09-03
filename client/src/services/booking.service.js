import api from "./api";

export const createBooking = async (data) => {
  return await api.post("/bookings", data);
};

export const updateBookingStatus = async (
  id,
  status
) => {
  return await api.patch(
    `/bookings/${id}/status`,
    { status }
  );
};
