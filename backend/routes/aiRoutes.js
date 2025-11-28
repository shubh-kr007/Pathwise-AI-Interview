const express = require("express");
const verifyToken = require("../middleware/auth");
const OpenAI = require("openai");
const router = express.Router();

let openai = null;
if (process.env.OPENAI_API_KEY) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/interview-feedback", verifyToken, async (req, res) => {
  try {
    const { type, mode, questions, answers } = req.body;
    // Mock fallback feedback
    let feedback = {
      overallScore: 75,
      overallSummary: "Good effort. Focus on more details.",
      strengths: ["Completed questions"],
      areasForImprovement: ["Elaborate answers"],
      recommendations: ["Practice STAR method"]
    };

    if (openai) {
      const prompt = `Analyze this ${type} interview (${mode}). Q&A: ${JSON.stringify({questions, answers}).substring(0,3000)}. Return JSON with overallScore, overallSummary, strengths, areasForImprovement, recommendations.`;
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      const jsonMatch = completion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) feedback = JSON.parse(jsonMatch[0]);
    }
    res.json({ success: true, feedback });
  } catch (e) { res.status(500).json({ message: "AI Error" }); }
});
module.exports = router;