const ServiceSearch = ({ service, location, setService, setLocation, onFind, onUseLocation }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-7">
    <p className="mb-5 text-lg font-bold">Find the right professional</p>
    <label className="mb-2 block text-sm font-medium text-gray-600">What service do you need?</label>
    <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 focus-within:border-[#1a7a6e] focus-within:ring-2 focus-within:ring-[#1a7a6e]/20"><span className="text-lg">⌕</span><input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Plumbing or Cleaning" className="w-full outline-none" /></div>
    <label className="mb-2 block text-sm font-medium text-gray-600">Where do you need it?</label>
    <div className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 focus-within:border-[#1a7a6e] focus-within:ring-2 focus-within:ring-[#1a7a6e]/20"><span className="text-lg">📍</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or neighbourhood" className="w-full outline-none" /></div>
    <button onClick={onUseLocation} className="mb-6 text-sm font-semibold text-[#1a7a6e] hover:underline">📍 Use my current location</button>
    <button onClick={onFind} className="w-full rounded-lg bg-[#1a7a6e] py-3.5 font-bold text-white hover:bg-[#145f56]">Find Professionals <span className="ml-2">→</span></button>
  </div>
);

export default ServiceSearch;
