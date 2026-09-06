const QuotesSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Skeleton Back button */}
      <div className="h-5 w-36 bg-gray-200 rounded-md mb-6" />

      {/* Skeleton Header Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-64 bg-gray-200 rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
          <div className="h-12 w-48 bg-gray-100 rounded-xl" />
        </div>
      </div>

      {/* Skeleton Quotes List */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesSkeleton;
