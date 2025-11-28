const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: String,
  company: String,
  location: String,
  url: String,
  status: { type: String, default: "Applied" }, // Applied, Interview, Hired, Rejected
  appliedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
