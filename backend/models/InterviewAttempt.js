const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  mode: String,
  timestamp: { type: Date, default: Date.now },
  scorePercent: Number,
  answers: Object,
  report: Object,
  plan: Object
});
module.exports = mongoose.model("InterviewAttempt", schema);