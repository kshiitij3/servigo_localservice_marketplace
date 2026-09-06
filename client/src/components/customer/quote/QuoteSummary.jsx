const QuoteSummary = ({ quote }) => {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const duration =
    quote?.estimatedDuration?.value
      ? `${quote.estimatedDuration.value} ${quote.estimatedDuration.unit}`
      : "Not specified";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      <div>
        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">
          Initial Amount
        </p>

        <p className="font-semibold text-gray-900 mt-1">
          {formatAmount(quote?.initialAmount)}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">
          Current Amount
        </p>

        <p className="text-xl font-bold text-[#1a7a6e] mt-1">
          {formatAmount(quote?.amount)}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">
          Estimated Duration
        </p>

        <p className="font-semibold text-gray-700 mt-1">
          {duration}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">
          Available Date
        </p>

        <p className="font-semibold text-gray-700 mt-1">
          {formatDate(quote?.availableDate)}
        </p>
      </div>
    </div>
  );
};

export default QuoteSummary;
