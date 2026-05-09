import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";

const EventDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [allocated, setAllocated] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async () => {
    if (!categoryName || allocated <= 0) {
      alert("Invalid category");
      return;
    }
    try {
      setLoading(true);
      await API.post(`/events/${id}/category`, {
        name: categoryName,
        allocated: Number(allocated),
      });
      setCategoryName("");
      setAllocated("");
      fetchEvent();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!expenseCategory || amount <= 0) {
      alert("Invalid expense");
      return;
    }
    try {
      setLoading(true);
      await API.post(`/events/${id}/expense`, {
        category: expenseCategory,
        amount: Number(amount),
      });
      setExpenseCategory("");
      setAmount("");
      fetchEvent();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (name) => {
    try {
      await API.delete(`/events/${id}/category/${name}`);
      fetchEvent();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const getAISuggestions = async () => {
    try {
      setAiLoading(true);
      const res = await API.get(`/events/${id}/ai-suggestions`);
      setAiSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center font-[Cormorant_Garamond,Georgia,serif]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-gray-400 font-sans text-sm">Loading event…</p>
        </div>
      </div>
    );

  const spentPercent =
    data.event.budget > 0
      ? Math.min((data.totalSpent / data.event.budget) * 100, 100)
      : 0;
  const isOverBudget = data.remaining < 0;

  return (
    <div className="min-h-screen bg-[#FDF6F0] font-[Cormorant_Garamond,Georgia,serif]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[80px]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-pink-100/50 blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-sans text-sm mb-10 transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">
            ←
          </span>
          All Events
        </Link>

        <div className="bg-white rounded-3xl border border-rose-50 shadow-xl overflow-hidden mb-6">
          <div className="h-1.5 bg-gradient-to-r from-rose-400 to-pink-500" />
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="font-sans text-xs text-rose-400 uppercase tracking-widest font-medium">
                    Event
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  {data.event.name}
                </h1>
              </div>
              <div
                className={`px-4 py-2 rounded-xl font-sans text-sm font-semibold ${isOverBudget ? "bg-red-50 text-red-500 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
              >
                {isOverBudget ? "⚠ Over Budget" : "✓ Within Budget"}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-sans text-sm text-gray-400 mb-2">
                <span>Spent ₹{data.totalSpent?.toLocaleString()}</span>
                <span>Budget ₹{data.event.budget?.toLocaleString()}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isOverBudget ? "bg-red-400" : "bg-gradient-to-r from-rose-400 to-pink-500"}`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Total Spent",
                  value: `₹${data.totalSpent?.toLocaleString()}`,
                  color: "text-gray-800",
                },
                {
                  label: "Remaining",
                  value: `₹${Math.abs(data.remaining)?.toLocaleString()}`,
                  color: isOverBudget ? "text-red-500" : "text-emerald-600",
                },
                {
                  label: "Total Budget",
                  value: `₹${data.event.budget?.toLocaleString()}`,
                  color: "text-gray-800",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                >
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {data.alerts?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-6">
            <h2 className="font-sans text-xs uppercase tracking-widest text-red-400 font-semibold mb-3">
              Alerts
            </h2>
            {data.alerts.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-red-600 font-sans text-sm mb-2"
              >
                <span className="mt-0.5">⚠</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-rose-50 rounded-3xl shadow-sm overflow-hidden mb-6">
          <div className="h-1 bg-gradient-to-r from-fuchsia-400 via-rose-400 to-pink-400" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Budget Insights
                </h2>
                <p className="font-sans text-xs text-gray-400 mt-0.5 tracking-wide">
                  Powered by Groq · Llama 3.1
                </p>
              </div>
              <button
                onClick={getAISuggestions}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-sans text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing…</span>
                  </>
                ) : (
                  <>
                    <span className="text-fuchsia-400 text-base">✦</span>
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            {!aiSuggestions && !aiLoading && (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl gap-3">
                <div className="w-10 h-10 rounded-full bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-400 text-lg">✦</span>
                </div>
                <p className="text-gray-400 font-sans text-sm text-center max-w-xs">
                  Click "Generate Insights" for AI-powered analysis of your
                  event budget.
                </p>
              </div>
            )}

            {aiLoading && (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-2xl" />
                ))}
              </div>
            )}

            {aiSuggestions &&
              !aiLoading &&
              (aiSuggestions.raw ? (
                <div className="bg-gray-50 rounded-2xl p-5 font-sans text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {aiSuggestions.raw}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-rose-500">
                        Insights
                      </span>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {aiSuggestions.insights?.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                          <p className="font-sans text-sm text-gray-700 leading-snug">
                            {insight}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-1 bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-5 border border-fuchsia-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">↓</span>
                      </div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-fuchsia-500">
                        Save More
                      </span>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {aiSuggestions.suggestions?.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-fuchsia-400 flex-shrink-0" />
                          <p className="font-sans text-sm text-gray-700 leading-snug">
                            {tip}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✦</span>
                      </div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-600">
                        Health Check
                      </span>
                    </div>
                    <p className="font-[Cormorant_Garamond,Georgia,serif] text-xl text-gray-800 leading-snug font-semibold">
                      {aiSuggestions.summary}
                    </p>
                    <div className="mt-4 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border border-rose-50 rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Categories</h2>
          {data.categoryBreakdown.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 font-sans text-sm">
                No categories added yet. Add one below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.categoryBreakdown.map((c) => {
                const catPercent =
                  c.allocated > 0
                    ? Math.min((c.spent / c.allocated) * 100, 100)
                    : 0;
                const catOver = c.spent > c.allocated;
                return (
                  <div
                    key={c.name}
                    className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-rose-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {c.name}
                      </h3>
                      <button
                        onClick={() => deleteCategory(c.name)}
                        className="text-gray-300 hover:text-red-400 font-sans text-xs transition-colors duration-200 px-2 py-1 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${catOver ? "bg-red-400" : "bg-gradient-to-r from-rose-400 to-pink-400"}`}
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between font-sans text-xs text-gray-500">
                      <span>
                        Spent{" "}
                        <strong
                          className={`${catOver ? "text-red-500" : "text-gray-700"}`}
                        >
                          ₹{c.spent?.toLocaleString()}
                        </strong>
                      </span>
                      <span>of ₹{c.allocated?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-rose-50 rounded-3xl shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Add Expense
              </h2>
              <p className="font-sans text-xs text-gray-400 mb-5">
                Record a new expense to a category
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-200 font-sans text-sm text-gray-700"
                  >
                    <option value="">Select a category</option>
                    {data.categoryBreakdown.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">
                      ₹
                    </span>
                    <input
                      placeholder="0"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3.5 pl-7 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-200 font-sans text-sm text-gray-700"
                    />
                  </div>
                </div>
                <button
                  onClick={addExpense}
                  disabled={loading}
                  className="mt-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-sans text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? "Adding…" : "Add Expense"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-rose-50 rounded-3xl shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-pink-400 to-fuchsia-500" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Add Category
              </h2>
              <p className="font-sans text-xs text-gray-400 mb-5">
                Create a new budget category
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                    Category Name
                  </label>
                  <input
                    placeholder="e.g. Catering, Decor, Music"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-200 font-sans text-sm text-gray-700 placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-gray-500 uppercase tracking-widest font-medium">
                    Allocated Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">
                      ₹
                    </span>
                    <input
                      placeholder="0"
                      type="number"
                      value={allocated}
                      onChange={(e) => setAllocated(e.target.value)}
                      className="w-full p-3.5 pl-7 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-200 font-sans text-sm text-gray-700"
                    />
                  </div>
                </div>
                <button
                  onClick={addCategory}
                  disabled={loading}
                  className="mt-1 bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:from-pink-500 hover:to-fuchsia-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-sans text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? "Adding…" : "Add Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
