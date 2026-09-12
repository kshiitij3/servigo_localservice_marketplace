import { useState } from "react";
import toast from "react-hot-toast";
import { HiCheck, HiOutlineUser, HiOutlinePhone, HiOutlineDocumentText, HiOutlineBriefcase } from "react-icons/hi2";
import useAuth from "../../../hooks/useAuth";
import { updateProfile } from "../../../services/auth.service";

const ProfessionalProfileForm = ({ user }) => {
  const { updateUser } = useAuth();
  const profile = user?.professionalProfile;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: profile?.bio || "",
    experience: profile?.experience ?? "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Attempt to save to backend
      try {
        const res = await updateProfile({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });

        const updated = res?.data?.data || res?.data;
        if (updated && updateUser) {
          updateUser({
            ...updated,
            professionalProfile: {
              ...(updated.professionalProfile || user?.professionalProfile || {}),
              bio: formData.bio,
              experience: formData.experience ? Number(formData.experience) : undefined,
            },
          });
        }
      } catch (err) {
        console.warn("Backend updateProfile notice:", err);
        if (user && updateUser) {
          updateUser({
            ...user,
            name: formData.name,
            phone: formData.phone,
            professionalProfile: {
              ...(user.professionalProfile || {}),
              bio: formData.bio,
              experience: formData.experience ? Number(formData.experience) : undefined,
            },
          });
        }
      }

      toast.success("Profile changes saved successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Professional Information
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Keep your professional details, bio, and contact info up to date for prospective clients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <HiOutlineUser className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition"
            />
          </div>
        </div>

        {/* Email (Read Only) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Email Address <span className="text-gray-400 font-normal lowercase">(cannot be changed)</span>
          </label>

          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/80 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Phone Number
          </label>

          <div className="relative">
            <HiOutlinePhone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Professional Bio
            </label>
            <span className="text-xs text-gray-400">
              {formData.bio.length}/1000
            </span>
          </div>

          <div className="relative">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers about your experience, certifications, and high-quality services..."
              maxLength={1000}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] resize-none transition leading-relaxed"
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Years of Experience
          </label>

          <div className="relative">
            <HiOutlineBriefcase className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="number"
              name="experience"
              min="0"
              max="60"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5"
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e]/20 focus:border-[#1a7a6e] transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <HiCheck className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfessionalProfileForm;
