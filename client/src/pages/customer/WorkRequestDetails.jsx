import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import {
  getWorkRequestById,
  deleteWorkRequest,
} from "../../services/workRequest.service";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  RequestDetailsHeader,
  RequestMediaGallery,
  RequestLocationCard,
  RequestSidebar,
  RequestDetailsSkeleton,
  RequestDetailsError,
} from "../../components/customer/workRequest";

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
    if (id) {
      fetchRequest();
    }
  }, [id]);

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
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <RequestDetailsSkeleton />
      </div>
    );
  }

  if (fetchError || !request) {
    return (
      <div className="min-h-screen bg-gray-50/70 pb-16">
        <CustomerNavbar />
        <RequestDetailsError
          fetchError={fetchError}
          onBack={() => navigate("/customer/work-requests")}
          onRetry={fetchRequest}
        />
      </div>
    );
  }

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

        {/* Header Section Component */}
        <RequestDetailsHeader
          request={request}
          quoteCount={quoteCount}
          deleting={deleting}
          onDelete={handleDelete}
          onViewQuotes={() => navigate(`/customer/work-requests/${id}/quotes`)}
          onEdit={() => navigate(`/customer/work-requests/${id}/edit`)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Left Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed mt-3 text-sm sm:text-base whitespace-pre-wrap">
                {request.description}
              </p>
            </section>

            {/* Media Files Gallery Component */}
            <RequestMediaGallery media={request.media} />

            {/* Location & Map Component */}
            <RequestLocationCard
              location={request.location}
              visibilityRadius={request.visibilityRadius}
            />
          </div>

          {/* Sidebar Component */}
          <RequestSidebar
            request={request}
            quoteCount={quoteCount}
            categoryName={categoryName}
            onViewQuotes={() => navigate(`/customer/work-requests/${id}/quotes`)}
            onViewBooking={() => navigate("/customer/bookings")}
          />
        </div>
      </main>
    </div>
  );
};

export default WorkRequestDetails;
