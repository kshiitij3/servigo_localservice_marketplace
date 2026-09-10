import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiUser,
  HiEnvelope,
  HiPhone,
  HiCheckCircle,
  HiInformationCircle,
} from "react-icons/hi2";

import useAuth from "../../../hooks/useAuth";
import { updateProfile } from "../../../services/auth.service";

const ProfileForm = ({ user }) => {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    if (trimmedName.length < 3) {
      toast.error("Name must be at least 3 characters long.");
      return;
    }

    const payload = {
      name: trimmedName,
    };

    // Sanitize phone number if provided
    if (formData.phone && formData.phone.trim()) {
      const cleanedPhone = formData.phone.replace(/\D/g, "").slice(-10);
      if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
        toast.error("Please provide a valid 10-digit Indian mobile number.");
        return;
      }
      payload.phone = cleanedPhone;
    }

    try {
      setSaving(true);

      const response = await updateProfile(payload);
      const updatedUser = response?.data?.data || response?.data || null;

      if (updatedUser) {
        updateUser(updatedUser);
      }

      toast.success(
        response?.data?.message || "Profile updated successfully!"
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMsg =
        error?.response?.data?.data?.errors?.[0]?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile.";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Edit Profile
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Keep your account and contact information up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiUser className="w-4 h-4 text-[#1a7a6e]" />
            <span>Full Name</span>
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiEnvelope className="w-4 h-4 text-[#1a7a6e]" />
            <span>Email Address</span>
          </label>

          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50 cursor-not-allowed"
          />

          <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
            <HiInformationCircle className="w-3.5 h-3.5" />
            <span>Email is managed securely through your authentication account.</span>
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HiPhone className="w-4 h-4 text-[#1a7a6e]" />
            <span>Phone Number</span>
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition bg-gray-50/50 focus:bg-white"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-sm transition shadow-sm shadow-teal-900/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <HiCheckCircle className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileForm;
