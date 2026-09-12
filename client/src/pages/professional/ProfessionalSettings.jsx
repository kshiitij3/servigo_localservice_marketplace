import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiCog6Tooth,
  HiBell,
  HiAdjustmentsHorizontal,
  HiShieldCheck,
  HiCheck,
  HiKey,
} from "react-icons/hi2";

import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import SettingsSection from "../../components/professional/settings/SettingsSection";
import NotificationSettings from "../../components/professional/settings/NotificationSettings";
import AccountSettings from "../../components/professional/settings/AccountSettings";

const ProfessionalSettings = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      // UI contract ready for backend integration
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/professional/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1a7a6e] mb-6 transition cursor-pointer group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header Hero Section */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1a7a6e] flex items-center justify-center">
              <HiCog6Tooth className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Preferences & Configuration
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 tracking-tight">
            Account Settings
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your notification dispatch rules, regional settings, and login credentials.
          </p>
        </section>

        {/* Settings Sections List */}
        <div className="space-y-6">
          {/* Notifications */}
          <SettingsSection
            title="Notification Alerts"
            description="Choose what alerts you want to receive on your device."
            icon={<HiBell className="w-5 h-5 text-[#1a7a6e]" />}
          >
            <NotificationSettings />
          </SettingsSection>

          {/* Account Preferences */}
          <SettingsSection
            title="Account & Regional Preferences"
            description="Manage your language, timezone, and display options."
            icon={<HiAdjustmentsHorizontal className="w-5 h-5 text-[#1a7a6e]" />}
          >
            <AccountSettings />
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            title="Security & Password"
            description="Manage your login credentials and authentication security."
            icon={<HiShieldCheck className="w-5 h-5 text-[#1a7a6e]" />}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <HiKey className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Account Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast("Password change workflow will be active in the next update")}
                className="self-start sm:self-center px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-xs"
              >
                Change Password
              </button>
            </div>
          </SettingsSection>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <HiCheck className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalSettings;
