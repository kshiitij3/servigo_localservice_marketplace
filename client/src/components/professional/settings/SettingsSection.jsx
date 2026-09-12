const SettingsSection = ({ title, description, icon, children }) => {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs">
      <div className="mb-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#1a7a6e]">{icon}</span>}
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

export default SettingsSection;
