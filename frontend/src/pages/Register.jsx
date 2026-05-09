import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center p-6 font-[Cormorant_Garamond,Georgia,serif]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[80px]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-pink-100/50 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">Planora</h1>
          </div>
          <p className="text-gray-400 font-sans text-sm font-light tracking-wide">
            Plan smarter. Spend better.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-rose-50 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 to-fuchsia-500" />

          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Create account
            </h2>
            <p className="text-gray-400 font-sans text-sm font-light mb-7">
              Start planning your events today
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="font-sans text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-200 font-sans text-sm text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-200 font-sans text-sm text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-200 font-sans text-sm text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:from-pink-500 hover:to-fuchsia-600 disabled:opacity-60 text-white py-4 rounded-2xl font-sans text-sm font-semibold tracking-widest uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <p className="text-center font-sans text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
