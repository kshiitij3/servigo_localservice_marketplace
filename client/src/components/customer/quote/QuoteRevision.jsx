const QuoteRevision = ({ revision, number }) => {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="border-l-4 border-[#1a7a6e] bg-gray-50/80 rounded-r-xl p-4 shadow-xs">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <p className="font-semibold text-gray-900">
          Revision {number}
        </p>

        <p className="text-xs text-gray-500 font-medium">
          {formatDate(revision?.createdAt)}
        </p>
      </div>

      <p className="text-lg font-bold text-[#1a7a6e] mt-2">
        {formatAmount(revision?.amount)}
      </p>

      {revision?.message && (
        <p className="text-sm text-gray-600 mt-2 leading-6 whitespace-pre-wrap">
          {revision.message}
        </p>
      )}
    </div>
  );
};

export default QuoteRevision;
