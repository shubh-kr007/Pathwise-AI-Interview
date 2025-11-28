// backend/server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

// ✅ VERY SIMPLE, ALWAYS-ON CORS (WORKS ON RENDER & LOCAL)
app.use((req, res, next) => {
  // Allow any origin (for a college project this is fine)
  res.header("Access-Control-Allow-Origin", "*");
  // Allow these headers from frontend
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // Allow these methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Handle preflight quickly
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect DB
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pathwise API running" });
});

// Routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});