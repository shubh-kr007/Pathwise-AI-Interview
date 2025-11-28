const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.put("/profile", verifyToken, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select("-password");
  res.json(user);
});
module.exports = router;