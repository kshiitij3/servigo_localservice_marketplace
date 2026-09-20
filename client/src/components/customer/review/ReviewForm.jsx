import { useState } from "react";
import { toast } from "react-hot-toast";
import { HiStar } from "react-icons/hi2";

import RatingStars from "./RatingStars";
import ReviewImageUpload from "./ReviewImageUpload";
import { createReview } from "../../../services/review.service";

const RATING_LABELS = {
  1: "Very poor",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const ReviewForm = ({ bookingId, professionalName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReview({
        booking: bookingId,
        rating,
        review: review.trim(),
        images,
      });

      toast.success("Review submitted successfully");
      onSuccess?.(response?.data);
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0">
          <HiStar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Leave a Review</h2>
          <p className="text-sm text-gray-500">
            How was your experience with{" "}
            <span className="font-semibold text-gray-700">
              {professionalName || "the professional"}
            </span>
            ?
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Your rating <span className="text-red-400">*</span>
        </label>

        <RatingStars value={rating} onChange={setRating} size="text-4xl" />

        {rating > 0 && (
          <p className="text-sm font-medium text-[#1a7a6e] mt-2">
            {RATING_LABELS[rating]}
          </p>
        )}
      </div>

      {/* Review text */}
      <div className="mb-6">
        <label
          htmlFor="review-text"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Your review
        </label>

        <textarea
          id="review-text"
          rows={5}
          maxLength={1000}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us about your experience..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:ring-2 focus:ring-[#1a7a6e]/30 focus:border-[#1a7a6e] text-sm transition"
        />

        <p className="text-xs text-gray-400 mt-1 text-right">
          {review.length}/1000
        </p>
      </div>

      {/* Image upload */}
      <div className="mb-7">
        <ReviewImageUpload images={images} setImages={setImages} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="btn-submit-review"
        disabled={submitting || !rating}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-md shadow-teal-900/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
