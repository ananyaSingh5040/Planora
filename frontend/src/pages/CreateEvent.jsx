import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || budget <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/events", {
        name,
        date: new Date(),
        budget: Number(budget),
        categories: [],
      });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center p-6 font-[Cormorant_Garamond,Georgia,serif]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[80px]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-pink-100/50 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-sans text-sm mb-8 transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">
            ←
          </span>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-rose-50 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 to-pink-500" />

          <div className="p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-xl">✦</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  New Event
                </h1>
                <p className="text-gray-400 font-sans text-sm font-light mt-0.5">
                  Set up your event and budget
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Reception, Birthday Party"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-200 font-sans text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                  Total Budget (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-sans font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-4 pl-8 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-200 font-sans text-gray-800 placeholder:text-gray-300"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:opacity-60 text-white py-4 rounded-2xl font-sans text-sm font-semibold tracking-widest uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-300 font-sans text-xs mt-6 tracking-wide">
          Planora · Plan smarter. Spend better.
        </p>
      </div>
    </div>
  );
};

export default CreateEvent;
