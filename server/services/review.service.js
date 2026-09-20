import mongoose from "mongoose";

import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

import ApiError from "../utils/ApiError.js";

// ─── Helpers ───────────────────────────────────────────────────────────────

const validateObjectId = (id, fieldName) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

const validateRating = (rating) => {
  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new ApiError(400, "Rating must be an integer between 1 and 5");
  }

  return numericRating;
};

const normalizeImages = (images) => {
  if (!images) {
    return [];
  }

  if (!Array.isArray(images)) {
    throw new ApiError(400, "Images must be an array");
  }

  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images are allowed");
  }

  return images.map((image) => {
    if (!image?.url) {
      throw new ApiError(400, "Each image must contain a URL");
    }

    return {
      url: image.url,
      publicId: image.publicId || "",
    };
  });
};

// ─── Services ──────────────────────────────────────────────────────────────

export const createReview = async ({
  customerId,
  bookingId,
  rating,
  review = "",
  images = [],
}) => {
  validateObjectId(bookingId, "booking id");

  const numericRating = validateRating(rating);

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  /*
   * Only the customer who owns the booking can review it.
   */
  if (booking.customer.toString() !== customerId.toString()) {
    throw new ApiError(403, "You are not allowed to review this booking");
  }

  /*
   * Review is allowed after the booking is completed/closed.
   *
   * Payment is also accepted as proof that the service
   * lifecycle has completed.
   */
  if (booking.status !== "closed" && booking.paymentStatus !== "paid") {
    throw new ApiError(
      400,
      "Review is available after the booking is completed"
    );
  }

  /*
   * One review per booking.
   */
  const existingReview = await Review.findOne({ booking: bookingId });

  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this booking");
  }

  const normalizedImages = normalizeImages(images);

  const newReview = await Review.create({
    booking: booking._id,
    customer: booking.customer,
    professional: booking.professional,
    rating: numericRating,
    review: review.trim(),
    images: normalizedImages,
  });

  /*
   * Mark the booking as reviewed so the UI can reflect
   * that a review already exists without a separate query.
   */
  await Booking.findByIdAndUpdate(bookingId, {
    isReviewed: true,
    review: newReview._id,
  });

  return Review.findById(newReview._id)
    .populate("customer", "name email")
    .populate("professional", "name email")
    .populate("booking", "bookingId agreedAmount status");
};

// ───────────────────────────────────────────────────────────────────────────

export const getProfessionalReviews = async (
  professionalId,
  page = 1,
  limit = 10
) => {
  validateObjectId(professionalId, "professional id");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(50, Math.max(1, Number(limit) || 10));

  const skip = (page - 1) * limit;

  const filter = { professional: professionalId };

  const [reviews, total, summary] = await Promise.all([
    Review.find(filter)
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),

    Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
  ]);

  const ratingSummary = summary[0] || {
    averageRating: 0,
    totalReviews: 0,
  };

  return {
    reviews,

    summary: {
      averageRating: Number(ratingSummary.averageRating.toFixed(1)),
      totalReviews: ratingSummary.totalReviews,
    },

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ───────────────────────────────────────────────────────────────────────────

export const getBookingReview = async (bookingId, customerId) => {
  validateObjectId(bookingId, "booking id");

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.customer.toString() !== customerId.toString()) {
    throw new ApiError(403, "You are not allowed to access this review");
  }

  return Review.findOne({ booking: bookingId, customer: customerId })
    .populate("professional", "name email")
    .populate("booking", "bookingId status");
};

// ───────────────────────────────────────────────────────────────────────────

export const updateReview = async (
  reviewId,
  customerId,
  { rating, review, images }
) => {
  validateObjectId(reviewId, "review id");

  const existingReview = await Review.findById(reviewId);

  if (!existingReview) {
    throw new ApiError(404, "Review not found");
  }

  if (existingReview.customer.toString() !== customerId.toString()) {
    throw new ApiError(403, "You are not allowed to update this review");
  }

  if (rating !== undefined) {
    existingReview.rating = validateRating(rating);
  }

  if (review !== undefined) {
    existingReview.review = review.trim();
  }

  if (images !== undefined) {
    existingReview.images = normalizeImages(images);
  }

  existingReview.isEdited = true;
  existingReview.editedAt = new Date();

  await existingReview.save();

  return Review.findById(existingReview._id)
    .populate("customer", "name")
    .populate("professional", "name")
    .populate("booking", "bookingId status");
};
