import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiEnvelope,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiArrowRightOnRectangle,
  HiExclamationCircle
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";

const ServigoLogo = () => (
  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1a7a6e] to-[#2a9d8f] text-white flex items-center justify-center font-black text-2xl shadow-md">
    S
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const role =
        response?.data?.data?.user?.role ||
        response?.data?.user?.role ||
        response?.user?.role;
      if (role === "customer") navigate("/customer/dashboard");
      else if (role === "professional") navigate("/professional/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(135deg, #d6e8e6 0%, #e8edf0 50%, #dde5e8 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Branding Header */}
          <div className="bg-white pt-8 pb-4 flex flex-col items-center border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <ServigoLogo />
              <span className="text-2xl font-black text-[#1a7a6e] tracking-wider">
                SERVIGO
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your Local Service Marketplace
            </p>
          </div>

          {/* Form Content */}
          <div className="p-7 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 text-center mb-6">
              Welcome Back
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-5 flex items-center gap-2">
                <HiExclamationCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiEnvelope className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="login-email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiLockClosed className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="login-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="text-xs text-[#1a7a6e] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1a7a6e] hover:bg-[#145f56] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#1a7a6e] font-bold hover:underline"
              >
                Create one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
