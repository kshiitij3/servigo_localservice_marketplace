import RatingStars from "./RatingStars";

const ReviewSummary = ({ summary }) => {
  const avg = Number(summary?.averageRating || 0).toFixed(1);
  const total = summary?.totalReviews || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Customer Rating
      </p>

      <div className="flex items-center gap-4 mt-3">
        <span className="text-4xl font-black text-gray-900">{avg}</span>

        <div>
          <RatingStars
            value={Math.round(summary?.averageRating || 0)}
            readOnly
            size="text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            {total} {total === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
