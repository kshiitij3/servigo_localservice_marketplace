import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const role = response?.data?.user?.role;
      if (role === "customer") navigate("/customer/dashboard");
      else if (role === "professional") navigate("/professional/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
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

          {/* Top branding strip */}
          <div className="bg-white pt-8 pb-4 flex flex-col items-center border-b border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <ServigoLogo />
              <span className="text-2xl font-bold text-[#1a7a6e]">Servigo</span>
            </div>
          </div>

          {/* Inner card */}
          <div className="bg-white rounded-xl mx-3 my-4 shadow-sm border border-gray-100 p-7">
            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">Login</h1>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="login-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a6e] focus:border-transparent transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" />
                        <path d="M1 1l22 22" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Forgot password */}
                <div className="text-right mt-1.5">
                  <button type="button" className="text-xs text-[#1a7a6e] hover:underline font-medium">
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="w-full bg-[#1a7a6e] hover:bg-[#145f56] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 pb-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#1a7a6e] font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
