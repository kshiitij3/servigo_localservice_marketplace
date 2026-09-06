const QuickActionCard = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white border border-gray-200/80 rounded-2xl p-6 text-left hover:shadow-md hover:border-[#1a7a6e]/50 active:scale-[0.99] transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1a7a6e] transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1a7a6e] group-hover:translate-x-1 transition-transform">
        <span>Explore</span>
        <span>→</span>
      </div>
    </button>
  );
};

export default QuickActionCard;
