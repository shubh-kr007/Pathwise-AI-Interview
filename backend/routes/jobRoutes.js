const express = require("express");
const axios = require("axios");
const router = express.Router();

// Example with JSearch (RapidAPI)
router.get("/jobs", async (req, res) => {
  const query = req.query.q || "Software Engineer";
  const location = req.query.location || "India";

  try {
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: { query: `${query} in ${location}`, num_pages: 1 },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    res.json(response.data.data);
  } catch (error) {
    console.error("Job API error:", error.message);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

module.exports = router;
