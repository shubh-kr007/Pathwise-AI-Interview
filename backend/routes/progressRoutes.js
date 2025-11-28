const express = require("express");
const InterviewAttempt = require("../models/InterviewAttempt");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.post("/save-attempt", verifyToken, async (req, res) => {
  try {
    const attempt = new InterviewAttempt({ ...req.body, userId: req.userId });
    await attempt.save();
    
    const user = await User.findById(req.userId);
    user.interviewsCompleted += 1;
    if (req.body.scorePercent != null) {
      const oldTotal = (user.averageScore || 0) * (user.interviewsCompleted - 1);
      user.averageScore = Math.round((oldTotal + req.body.scorePercent) / user.interviewsCompleted);
    }
    await user.save();
    res.status(201).json({ message: "Saved" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

router.get("/attempts", verifyToken, async (req, res) => {
  const attempts = await InterviewAttempt.find({ userId: req.userId }).sort({ timestamp: -1 });
  res.json(attempts);
});
module.exports = router;