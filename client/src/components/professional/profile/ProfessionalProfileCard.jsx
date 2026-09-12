import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  HiUser,
  HiEnvelope,
  HiPhone,
  HiShieldCheck,
  HiClock,
  HiSignal,
  HiBriefcase,
  HiStar,
  HiCamera,
  HiTrash,
} from "react-icons/hi2";

import useAuth from "../../../hooks/useAuth";
import { uploadMedia } from "../../../services/upload.service";
import { updateProfile } from "../../../services/auth.service";

const statusConfig = {
  available: {
    label: "Available",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Busy",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  unavailable: {
    label: "Unavailable",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const ProfessionalProfileCard = ({ user }) => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const profile = user?.professionalProfile;
  const initial = user?.name?.charAt(0)?.toUpperCase() || "P";
  const currentStatus = profile?.availabilityStatus || "available";
  const statusInfo = statusConfig[currentStatus] || statusConfig.available;

  // Cloudinary profile image URL
  const imageUrl = user?.profileImage?.url || user?.avatar || "";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 8MB.");
      return;
    }

    try {
      setUploading(true);
      const uploadToast = toast.loading("Uploading photo to Cloudinary...");

      // 1. Upload to Cloudinary via server upload endpoint
      const uploadRes = await uploadMedia(file);
      const uploadedData = uploadRes?.data?.data || uploadRes?.data;

      if (!uploadedData?.url) {
        throw new Error("Cloudinary upload failed: no URL returned");
      }

      // 2. Persist { url, publicId } to User model in MongoDB
      const updateRes = await updateProfile({
        profileImage: {
          url: uploadedData.url,
          publicId: uploadedData.publicId || "",
        },
      });

      const updatedUser = updateRes?.data?.data || updateRes?.data;

      // 3. Update AuthContext & localStorage for immediate UI reactivity
      if (updatedUser) {
        updateUser(updatedUser);
      } else if (user) {
        updateUser({
          ...user,
          profileImage: {
            url: uploadedData.url,
            publicId: uploadedData.publicId || "",
          },
        });
      }

      toast.dismiss(uploadToast);
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Profile photo upload failed:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!imageUrl) return;

    try {
      setUploading(true);
      const removeToast = toast.loading("Removing photo...");

      const updateRes = await updateProfile({
        profileImage: {
          url: "",
          publicId: "",
        },
      });

      const updatedUser = updateRes?.data?.data || updateRes?.data;

      if (updatedUser) {
        updateUser(updatedUser);
      } else if (user) {
        updateUser({
          ...user,
          profileImage: {
            url: "",
            publicId: "",
          },
        });
      }

      toast.dismiss(removeToast);
      toast.success("Profile photo removed.");
    } catch (error) {
      console.error("Failed to remove profile photo:", error);
      toast.error("Failed to remove profile photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Hidden File Input for Cloudinary Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Header Avatar & Identity */}
      <div className="flex flex-col items-center text-center">
        <div className="relative group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={user?.name || "Professional avatar"}
              className={`w-24 h-24 rounded-full object-cover border-4 border-teal-50 shadow-sm transition-opacity ${
                uploading ? "opacity-40" : "opacity-100"
              }`}
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center text-3xl font-black shadow-sm ring-4 ring-teal-50 transition-opacity ${
                uploading ? "opacity-40" : "opacity-100"
              }`}
            >
              {initial}
            </div>
          )}

          {/* Upload Spinner Overlay */}
          {uploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-xs">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Camera Button Overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Upload new profile photo"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1a7a6e] hover:bg-[#155f55] text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-90 cursor-pointer disabled:opacity-50"
          >
            <HiCamera className="w-4 h-4" />
          </button>
        </div>

        {/* Action link for photo management */}
        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs font-semibold text-[#1a7a6e] hover:underline cursor-pointer disabled:opacity-50"
          >
            {imageUrl ? "Change Photo" : "Upload Photo"}
          </button>

          {imageUrl && (
            <>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={uploading}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <HiTrash className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </>
          )}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mt-3 tracking-tight">
          {user?.name || "Professional"}
        </h2>

        <p className="text-sm text-gray-500 mt-0.5 break-all">
          {user?.email || "Email not available"}
        </p>

        <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#1a7a6e] text-xs font-bold uppercase tracking-wider border border-teal-200/60">
          <HiShieldCheck className="w-4 h-4 text-[#1a7a6e]" />
          <span>Verified Professional</span>
        </span>
      </div>

      {/* Details List */}
      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiPhone className="w-3.5 h-3.5 text-gray-400" />
            <span>Phone Number</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {user?.phone || "Not added"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>Availability Status</span>
          </span>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              <span>{statusInfo.label}</span>
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiSignal className="w-3.5 h-3.5 text-gray-400" />
            <span>Service Radius</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {profile?.serviceRadius || 10} km
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiBriefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>Experience</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {profile?.experience ? `${profile.experience} years` : "Not added"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <HiStar className="w-3.5 h-3.5 text-amber-500" />
            <span>Rating</span>
          </span>
          <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1">
            {profile?.averageRating ? (
              <>
                <span className="text-amber-500 font-bold">★</span>
                <span>{profile.averageRating.toFixed(1)}</span>
                <span className="text-gray-400 text-xs font-normal">
                  ({profile.totalReviews || 0} reviews)
                </span>
              </>
            ) : (
              <span className="text-gray-400 font-normal">No ratings yet</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalProfileCard;
