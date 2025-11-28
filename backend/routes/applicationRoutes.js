const express = require("express");
const Application = require("../models/Application");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// 🔹 Save a job application
router.post("/", verifyToken, async (req, res) => {
  try {
    const app = new Application({ ...req.body, userId: req.userId });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: "Error saving application" });
  }
});

// 🔹 Get all applications for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});

// 🔹 Update application status
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// 🔹 Delete application
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Application.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Application removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting application" });
  }
});

module.exports = router;
