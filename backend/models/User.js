const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  picture: { type: String },
  phone: { type: String },
  location: { type: String },
  course: { type: String },
  
  // Interview stats
  interviewsCompleted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  
  // Resume data
  resumeAnalyzed: { type: Boolean, default: false },
  resumeData: { type: mongoose.Schema.Types.Mixed, default: null },
  
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);