import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import {
  HiSquares2X2,
  HiClipboardDocumentList,
  HiCalendarDays,
  HiBell,
  HiUser,
  HiArrowRightOnRectangle
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";

const links = [
  { label: "Dashboard", path: "/customer/dashboard", icon: HiSquares2X2 },
  { label: "My Requests", path: "/customer/work-requests", icon: HiClipboardDocumentList },
  { label: "Bookings", path: "/customer/bookings", icon: HiCalendarDays },
  { label: "Notifications", path: "/customer/notifications", icon: HiBell },
  { label: "Profile", path: "/customer/profile", icon: HiUser },
];

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
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
          
          {/* Logo */}
          <button
            type="button"
            onClick={() => go("/customer/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-black tracking-[0.12em] text-[#1a7a6e]">
              SERVIGO
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden cursor-pointer"
          >
            {menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="space-y-1.5 pb-4 pt-2 border-t border-gray-100 md:hidden">
            {links.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => go(path)}
                  className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium ${
                    isActive
                      ? "bg-teal-50 text-[#1a7a6e]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#1a7a6e]" />
                  <span>{label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <HiArrowRightOnRectangle className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
