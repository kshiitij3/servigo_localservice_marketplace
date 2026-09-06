const RequestDetailsSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-5 w-36 bg-gray-200 rounded-md mb-6" />

      {/* Header skeleton */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-3 flex-1">
            <div className="h-8 w-72 bg-gray-200 rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-10 w-32 bg-gray-100 rounded-xl" />
            <div className="h-10 w-24 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description skeleton */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-3">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-4/5 bg-gray-100 rounded" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>

          {/* Location skeleton */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-gray-50 rounded-xl" />
              <div className="h-12 bg-gray-50 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded pb-2 border-b border-gray-100" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-50 rounded-lg" />
              <div className="h-10 bg-gray-50 rounded-lg" />
              <div className="h-10 bg-gray-50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsSkeleton;
