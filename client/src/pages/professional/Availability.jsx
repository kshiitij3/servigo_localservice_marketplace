import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft, HiClock, HiInformationCircle } from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import { updateAvailability } from "../../services/professional.service";

import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import AvailabilitySelector from "../../components/professional/availability/AvailabilitySelector";

const Availability = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const currentStatus =
    user?.professionalProfile?.availabilityStatus || "available";

  const [loading, setLoading] = useState(false);

  const handleAvailabilityChange = async (status) => {
    try {
      setLoading(true);

      const response = await updateAvailability(status);
      const rawData = response?.data;

      // Extract updated status from response (supports { data: { availabilityStatus } }, { availabilityStatus }, or updated user)
      const nextStatus =
        rawData?.data?.availabilityStatus ||
        rawData?.availabilityStatus ||
        rawData?.user?.professionalProfile?.availabilityStatus ||
        status;

      // Update AuthContext user state so dashboard and all pages reflect the new status immediately
      if (user) {
        const updatedUser = {
          ...user,
          professionalProfile: {
            ...(user.professionalProfile || {}),
            availabilityStatus: nextStatus,
          },
        };
        updateUser(updatedUser);
      }

      toast.success(
        rawData?.message ||
          response?.message ||
          `Availability status changed to ${status}.`
      );
    } catch (error) {
      console.error("Failed to update availability:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update availability."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={() => navigate("/professional/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition mb-6 cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header Hero Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1a7a6e] flex items-center justify-center">
              <HiClock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Work Schedule & Status
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Manage Availability
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl">
            Control your presence on Servigo. Let clients and our dispatch system
            know whether you are currently ready to receive new job leads.
          </p>
        </section>

        {/* Availability Selector Card */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-gray-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Current Status
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Click any option to immediately update your working status.
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#1a7a6e] font-semibold bg-teal-50 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-teal-100">
                <div className="w-3.5 h-3.5 border-2 border-[#1a7a6e] border-t-transparent rounded-full animate-spin" />
                <span>Saving changes...</span>
              </div>
            )}
          </div>

          <AvailabilitySelector
            currentStatus={currentStatus}
            onChange={handleAvailabilityChange}
            loading={loading}
          />
        </section>

        {/* Explanatory Info Card */}
        <section className="bg-gradient-to-br from-teal-50/70 to-emerald-50/40 border border-teal-100/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#1a7a6e] flex items-center justify-center shrink-0 mt-0.5">
              <HiInformationCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base">
                How Servigo handles your availability
              </h3>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-base mr-1.5">🟢</span>
                  <strong className="text-xs font-bold text-gray-900">
                    Available
                  </strong>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Your profile appears in search results and you receive nearby service leads immediately.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-100">
                  <span className="text-base mr-1.5">🟡</span>
                  <strong className="text-xs font-bold text-gray-900">
                    Busy
                  </strong>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    You can still review existing quotes and jobs, but clients know you are currently occupied.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-rose-100">
                  <span className="text-base mr-1.5">🔴</span>
                  <strong className="text-xs font-bold text-gray-900">
                    Unavailable
                  </strong>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Temporarily hides you from urgent booking leads until you toggle back to Available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Availability;
