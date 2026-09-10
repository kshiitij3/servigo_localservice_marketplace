import {
  HiUser,
  HiEnvelope,
  HiPhone,
  HiShieldCheck,
} from "react-icons/hi2";

const ProfileCard = ({ user }) => {
  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "C";

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col items-center text-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || "Customer avatar"}
            className="w-24 h-24 rounded-full object-cover border-4 border-teal-50 shadow-sm"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center text-3xl font-black shadow-sm ring-4 ring-teal-50">
            {initial}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          {user?.name || "Customer"}
        </h2>

        <p className="text-sm text-gray-500 mt-0.5">
          {user?.email || "Email not available"}
        </p>

        <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#1a7a6e] text-xs font-bold uppercase tracking-wider border border-teal-100/80">
          <HiShieldCheck className="w-4 h-4 text-[#1a7a6e]" />
          <span>Verified Customer</span>
        </span>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiUser className="w-3.5 h-3.5 text-gray-400" />
            <span>Full Name</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {user?.name || "Not available"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiEnvelope className="w-3.5 h-3.5 text-gray-400" />
            <span>Email Address</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
            {user?.email || "Not available"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiPhone className="w-3.5 h-3.5 text-gray-400" />
            <span>Phone Number</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {user?.phone || "Not added"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
