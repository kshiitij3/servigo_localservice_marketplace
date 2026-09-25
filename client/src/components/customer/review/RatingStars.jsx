const RatingStars = ({
  value = 0,
  onChange,
  size = "text-2xl",
  readOnly = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={`${size} ${
              active ? "text-yellow-400" : "text-gray-300"
            } ${
              readOnly ? "cursor-default" : "hover:text-yellow-400"
            } transition`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
