const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  allocated: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    budget: { type: Number, required: true },
    categories: [categorySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
