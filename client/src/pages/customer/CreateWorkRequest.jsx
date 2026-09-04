import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiWrenchScrewdriver,
  HiCloudArrowUp,
  HiCurrencyRupee,
  HiCalendarDays,
  HiClock,
  HiRadio,
  HiExclamationTriangle,
  HiCheckCircle,
  HiBuildingOffice2,
  HiSparkles,
  HiXMark,
  HiTag,
  HiPhoto,
  HiVideoCamera
} from "react-icons/hi2";

import { getCategories } from "../../services/category.service";
import { createWorkRequest } from "../../services/workRequest.service";
import { uploadMedia } from "../../services/upload.service";
import LocationPicker from "../../components/map/LocationPicker";

const initialForm = {
  title: "",
  description: "",
  category: "",
  customCategory: "",
  budgetMin: "",
  budgetMax: "",
  preferredDate: "",
  startTime: "",
  endTime: "",
  visibilityRadius: 10,
  isUrgent: false,

  address: "",
  city: "",
  state: "",
  pincode: "",
};

const CreateWorkRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response?.data?.data || response?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Could not load service categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      toast.error("You can upload a maximum of 5 files in total.");
      return;
    }

    const invalidFile = selectedFiles.find((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      return !validTypes.includes(file.type);
    });

    if (invalidFile) {
      toast.error(
        "Only JPG, PNG, WEBP, MP4, WEBM, and MOV files are allowed."
      );
      return;
    }

    const tooLarge = selectedFiles.find(
      (file) => file.size > 50 * 1024 * 1024
    );

    if (tooLarge) {
      toast.error("Each file must be smaller than 50 MB.");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a service title.");
      return false;
    }

    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long.");
      return false;
    }

    if (formData.description.trim().length < 20) {
      toast.error(
        "Description must be at least 20 characters long."
      );
      return false;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return false;
    }

    const selectedCategory = categories.find(
      (cat) => cat._id === formData.category
    );

    if (
      selectedCategory?.slug === "other" &&
      !formData.customCategory.trim()
    ) {
      toast.error("Please specify your custom category.");
      return false;
    }

    if (
      formData.budgetMin &&
      formData.budgetMax &&
      Number(formData.budgetMin) > Number(formData.budgetMax)
    ) {
      toast.error(
        "Minimum budget cannot be greater than maximum budget."
      );
      return false;
    }

    if (!formData.preferredDate) {
      toast.error("Please select a preferred date.");
      return false;
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.startTime >= formData.endTime
    ) {
      toast.error("End time must be after start time.");
      return false;
    }

    if (!location.latitude || !location.longitude) {
      toast.error("Please select your service location on the map.");
      return false;
    }

    if (
      Number(formData.visibilityRadius) < 5 ||
      Number(formData.visibilityRadius) > 50
    ) {
      toast.error(
        "Visibility radius must be between 5 and 50 km."
      );
      return false;
    }

    return true;
  };

  const uploadFiles = async () => {
    const uploadedMedia = [];
    for (const file of files) {
      const response = await uploadMedia(file);
      if (response?.data) {
        uploadedMedia.push(response.data?.data || response.data);
      }
    }
    return uploadedMedia;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Creating your service request...", {
        id: "create-request",
      });

      let media = [];
      if (files.length > 0) {
        media = await uploadFiles();
      }

      const selectedCategory = categories.find(
        (cat) => cat._id === formData.category
      );

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        customCategory:
          selectedCategory?.slug === "other"
            ? formData.customCategory.trim()
            : undefined,
        media,
        location: {
          type: "Point",
          coordinates: [
            Number(location.longitude),
            Number(location.latitude),
          ],
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        budget: {
          min: formData.budgetMin ? Number(formData.budgetMin) : undefined,
          max: formData.budgetMax ? Number(formData.budgetMax) : undefined,
        },
        preferredDate: new Date(
          `${formData.preferredDate}T00:00:00`
        ).toISOString(),
        preferredTimeSlot:
          formData.startTime && formData.endTime
            ? {
                start: formData.startTime,
                end: formData.endTime,
              }
            : undefined,
        visibilityRadius: Number(formData.visibilityRadius),
        isUrgent: formData.isUrgent,
      };

      const response = await createWorkRequest(requestData);

      toast.success("Service request posted successfully!", {
        id: "create-request",
      });

      const responseData = response?.data?.data || response?.data;
      const requestId = responseData?._id || responseData?.id;

      if (requestId) {
        navigate(`/customer/work-requests/${requestId}`);
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Failed to create work request:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create service request.",
        {
          id: "create-request",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Header Banner */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/customer/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1a7a6e] hover:text-[#145f56] hover:underline mb-4 transition-all"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-gradient-to-r from-teal-900 via-[#1a7a6e] to-[#2a9d8f] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-3">
                <HiSparkles className="w-3.5 h-3.5" />
                Service Booking
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Post a Service Request
              </h1>
              <p className="text-teal-100/90 text-sm sm:text-base mt-2 max-w-xl">
                Describe your requirements, pick your location, set your budget, and connect with top verified local professionals.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Service Details */}
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center border border-teal-100">
                <HiWrenchScrewdriver className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Service Details
                </h2>
                <p className="text-xs text-gray-500">
                  Specify the type of job and explain the work clearly.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  What service do you need? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Kitchen sink repair or AC deep cleaning"
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${formData.description.length >= 20 ? "text-teal-600 font-medium" : "text-gray-400"}`}>
                    {formData.description.length}/2000 chars (min 20)
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue, required tools, materials needed, or specific preferences..."
                  rows={5}
                  maxLength={2000}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all placeholder:text-gray-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <HiTag className="w-4 h-4 text-[#1a7a6e]" />
                    <span>Category</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select service category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {categories.find((cat) => cat._id === formData.category)?.slug === "other" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Specify Service Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      placeholder="e.g. Home Automation Installation"
                      maxLength={100}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Photos & Videos Upload */}
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center border border-teal-100">
                <HiCloudArrowUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Photos & Media
                </h2>
                <p className="text-xs text-gray-500">
                  Upload images or short videos to clarify your request (Max 5 files, up to 50MB each).
                </p>
              </div>
            </div>

            {/* Custom Dropzone */}
            <div className="relative border-2 border-dashed border-teal-200 bg-teal-50/30 hover:bg-teal-50/60 rounded-2xl p-6 text-center transition-all cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-100/80 text-[#1a7a6e] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiCloudArrowUp className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  Click to upload or drag & drop files
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, WEBP, MP4, WEBM, MOV
                </p>
              </div>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Selected Files ({files.length}/5)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, idx) => {
                    const isVideo = file.type.startsWith("video/");
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 group"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#1a7a6e] flex items-center justify-center shrink-0">
                            {isVideo ? (
                              <HiVideoCamera className="w-4 h-4" />
                            ) : (
                              <HiPhoto className="w-4 h-4" />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove file"
                        >
                          <HiXMark className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Budget & Schedule */}
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center border border-teal-100">
                <HiCurrencyRupee className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Budget & Schedule
                </h2>
                <p className="text-xs text-gray-500">
                  Define your estimated budget range, preferred appointment date, and time slot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Min Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiCurrencyRupee className="w-4 h-4 text-[#1a7a6e]" />
                  <span>Minimum Budget (₹)</span>
                </label>
                <input
                  type="number"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 500"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              {/* Max Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiCurrencyRupee className="w-4 h-4 text-[#1a7a6e]" />
                  <span>Maximum Budget (₹)</span>
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 1500"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiCalendarDays className="w-4 h-4 text-[#1a7a6e]" />
                  <span>Preferred Date</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              {/* Visibility Radius */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <HiRadio className="w-4 h-4 text-[#1a7a6e]" />
                    <span>Visibility Radius</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#1a7a6e] font-bold text-xs">
                    {formData.visibilityRadius} km
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-gray-500 font-medium">5 km</span>
                  <input
                    type="range"
                    name="visibilityRadius"
                    min="5"
                    max="50"
                    value={formData.visibilityRadius}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a7a6e]"
                  />
                  <span className="text-xs text-gray-500 font-medium">50 km</span>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiClock className="w-4 h-4 text-[#1a7a6e]" />
                  <span>Start Time</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiClock className="w-4 h-4 text-[#1a7a6e]" />
                  <span>End Time</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Urgency Highlight Card */}
            <div className={`mt-6 p-4 rounded-xl border transition-all ${formData.isUrgent ? "bg-amber-50/80 border-amber-300 shadow-xs" : "bg-gray-50 border-gray-200"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-md text-[#1a7a6e] focus:ring-[#1a7a6e] mt-0.5 cursor-pointer accent-[#1a7a6e]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${formData.isUrgent ? "text-amber-900" : "text-gray-900"}`}>
                      Mark as Urgent Job
                    </p>
                    {formData.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold">
                        <HiExclamationTriangle className="w-3 h-3 text-amber-700" /> High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Urgent requests are highlighted to nearby service professionals for faster responses.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Section 4: Location & Address */}
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8">
            <LocationPicker
              value={location}
              onChange={setLocation}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-6 border-t border-gray-100">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <HiBuildingOffice2 className="w-4 h-4 text-[#1a7a6e]" />
                  <span>Street Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat/House No, Building, Street Name, Area"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 411001"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a7a6e] focus:border-[#1a7a6e] focus:outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Form Submit Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Need help?</span> Ensure all mandatory fields (<span className="text-red-500">*</span>) and pin location are set before submitting.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => navigate("/customer/dashboard")}
                className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#1a7a6e] to-[#2a9d8f] hover:from-[#145f56] hover:to-[#1a7a6e] text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer active:scale-98"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Request...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-5 h-5" />
                    <span>Post Service Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateWorkRequest;
