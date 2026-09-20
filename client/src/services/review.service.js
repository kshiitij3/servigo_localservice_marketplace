import api from "./api";

export const createReview = (data) =>
  api.post("/reviews", data);

export const getProfessionalReviews = (
  professionalId,
  params = {}
) =>
  api.get(
    `/reviews/professional/${professionalId}`,
    { params }
  );

export const getBookingReview = (bookingId) =>
  api.get(`/reviews/booking/${bookingId}`);

export const updateReview = (reviewId, data) =>
  api.put(`/reviews/${reviewId}`, data);
