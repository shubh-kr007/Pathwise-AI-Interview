// backend/server.js
const dotenv = require("dotenv");
dotenv.config();

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

///////////////////////////////////////////////////////////
// ✅ SIMPLE, DEV-FRIENDLY CORS: ALLOW ALL ORIGINS
///////////////////////////////////////////////////////////
app.use(cors({
  origin: true,               // Reflect request origin
  credentials: false,         // We are using Bearer token, not cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// DB
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