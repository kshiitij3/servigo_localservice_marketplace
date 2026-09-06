const QuoteStatus = ({ status }) => {
  const styles = {
    submitted: "bg-blue-50 text-blue-700 border-blue-200/80",
    negotiating: "bg-amber-50 text-amber-700 border-amber-200/80",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    rejected: "bg-rose-50 text-rose-700 border-rose-200/80",
    withdrawn: "bg-gray-100 text-gray-600 border-gray-200/80",
  };

  const label =
    status
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Unknown";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {label}
    </span>
  );
};

export default QuoteStatus;
