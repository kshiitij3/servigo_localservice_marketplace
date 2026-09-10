import api from "./api";

export const createBooking = (data) =>
  api.post("/bookings", data);

export const getMyBookings = () =>
  api.get("/bookings/my");

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, {
    status,
  });
