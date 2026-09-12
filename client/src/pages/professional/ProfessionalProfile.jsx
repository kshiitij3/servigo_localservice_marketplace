import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import ProfessionalProfileCard from "../../components/professional/profile/ProfessionalProfileCard";
import ProfessionalProfileForm from "../../components/professional/profile/ProfessionalProfileForm";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/professional/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
            Professional Profile
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">
            My Profile
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your personal profile details, public presentation, and business credentials.
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div>
            <ProfessionalProfileCard user={user} />
          </div>

          <div className="lg:col-span-2">
            <ProfessionalProfileForm user={user} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalProfile;
