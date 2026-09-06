import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import {
  HiSquares2X2,
  HiMapPin,
  HiChatBubbleLeftEllipsis,
  HiCalendarDays,
  HiClock,
  HiUser,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";

const links = [
  { label: "Dashboard", path: "/professional/dashboard", icon: HiSquares2X2 },
  { label: "Nearby Jobs", path: "/professional/jobs", icon: HiMapPin },
  { label: "My Quotes", path: "/professional/quotes", icon: HiChatBubbleLeftEllipsis },
  { label: "Bookings", path: "/professional/bookings", icon: HiCalendarDays },
  { label: "Availability", path: "/professional/availability", icon: HiClock },
  { label: "Profile", path: "/professional/profile", icon: HiUser },
];

const ProfessionalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path) => {
    setMenuOpen(false);
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

  return (
    <nav className="border-b border-gray-200/80 bg-white sticky top-0 z-50 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go("/professional/dashboard")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-black tracking-[0.12em] text-[#1a7a6e]">
                SERVIGO
              </span>
            </button>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#1a7a6e] border border-teal-200/60 uppercase tracking-wider">
              Pro
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-50 text-[#1a7a6e] font-semibold"
                      : "text-gray-600 hover:text-[#1a7a6e] hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#1a7a6e]" : "text-gray-400"}`} />
                  <span>{label}</span>
                </button>
              );
            })}

            <div className="h-5 w-px bg-gray-200 mx-2" />

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              <HiArrowRightOnRectangle className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 lg:hidden">
          {links.map(({ label, path, icon: Icon }) => {
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

          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 text-red-500" />
              <span>Logout ({user?.name || "Account"})</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ProfessionalNavbar;
