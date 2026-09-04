import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiMapPin,
  HiCalendar,
  HiCurrencyRupee,
  HiChatBubbleLeftEllipsis,
  HiPencilSquare,
  HiTrash,
  HiExclamationTriangle,
  HiClock,
  HiTag,
  HiArrowRight,
  HiUser,
  HiPaperClip,
  HiArrowPath
} from "react-icons/hi2";

import {
  getWorkRequestById,
  deleteWorkRequest,
} from "../../services/workRequest.service";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import LocationMap from "../../components/map/LocationMap";

const statusStyles = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  QUOTED: "bg-blue-50 text-blue-700 border-blue-200/80",
  BOOKED: "bg-purple-50 text-purple-700 border-purple-200/80",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200/80",
  COMPLETED: "bg-gray-100 text-gray-700 border-gray-200/80",
  CANCELLED_BY_CUSTOMER: "bg-rose-50 text-rose-700 border-rose-200/80",
  CANCELLED_BY_PROFESSIONAL: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const WorkRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchRequest = () => {
    setLoading(true);
    setFetchError(null);
    getWorkRequestById(id)
      .then((response) => {
        const rawData = response?.data;
        const reqData = rawData?.data?._id
          ? rawData.data
          : rawData?._id
          ? rawData
          : rawData?.data || null;

        if (!reqData) {
          throw new Error("Work request details could not be found.");
        }
        setRequest(reqData);
      })
      .catch((error) => {
        console.error("Failed to fetch work request:", error);
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load work request details.";
        setFetchError(msg);
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    
    getWorkRequestById(id)
      .then((response) => {
        if (!isSubscribed) return;
        const rawData = response?.data;
        const reqData = rawData?.data?._id
          ? rawData.data
          : rawData?._id
          ? rawData
          : rawData?.data || null;

        if (!reqData) {
          setFetchError("Work request details could not be found.");
        } else {
          setRequest(reqData);
        }
      })
      .catch((error) => {
        if (!isSubscribed) return;
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load work request details.";
        setFetchError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    if (status.startsWith("CANCELLED")) return "Cancelled";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatBudget = (budget) => {
    if (!budget?.min && !budget?.max) {
      return "Budget not specified";
    }
    if (budget.min && budget.max) {
      return `₹${budget.min.toLocaleString("en-IN")} - ₹${budget.max.toLocaleString("en-IN")}`;
    }
    if (budget.min) {
      return `From ₹${budget.min.toLocaleString("en-IN")}`;
    }
    return `Up to ₹${budget.max.toLocaleString("en-IN")}`;
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this work request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await deleteWorkRequest(id);
      toast.success("Work request cancelled.");
      navigate("/customer/work-requests");
    } catch (error) {
      console.error("Failed to cancel request:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel work request."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-12">
        <CustomerNavbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-gray-500 shadow-xs animate-pulse">
            <div className="w-12 h-12 bg-teal-50 rounded-xl mx-auto mb-3 flex items-center justify-center text-[#1a7a6e]">
              <HiClock className="w-6 h-6 animate-spin" />
            </div>
            <p className="font-medium text-gray-700">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !request) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-12">
        <CustomerNavbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Unable to Load Work Request
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {fetchError || "The work request details could not be retrieved."}
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/customer/work-requests")}
                className="px-5 py-2.5 rounded-xl bg-[#1a7a6e] text-white font-semibold text-sm hover:bg-[#156359] transition cursor-pointer"
              >
                Back to My Requests
              </button>
              <button
                type="button"
                onClick={fetchRequest}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <HiArrowPath className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const coordinates = request.location?.coordinates || [];
  const hasCoordinates =
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number";

  // Backend stores [longitude, latitude]
  const longitude = hasCoordinates ? coordinates[0] : null;
  const latitude = hasCoordinates ? coordinates[1] : null;

  const quoteCount = request.quoteCount || request.quotes?.length || 0;
  const categoryName =
    request.category?.name || request.customCategory || "Not specified";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/customer/work-requests")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a7a6e] transition mb-6 cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Requests</span>
        </button>

        {/* Header Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {request.title}
                </h1>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[request.status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {getStatusLabel(request.status)}
                </span>

                {request.isUrgent && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 animate-pulse">
                    <HiExclamationTriangle className="w-3.5 h-3.5" />
                    <span>URGENT</span>
                  </span>
                )}
              </div>

              {request.requestId && (
                <p className="text-gray-500 text-sm mt-2">
                  Request ID:{" "}
                  <span className="font-mono font-semibold text-gray-700">
                    {request.requestId}
                  </span>
                </p>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap gap-2.5">
              {(request.status === "OPEN" || request.status === "QUOTED") && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/customer/work-requests/${id}/quotes`)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a7a6e] text-white text-sm font-semibold hover:bg-[#156359] transition shadow-md shadow-teal-900/10 cursor-pointer"
                  >
                    <HiChatBubbleLeftEllipsis className="w-4 h-4" />
                    <span>View Quotes ({quoteCount})</span>
                  </button>

                  {request.status === "OPEN" && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/customer/work-requests/${id}/edit`)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                      <HiPencilSquare className="w-4 h-4 text-gray-500" />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    <HiTrash className="w-4 h-4" />
                    <span>{deleting ? "Cancelling..." : "Cancel Request"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed mt-3 text-sm sm:text-base whitespace-pre-wrap">
                {request.description}
              </p>
            </section>

            {/* Media Files */}
            {request.media?.length > 0 && (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <HiPaperClip className="w-5 h-5 text-[#1a7a6e]" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Photos & Videos ({request.media.length})
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {request.media.map((item, index) => {
                    const isVideo = item.mediaType === "video";
                    return (
                      <div
                        key={item.publicId || item.url || index}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs relative group"
                      >
                        {isVideo ? (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={`Service request ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Location & Map */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <HiMapPin className="w-5 h-5 text-[#1a7a6e]" />
                    <span>Service Location</span>
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    Exact location specified for service delivery
                  </p>
                </div>

                {request.visibilityRadius && (
                  <span className="self-start sm:self-auto text-xs font-medium bg-teal-50 text-[#1a7a6e] px-3 py-1 rounded-full border border-teal-100">
                    Visible within {request.visibilityRadius} km
                  </span>
                )}
              </div>

              {/* Leaflet Map */}
              <div className="mt-4">
                {hasCoordinates ? (
                  <LocationMap latitude={latitude} longitude={longitude} />
                ) : (
                  <div className="h-48 rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-sm">
                    <HiMapPin className="w-8 h-8 text-gray-300 mb-1" />
                    <span>Location coordinates not available</span>
                  </div>
                )}
              </div>

              {/* Address details grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Address
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {request.location?.address || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    City
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {request.location?.city || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    State
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {request.location?.state || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Pincode
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {request.location?.pincode || "Not specified"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Request Summary */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Request Summary
              </h2>

              <div className="space-y-4 mt-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiTag className="w-3.5 h-3.5 text-[#1a7a6e]" /> Category
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {categoryName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiCurrencyRupee className="w-3.5 h-3.5 text-[#1a7a6e]" /> Budget
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatBudget(request.budget)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiCalendar className="w-3.5 h-3.5 text-[#1a7a6e]" /> Preferred Date
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatDate(request.preferredDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiClock className="w-3.5 h-3.5 text-[#1a7a6e]" /> Preferred Time
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {request.preferredTimeSlot?.start &&
                    request.preferredTimeSlot?.end
                      ? `${request.preferredTimeSlot.start} - ${request.preferredTimeSlot.end}`
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiChatBubbleLeftEllipsis className="w-3.5 h-3.5 text-[#1a7a6e]" /> Quotes Received
                  </p>
                  <p className="font-semibold text-gray-800 mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 text-[#1a7a6e] font-bold text-xs">
                      {quoteCount}
                    </span>
                    <span>{quoteCount === 1 ? "Quote" : "Quotes"}</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <HiCalendar className="w-3.5 h-3.5 text-[#1a7a6e]" /> Created Date
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            {/* Selected Professional Card */}
            {request.selectedProfessional && (
              <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <HiUser className="w-5 h-5 text-[#1a7a6e]" />
                  <span>Selected Professional</span>
                </h2>

                <div className="mt-4">
                  <p className="font-semibold text-gray-900 text-base">
                    {request.selectedProfessional.name || "Professional"}
                  </p>

                  {request.status === "BOOKED" && (
                    <button
                      type="button"
                      onClick={() => navigate("/customer/bookings")}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a7a6e] hover:underline cursor-pointer"
                    >
                      <span>View Booking Details</span>
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Quotes CTA Card */}
            {(request.status === "OPEN" || request.status === "QUOTED") && (
              <section className="bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-100 rounded-2xl p-6 shadow-xs">
                <h2 className="font-bold text-gray-900 text-base">
                  Ready to choose a professional?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Compare incoming quotes and select the best professional for your request.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/customer/work-requests/${id}/quotes`)
                  }
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] text-white py-3 rounded-xl font-semibold hover:bg-[#156359] transition shadow-md shadow-teal-900/10 cursor-pointer text-sm"
                >
                  <HiChatBubbleLeftEllipsis className="w-4 h-4" />
                  <span>View Quotes ({quoteCount})</span>
                </button>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default WorkRequestDetails;
