import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] font-[Cormorant_Garamond,Georgia,serif]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[80px]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-pink-100/50 blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-8 py-12">
        <header className="flex justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-1"></div>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight leading-none mt-2">
              Planora
            </h1>
            {user?.name && (
              <p className="text-gray-400 mt-2 text-lg font-sans font-light tracking-wide">
                Welcome back, {user.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50 font-sans text-sm transition-all duration-200"
            >
              Sign Out
            </button>
            <Link
              to="/create"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-sans text-sm font-medium tracking-wide"
            >
              <span className="text-rose-400 text-lg leading-none">+</span>
              Create Event
            </Link>
          </div>
        </header>

        {events.length > 0 && (
          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-gray-500 font-sans text-sm">
                {events.length} event{events.length !== 1 ? "s" : ""} planned
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        )}

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No events yet
            </h3>
            <p className="text-gray-400 font-sans font-light mb-8 max-w-xs">
              Create your first event to start tracking budgets and expenses.
            </p>
            <Link
              to="/create"
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-sans text-sm transition-all duration-200"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {events.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                index={index}
                onDelete={() => deleteEvent(event._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CARD_ACCENTS = [
  "from-rose-400 to-pink-500",
  "from-pink-400 to-fuchsia-500",
  "from-orange-300 to-rose-400",
  "from-fuchsia-400 to-pink-500",
];

const EventCard = ({ event, index, onDelete }) => {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-rose-50">
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {event.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs font-sans text-gray-400 tracking-wide uppercase">
                Budget
              </span>
              <span className="text-xs font-sans font-semibold text-gray-600">
                ₹{event.budget?.toLocaleString()}
              </span>
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}
          >
            <span className="text-white text-sm">✦</span>
          </div>
        </div>

        <div className="mb-5">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${accent} rounded-full w-1/3`}
            />
          </div>
        </div>

        <div className="flex gap-2.5">
          <Link
            to={`/event/${event._id}`}
            className={`flex-1 bg-gradient-to-r ${accent} text-white text-center py-2.5 rounded-xl font-sans text-sm font-medium tracking-wide transition-all duration-200 hover:opacity-90 hover:shadow-md`}
          >
            View Details
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50 font-sans text-sm transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
