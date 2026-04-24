const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/google-login", async (req, res) => {
  const { token: idToken } = req.body;
  console.log("🚀 Starting Google Login verification...");
  console.time("google_auth_total");
  
  try {
    console.time("google_ticket_verify");
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.timeEnd("google_ticket_verify");

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.time("db_user_lookup");
    // Use findOneAndUpdate with upsert to optimize DB roundtrip and ensure data is fresh
    const user = await User.findOneAndUpdate(
      { email },
      { 
        $set: { name, picture },
        $setOnInsert: { email, createdAt: new Date() } 
      },
      { new: true, upsert: true }
    );
    console.timeEnd("db_user_lookup");

    console.time("jwt_sign");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.timeEnd("jwt_sign");

    console.timeEnd("google_auth_total");
    res.json({ token, user });
  } catch (e) {
    console.timeEnd("google_auth_total");
    console.error("❌ Google login error:", e);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

module.exports = router;