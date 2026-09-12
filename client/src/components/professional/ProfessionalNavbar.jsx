import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import {
  HiSquares2X2,
  HiMapPin,
  HiChatBubbleLeftEllipsis,
  HiCalendarDays,
  HiClock,
  HiGlobeAmericas,
  HiUser,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiChevronDown,
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";

// Core primary navigation tabs
const primaryLinks = [
  { label: "Dashboard", path: "/professional/dashboard", icon: HiSquares2X2 },
  { label: "Nearby Jobs", path: "/professional/jobs", icon: HiMapPin },
  { label: "My Quotes", path: "/professional/quotes", icon: HiChatBubbleLeftEllipsis },
  { label: "Bookings", path: "/professional/bookings", icon: HiCalendarDays },
];

// Profile & Configuration dropdown items
const accountLinks = [
  { label: "My Profile", path: "/professional/profile", icon: HiUser, desc: "Personal info & credentials" },
  { label: "Availability", path: "/professional/availability", icon: HiClock, desc: "Manage working status" },
  { label: "Service Area", path: "/professional/service-area", icon: HiGlobeAmericas, desc: "Coverage travel radius" },
  { label: "Settings", path: "/professional/settings", icon: HiCog6Tooth, desc: "Notifications & preferences" },
];

const statusStyles = {
  available: {
    label: "Available",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Busy",
    badge: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
  unavailable: {
    label: "Unavailable",
    badge: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    dot: "bg-rose-500",
  },
};

const ProfessionalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (path) => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "P";
  const avatarUrl = user?.profileImage?.url || user?.avatar || "";
  const currentStatus = user?.professionalProfile?.availabilityStatus || "available";
  const statusInfo = statusStyles[currentStatus] || statusStyles.available;

  const isAccountActive = accountLinks.some((l) => location.pathname === l.path);

  return (
    <nav className="border-b border-gray-200/80 bg-white sticky top-0 z-50 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => go("/professional/dashboard")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-black tracking-[0.12em] text-[#1a7a6e]">
                SERVIGO
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#1a7a6e] border border-teal-200/60 uppercase tracking-wider">
                Pro
              </span>
            </button>

            {/* Desktop Primary Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {primaryLinks.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => navigate(path)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-teal-50 text-[#1a7a6e] font-bold"
                        : "text-gray-600 hover:text-[#1a7a6e] hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#1a7a6e]" : "text-gray-400"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side: Availability Badge & Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Availability Status Pill */}
            <button
              type="button"
              onClick={() => navigate("/professional/availability")}
              title="Click to change availability status"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs ${statusInfo.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
              <span>{statusInfo.label}</span>
            </button>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Profile Menu Trigger Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                  profileDropdownOpen || isAccountActive
                    ? "border-teal-300 bg-teal-50/70 shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "Profile"}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-teal-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {initial}
                  </div>
                )}

                <span className="text-xs font-bold text-gray-800 max-w-[110px] truncate">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>

                <HiChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                    profileDropdownOpen ? "rotate-180 text-[#1a7a6e]" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-gray-200/90 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Identity Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-teal-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {initial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.name || "Professional"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email || "Signed in"}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="p-1.5 space-y-0.5">
                    {accountLinks.map(({ label, path, icon: Icon, desc }) => {
                      const isActive = location.pathname === path;
                      return (
                        <button
                          key={path}
                          type="button"
                          onClick={() => go(path)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            isActive
                              ? "bg-teal-50 text-[#1a7a6e] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? "bg-teal-100 text-[#1a7a6e]" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 leading-tight">
                              {label}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1.5 px-1.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                    >
                      <HiArrowRightOnRectangle className="w-4 h-4 text-red-500" />
                      <span>Log Out of Servigo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 md:hidden">
          {/* User Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-11 h-11 rounded-xl object-cover ring-1 ring-teal-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {initial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.name || "Professional"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                <span className="text-xs font-semibold text-gray-500">
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Work Tabs */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
              Work & Leads
            </p>
            <div className="space-y-0.5">
              {primaryLinks.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => go(path)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? "bg-teal-50 text-[#1a7a6e] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#1a7a6e]" : "text-gray-400"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences & Profile Tabs */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
              Account & Settings
            </p>
            <div className="space-y-0.5">
              {accountLinks.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => go(path)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? "bg-teal-50 text-[#1a7a6e] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#1a7a6e]" : "text-gray-400"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left transition-colors"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 text-red-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ProfessionalNavbar;
