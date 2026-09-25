import RatingStars from "./RatingStars";

const ReviewCard = ({ review }) => {
  const initial =
    review?.customer?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
      {/* Author + Rating Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-[#1a7a6e] text-sm">{initial}</span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {review?.customer?.name || "Customer"}
            </h3>

            <p className="text-xs text-gray-400 mt-0.5">
              {review?.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>

        <RatingStars value={review?.rating || 0} readOnly size="text-base" />
      </div>

      {/* Review text */}
      {review?.review && (
        <p className="text-sm text-gray-600 mt-4 leading-relaxed whitespace-pre-wrap">
          {review.review}
        </p>
      )}

      {/* Images */}
      {review?.images?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {review.images.map((image, index) => (
            <img
              key={image.publicId || index}
              src={image.url}
              alt={`Review photo ${index + 1}`}
              className="w-full aspect-square object-cover rounded-xl border border-gray-100"
            />
          ))}
        </div>
      )}

      {/* Edited badge */}
      {review?.isEdited && (
        <p className="text-xs text-gray-400 mt-3 italic">Edited</p>
      )}
    </div>
  );
};

export default ReviewCard;
