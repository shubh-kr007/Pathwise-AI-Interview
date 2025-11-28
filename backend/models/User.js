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
  resumeData: {
    analyzedAt: { type: Date },
    score: { type: Number },
    summary: { type: String },
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    keywords: {
      present: [String],
      missing: [String]
    },
    sections: {
      contact: String,
      experience: String,
      education: String,
      skills: String
    },
    atsCompatibility: { type: Number },
    recommendations: [String]
  },
  
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);