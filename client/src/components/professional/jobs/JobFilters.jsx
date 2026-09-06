import { HiAdjustmentsHorizontal, HiTag, HiMapPin, HiArrowPath } from "react-icons/hi2";

const JobFilters = ({
  radius,
  setRadius,
  categoryId,
  setCategoryId,
  categories = [],
  onReset,
}) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
        <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <HiAdjustmentsHorizontal className="w-5 h-5 text-[#1a7a6e]" />
          <span>Filters</span>
        </h2>

        {(categoryId || radius !== 25) && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a6e] hover:underline cursor-pointer"
          >
            <HiArrowPath className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Radius Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <HiMapPin className="w-4 h-4 text-gray-400" />
              <span>Max Distance</span>
            </label>

            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1a7a6e] border border-teal-200/60">
              {radius} km
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-[#1a7a6e] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-medium text-gray-400 mt-1.5">
            <span>5 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiTag className="w-4 h-4 text-gray-400" />
            <span>Service Category</span>
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition cursor-pointer"
          >
            <option value="">All Categories ({categories.length})</option>

            {categories.map((category) => (
              <option key={category._id || category.slug} value={category._id || category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
