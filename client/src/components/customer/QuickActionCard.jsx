const QuickActionCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200/80 bg-white p-5 text-left transition-all hover:border-[#1a7a6e]/40 hover:shadow-md group cursor-pointer"
    >
      <div className="mb-3.5 w-11 h-11 rounded-xl bg-teal-50 text-[#1a7a6e] border border-teal-100 flex items-center justify-center group-hover:bg-[#1a7a6e] group-hover:text-white group-hover:scale-105 transition-all">
        {typeof Icon === "function" || (typeof Icon === "object" && Icon !== null) ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span className="text-xl">{Icon}</span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1a7a6e] transition-colors">{title}</h3>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
    </button>
  );
};

export default QuickActionCard;
