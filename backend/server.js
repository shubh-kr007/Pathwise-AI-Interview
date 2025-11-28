// backend/server.js
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

// ✅ CORS configuration
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Apply CORS middleware globally
app.use(cors(corsOptions));

// ❌ REMOVE this line (it caused the crash)
// app.options("*", cors(corsOptions));

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Connect to MongoDB
connectDB();

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pathwise API running" });
});

// ✅ Mount routes
app.use("/api", authRoutes);           // /api/login, /api/signup, /api/google-login
app.use("/api/user", userRoutes);      // /api/user/profile
app.use("/api/resume", resumeRoutes);  // /api/resume/analyze, /api/resume/status
app.use("/api/ai", aiRoutes);          // /api/ai/generate-questions, /api/ai/interview-feedback
app.use("/api/progress", progressRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS allowed origin: ${allowedOrigin}`);
});