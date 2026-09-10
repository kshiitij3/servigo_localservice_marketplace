import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

import useAuth from "../../hooks/useAuth";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import ProfileCard from "../../components/customer/profile/ProfileCard";
import ProfileForm from "../../components/customer/profile/ProfileForm";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/customer/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] uppercase tracking-wider">
            Customer Profile
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">
            My Profile
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your personal profile details and contact information.
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <ProfileCard user={user} />
          </div>

          <div className="lg:col-span-2">
            <ProfileForm user={user} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
