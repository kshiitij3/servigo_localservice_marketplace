import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createReview,
  getProfessionalReviews,
  getBookingReview,
  updateReview,
} from "../services/review.service.js";

export const create = asyncHandler(async (req, res) => {
  const { booking, rating, review, images } = req.body;

  const result = await createReview({
    customerId: req.user._id,
    bookingId: booking,
    rating,
    review,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Review created successfully", result));
});

export const getProfessional = asyncHandler(async (req, res) => {
  const result = await getProfessionalReviews(
    req.params.professionalId,
    req.query.page,
    req.query.limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Professional reviews fetched successfully", result)
    );
});

export const getForBooking = asyncHandler(async (req, res) => {
  const result = await getBookingReview(req.params.bookingId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Booking review fetched successfully", result));
});

export const update = asyncHandler(async (req, res) => {
  const { rating, review, images } = req.body;

  const result = await updateReview(req.params.id, req.user._id, {
    rating,
    review,
    images,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Review updated successfully", result));
});
