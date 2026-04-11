const express = require("express");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// OpenAI setup (safe initialization)
let openai = null;
let USE_OPENAI = false;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20) {
    const OpenAI = require("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    USE_OPENAI = true;
    console.log("✅ OpenAI initialized for AI chat");
  } else {
    console.log("⚠️ OpenAI not configured - using basic chat responses");
  }
} catch (error) {
  console.log("⚠️ OpenAI initialization failed for chat");
}

// POST /api/ai/chat
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    let response;

    if (USE_OPENAI && openai) {
      // Use OpenAI for intelligent responses
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are InterviewBot, an AI assistant specializing in career development, interview preparation, and job search advice. Provide helpful, concise, and encouraging responses. Focus on interview tips, resume advice, career guidance, and Pathwise platform features."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      response = completion.choices[0].message.content.trim();
    } else {
      // Fallback basic responses
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("interview")) {
        response = "For interview preparation, practice the STAR method for behavioral questions and review common technical questions. Check out our Interview Room for mock interviews!";
      } else if (lowerMessage.includes("resume")) {
        response = "Upload your resume in the Dashboard for AI-powered analysis. Focus on quantifiable achievements and relevant keywords for your target role.";
      } else if (lowerMessage.includes("job") || lowerMessage.includes("application")) {
        response = "Use our Job Search feature to find opportunities. Track your applications in the Application Tracker to stay organized.";
      } else {
        response = "I'm here to help with career advice, interview prep, and using Pathwise effectively. What specific question do you have?";
      }
    }

    res.json({
      success: true,
      response,
      aiGenerated: !!(USE_OPENAI && openai)
    });

  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({
      message: "Failed to process chat message",
      response: "Sorry, I'm having trouble responding right now. Please try again later."
    });
  }
});

// POST /api/ai/generate-questions
router.post("/generate-questions", verifyToken, async (req, res) => {
  try {
    const { type, topic } = req.body; // type: 'mcq', 'coding', 'technical'

    if (!USE_OPENAI || !openai) {
      return res.status(503).json({
        message: "AI service not available",
        useFallback: true
      });
    }

    let prompt = "";
    let systemPrompt = "You are an expert technical interviewer.";

    if (type === "mcq") {
      systemPrompt += " Generate 5 multiple choice questions for a technical interview.";
      prompt = `Generate 5 multiple-choice questions about ${topic || "general software engineering"}. 
      Return purely JSON array with objects having: 
      - id (unique string)
      - prompt (question text)
      - options (array of 4 strings)
      - answerIndex (0-3 index of correct option)
      - explanation (short explanation)
      Output JSON only.`;
    } else if (type === "coding") {
      systemPrompt += " Generate 2 coding challenges.";
      prompt = `Generate 2 coding interview questions about ${topic || "algorithms"}.
      Return purely JSON array with objects having:
      - id (unique string)
      - prompt (problem description)
      - starter (function signature/stub)
      - rubric (array of key grading criteria)
      Output JSON only.`;
    } else if (type === "technical") {
      systemPrompt += " Generate 5 conceptual technical interview questions.";
      prompt = `Generate 5 technical interview questions about ${topic || "system design and web concepts"}.
      Return purely JSON array with objects having:
      - id (unique string)
      - prompt (the question)
      - checklist (array of keywords/concepts expected in the answer)
      Output JSON only.`;
    } else {
      return res.status(400).json({ message: "Invalid interview type" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    let questions = [];
    try {
      // Clean potential markdown blocks
      const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanContent);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

      // Post-process to ensure IDs
      questions = questions.map((q, i) => ({ ...q, id: q.id || `ai-${Date.now()}-${i}` }));

      res.json({ questions });
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      res.status(500).json({ message: "Failed to generate valid questions", useFallback: true });
    }

  } catch (error) {
    console.error("AI questions error:", error);
    res.status(500).json({ message: "Server error generating questions", useFallback: true });
  }
});

// POST /api/ai/interview-feedback
router.post("/interview-feedback", verifyToken, async (req, res) => {
  try {
    const { type, questions, answers } = req.body;

    if (!USE_OPENAI || !openai) {
      return res.json({
        feedback: "AI feedback unavailable. Your answers have been recorded for review."
      });
    }

    const prompt = `
      I have completed a ${type} interview.
      
      Questions and my answers:
      ${JSON.stringify({ questions, answers }, null, 2)}
      
      Provide a concise, constructive feedback report with MARKDOWN formatting.
      Highlight 2 strengths and 2 areas for improvement.
      Keep it under 200 words.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful interview coach." },
        { role: "user", content: prompt }
      ],
      max_tokens: 400,
    });

    const feedback = completion.choices[0].message.content;
    res.json({ feedback });

  } catch (error) {
    console.error("AI feedback error:", error);
    res.status(500).json({ message: "Failed to generate feedback" });
  }
});

module.exports = router;