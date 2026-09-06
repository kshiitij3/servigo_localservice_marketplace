import {
  HiMapPin,
  HiChatBubbleLeftEllipsis,
  HiCalendarDays,
  HiCheckCircle,
} from "react-icons/hi2";

const ProfessionalStats = ({
  nearbyJobs = 0,
  quotes = 0,
  activeBookings = 0,
  completedJobs = 0,
}) => {
  const stats = [
    {
      title: "Nearby Jobs",
      value: nearbyJobs,
      description: "Jobs available near you",
      icon: HiMapPin,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "My Quotes",
      value: quotes,
      description: "Quotes you have submitted",
      icon: HiChatBubbleLeftEllipsis,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Bookings",
      value: activeBookings,
      description: "Current jobs",
      icon: HiCalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      description: "Jobs completed",
      icon: HiCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {stat.title}
              </p>
              {Icon && (
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {stat.value}
            </h3>

            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfessionalStats;
