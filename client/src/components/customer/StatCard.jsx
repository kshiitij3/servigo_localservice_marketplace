const StatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#1a7a6e] border border-teal-100 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <h3 className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
