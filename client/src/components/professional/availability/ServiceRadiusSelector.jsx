import { useState, useEffect } from "react";
import { HiCheck, HiSignal, HiSparkles } from "react-icons/hi2";

const radiusPresets = [5, 10, 20, 35, 50, 75];

const ServiceRadiusSelector = ({
  initialRadius = 10,
  onSave,
  loading = false,
}) => {
  const [radius, setRadius] = useState(initialRadius);

  useEffect(() => {
    if (initialRadius) {
      setRadius(initialRadius);
    }
  }, [initialRadius]);

  const handleChange = (e) => {
    setRadius(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(radius);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1a7a6e] animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900">
            Service Coverage Radius
          </h2>
        </div>

        <p className="text-gray-500 text-sm mt-1">
          Choose the maximum distance you are willing to travel from your base location for customer requests.
        </p>
      </div>

      {/* Preset Quick Select Buttons */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {radiusPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setRadius(preset)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                radius === preset
                  ? "bg-teal-50 border-teal-300 text-[#1a7a6e] ring-2 ring-teal-500/20 shadow-xs"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              {preset} km
            </button>
          ))}
        </div>
      </div>

      {/* Range Slider Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <HiSignal className="w-4 h-4 text-[#1a7a6e]" />
            <span>Maximum Travel Distance</span>
          </label>

          <span className="inline-flex items-center gap-1 text-2xl font-black text-[#1a7a6e]">
            {radius} <span className="text-sm font-semibold text-gray-500">km</span>
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={radius}
          onChange={handleChange}
          className="w-full mt-5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a7a6e]"
        />

        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
          <span>1 km (Local neighborhood)</span>
          <span>50 km</span>
          <span>100 km (Regional)</span>
        </div>
      </div>

      {/* Coverage Preview Callout */}
      <div className="mt-6 bg-teal-50/70 border border-teal-200/70 rounded-xl p-4 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#1a7a6e] flex items-center justify-center shrink-0 mt-0.5">
          <HiSparkles className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          You will automatically discover and match with customer service requests within approximately{" "}
          <strong className="text-gray-900 font-bold">{radius} km</strong> of your current detected GPS location.
        </p>
      </div>

      {/* Save Button */}
      <div className="mt-7 flex items-center justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a7a6e] hover:bg-[#155f55] text-white rounded-xl font-semibold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Radius...</span>
            </>
          ) : (
            <>
              <HiCheck className="w-4 h-4" />
              <span>Save Service Radius</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceRadiusSelector;
