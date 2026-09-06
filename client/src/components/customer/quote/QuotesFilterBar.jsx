import { HiArrowsUpDown } from "react-icons/hi2";

const QuotesFilterBar = ({
  totalQuotes,
  statusFilter,
  onFilterChange,
  hasAcceptedQuote,
  sortBy,
  onSortChange,
}) => {
  const tabs = [
    { label: `All (${totalQuotes})`, value: "all" },
    { label: "Actionable", value: "submitted" },
    { label: "Negotiating", value: "negotiating" },
    ...(hasAcceptedQuote
      ? [{ label: "Accepted (1)", value: "accepted" }]
      : []),
  ];

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1">
          Filter:
        </span>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onFilterChange(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              statusFilter === tab.value
                ? "bg-[#1a7a6e] text-white font-semibold shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <HiArrowsUpDown className="w-4 h-4 text-gray-400" />
        <label
          htmlFor="sort-quotes"
          className="text-xs text-gray-500 font-medium"
        >
          Sort:
        </label>
        <select
          id="sort-quotes"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort quotes by criteria"
          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a7a6e]"
        >
          <option value="amount_asc">Lowest Price First</option>
          <option value="amount_desc">Highest Price First</option>
          <option value="rating_desc">Highest Professional Rating</option>
          <option value="duration_asc">Shortest Duration</option>
        </select>
      </div>
    </div>
  );
};

export default QuotesFilterBar;
