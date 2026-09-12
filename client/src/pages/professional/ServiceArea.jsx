import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiGlobeAmericas,
  HiInformationCircle,
  HiMapPin,
  HiSparkles,
} from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import ServiceRadiusSelector from "../../components/professional/availability/ServiceRadiusSelector";

const ServiceArea = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const currentRadius =
    user?.professionalProfile?.serviceRadius || 10;

  const [loading, setLoading] = useState(false);

  const handleSave = async (radius) => {
    try {
      setLoading(true);

      /*
       * UI contract ready for backend integration.
       * Local state is updated in AuthContext for immediate reactivity.
       */
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (user && updateUser) {
        updateUser({
          ...user,
          professionalProfile: {
            ...(user.professionalProfile || {}),
            serviceRadius: radius,
          },
        });
      }

      toast.success(`Service radius successfully updated to ${radius} km`);
    } catch (error) {
      console.error("Failed to update service radius:", error);
      toast.error(error?.message || "Failed to update service radius.");
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
              <HiGlobeAmericas className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Profile & Territory
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Service Coverage Area
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl">
            Set how far you are willing to travel from your base location to complete customer service requests.
          </p>
        </section>

        {/* Radius Selector Component */}
        <div className="mb-6">
          <ServiceRadiusSelector
            initialRadius={currentRadius}
            onSave={handleSave}
            loading={loading}
          />
        </div>

        {/* Explanatory Guide Card */}
        <section className="bg-gradient-to-br from-teal-50/70 to-emerald-50/40 border border-teal-100/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#1a7a6e] flex items-center justify-center shrink-0 mt-0.5">
              <HiInformationCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base">
                How proximity matching works on Servigo
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-2 text-[#1a7a6e] font-bold text-xs mb-1.5">
                    <HiMapPin className="w-4 h-4" />
                    <span>Lead Radar</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your service radius sets the maximum distance you are matched for customer postings.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-2 text-[#1a7a6e] font-bold text-xs mb-1.5">
                    <HiSparkles className="w-4 h-4" />
                    <span>Balanced Coverage</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A wider radius exposes you to more work leads, while a tighter radius minimizes your daily commute.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-2 text-[#1a7a6e] font-bold text-xs mb-1.5">
                    <HiGlobeAmericas className="w-4 h-4" />
                    <span>Customer Reach</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    When customers create requests, Servigo cross-checks both their radius preference and yours.
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

export default ServiceArea;
