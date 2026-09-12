import { useState } from "react";
import { HiLockClosed, HiLanguage, HiGlobeAlt } from "react-icons/hi2";
import useAuth from "../../../hooks/useAuth";

const AccountSettings = () => {
  const { user } = useAuth();

  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  return (
    <div className="space-y-5">
      {/* Email Address */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Email Address
        </label>

        <div className="relative">
          <HiLockClosed className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/80 text-gray-500 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Your email address is linked to your account credentials.
        </p>
      </div>

      {/* Language Preference */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Preferred Language
        </label>

        <div className="relative">
          <HiLanguage className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] bg-white transition cursor-pointer"
          >
            <option value="English">English (Default)</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      {/* Timezone Preference */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Timezone
        </label>

        <div className="relative">
          <HiGlobeAlt className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] bg-white transition cursor-pointer"
          >
            <option value="Asia/Kolkata">India Standard Time (IST, UTC+5:30)</option>
            <option value="Asia/Dubai">Gulf Standard Time (GST, UTC+4:00)</option>
            <option value="UTC">Coordinated Universal Time (UTC)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
