const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const protect = require("../middleware/authMiddleware");

router.use(protect);

const calculateInsights = (event) => {
  const totalSpent = event.categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = event.budget - totalSpent;
  const alerts = [];
  event.categories.forEach((c) => {
    if (c.spent > c.allocated) alerts.push(`${c.name} exceeded its budget`);
  });
  if (totalSpent > event.budget) alerts.push("Total budget exceeded");
  return { totalSpent, remaining, alerts };
};

router.post("/", async (req, res) => {
  try {
    const event = new Event({ ...req.body, user: req.user._id });
    await event.save();
    res.json({ message: "Event created", data: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.json({ message: "Events fetched", data: events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { totalSpent, remaining, alerts } = calculateInsights(event);
    const categoryBreakdown = event.categories.map((c) => ({
      name: c.name,
      allocated: c.allocated,
      spent: c.spent,
    }));

    res.json({
      message: "Event fetched",
      data: { event, totalSpent, remaining, alerts, categoryBreakdown },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, date, budget } = req.body;
    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, date, budget },
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/expense", async (req, res) => {
  try {
    const { category } = req.body;
    const amount = Number(req.body.amount);
    if (!category || isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid input" });

    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const cat = event.categories.find((c) => c.name === category);
    if (!cat) return res.status(400).json({ message: "Category not found" });

    cat.spent += amount;
    await event.save();

    const { totalSpent, alerts } = calculateInsights(event);
    res.json({
      message: "Expense added",
      totalSpent,
      forecast: totalSpent * 1.2,
      alerts,
      data: event,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/category", async (req, res) => {
  try {
    const { name, allocated } = req.body;
    if (!name || allocated == null || allocated < 0)
      return res.status(400).json({ message: "Invalid category data" });

    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.categories.find((c) => c.name === name))
      return res.status(400).json({ message: "Category already exists" });

    event.categories.push({ name, allocated, spent: 0 });
    await event.save();
    res.json({ message: "Category added", data: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/category/:name", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.categories = event.categories.filter(
      (c) => c.name !== req.params.name,
    );
    await event.save();
    res.json({ message: "Category deleted", data: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/ai-suggestions", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const totalSpent = event.categories.reduce((sum, c) => sum + c.spent, 0);

    const prompt = `
You are an AI event budget advisor. Analyze the event and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

Return exactly this structure:
{
  "insights": ["string", "string", "string"],
  "suggestions": ["string", "string"],
  "summary": "string"
}

Rules:
- insights: exactly 3 short observations about spending (max 10 words each)
- suggestions: exactly 2 actionable cost-saving tips (max 10 words each)
- summary: exactly 1 sentence budget health verdict (max 15 words)
- Use ₹ for currency
- Be specific to the event data, not generic

Event: ${event.name}
Total Budget: ₹${event.budget}
Total Spent: ₹${totalSpent}
Categories:
${event.categories.map((c) => `${c.name}: Allocated ₹${c.allocated}, Spent ₹${c.spent}`).join("\n")}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.json({ suggestions: raw, structured: false });
    }

    res.json({ suggestions: parsed, structured: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
