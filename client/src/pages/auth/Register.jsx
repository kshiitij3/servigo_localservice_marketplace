import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/* ── Servigo shield logo ── */
const ServigoLogo = () => (
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#1a7a6e" />
    <path
      d="M20 6C14.477 6 10 10.477 10 16c0 3.314 1.612 6.256 4.1 8.1L20 34l5.9-9.9C28.388 22.256 30 19.314 30 16c0-5.523-4.477-10-10-10z"
      fill="white"
      opacity="0.15"
    />
    <path
      d="M16 14c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.77-2 3.46V26h-4V17.46C16.81 16.77 16 15.48 16 14z"
      fill="white"
    />
  </svg>
);

const CustomerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ProfessionalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" />
  </svg>
);

const CheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 absolute top-2 right-2">
    <circle cx="12" cy="12" r="12" fill="#1a7a6e" />
    <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") === "professional" ? "professional" : "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "phone"
      ? value.replace(/\D/g, "").slice(0, 10)
      : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (name === "confirmPassword" || name === "password") {
      setPasswordMismatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    if (!agreed) return;

    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      // The API expects a 10-digit Indian mobile number without spaces.
      submitData.phone = submitData.phone.replace(/\s+/g, "");
      const response = await register(submitData);
      const role = response?.data?.user?.role;
      if (role === "customer") navigate("/customer/dashboard");
      else if (role === "professional") navigate("/professional/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #d6e8e6 0%, #e8edf0 50%, #dde5e8 100%)" }}
    >
      {/* Sparkle decoration */}
      <div className="absolute bottom-10 right-10 text-gray-300 opacity-40 pointer-events-none">
        <svg viewBox="0 0 40 40" fill="currentColor" className="w-10 h-10">
          <path d="M20 0l2.9 17.1L40 20l-17.1 2.9L20 40l-2.9-17.1L0 20l17.1-2.9z" />
        </svg>
      </div>

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Top branding */}
          <div className="bg-white pt-8 pb-4 flex flex-col items-center border-b border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <ServigoLogo />
              <span className="text-2xl font-bold text-[#1a7a6e]">Servigo</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mt-2">Create your account</p>
          </div>

          {/* Form area */}
          <div className="px-6 pt-5 pb-6">

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">I want to use Servigo as</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Customer */}
                <button
                  type="button"
                  id="role-customer"
                  onClick={() => setFormData((p) => ({ ...p, role: "customer" }))}
                  className={`relative border-2 rounded-xl p-3 flex flex-col items-center gap-1 transition-all ${
                    formData.role === "customer"
                      ? "border-[#1a7a6e] bg-[#f0faf8]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {formData.role === "customer" && <CheckCircle />}
                  <div className={formData.role === "customer" ? "text-[#1a7a6e]" : "text-gray-500"}>
                    <CustomerIcon />
                  </div>
                  <span className={`text-sm font-semibold ${formData.role === "customer" ? "text-[#1a7a6e]" : "text-gray-700"}`}>
                    Customer
                  </span>
                  <span className="text-[10px] text-gray-400">Find professionals.</span>
                </button>

                {/* Professional */}
                <button
                  type="button"
                  id="role-professional"
                  onClick={() => setFormData((p) => ({ ...p, role: "professional" }))}
                  className={`relative border-2 rounded-xl p-3 flex flex-col items-center gap-1 transition-all ${
                    formData.role === "professional"
                      ? "border-[#1a7a6e] bg-[#f0faf8]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {formData.role === "professional" && <CheckCircle />}
                  <div className={formData.role === "professional" ? "text-[#1a7a6e]" : "text-gray-500"}>
                    <ProfessionalIcon />
                  </div>
                  <span className={`text-sm font-semibold ${formData.role === "professional" ? "text-[#1a7a6e]" : "text-gray-700"}`}>
                    Professional
                  </span>
                  <span className="text-[10px] text-gray-400">Offer my services.</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="register-name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="register-phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all"
                />
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="register-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••"
                      required
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all pr-9 ${
                        passwordMismatch ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" />
                          <path d="M1 1l22 22" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      id="register-confirm-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••"
                      required
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all pr-9 ${
                        passwordMismatch ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" />
                          <path d="M1 1l22 22" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {passwordMismatch && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}

              {/* Terms */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    agreed ? "bg-[#1a7a6e] border-[#1a7a6e]" : "border-gray-300"
                  }`}
                >
                  {agreed && (
                    <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3">
                      <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-[#1a7a6e] font-medium hover:underline cursor-pointer">Terms & Privacy Policy</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                id="register-submit"
                disabled={loading || !agreed}
                className="w-full bg-[#1a7a6e] hover:bg-[#145f56] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] tracking-wide mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#1a7a6e] font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
