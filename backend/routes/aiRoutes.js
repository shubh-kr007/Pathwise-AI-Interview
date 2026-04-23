const express = require("express");
const verifyToken = require("../middleware/auth");
const { getAIClient, getAIModel, isAIReady } = require("../config/ai");
const User = require("../models/User");

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    let response;
    const openai = getAIClient();
    const model = getAIModel();

    // Fetch real user stats for personalized chat
    const user = await User.findById(req.userId);
    const userStats = {
      name: user?.name || "Candidate",
      completed: user?.interviewsCompleted || 0,
      avgScore: user?.averageScore || 0,
      resumeStatus: user?.resumeAnalyzed ? "Analyzed" : "Not yet analyzed"
    };

    if (isAIReady() && openai) {
      // Use AI for intelligent responses
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are InterviewBot, the expert AI assistant of Pathwise — an advanced AI-powered career growth and interview preparation platform.

            Current User Context:
            - Name: ${userStats.name}
            - Completed Assessments: ${userStats.completed}
            - Average Score: ${userStats.avgScore}%
            - Resume Status: ${userStats.resumeStatus}

            Guidelines for Progress Queries:
            1. If they ask about "progress", "report", or "how am I doing", reference their ${userStats.avgScore}% score and ${userStats.completed} tests.
            2. If Avg Score > 80: Say "You are performing at an Elite level! Your ${userStats.avgScore}% accuracy is impressive. You should try the 'Hard' difficulty in the DSA round."
            3. If Avg Score 50-80: Say "You are doing well with ${userStats.completed} tests completed. To reach the top 1%, focus on retry-ing 'Medium' level assessments for more consistency."
            4. If Avg Score < 50: Be very encouraging: "You've started strong with ${userStats.completed} sessions. I suggest focusing on 'Easy' level tracks in your core specialization to build a solid foundation."
            5. If no tests done (0): Suggest they go to the 'Interview' section and start with an 'Easy' assessment.
            6. Always provide one clear 'Improvement Tip' based on their score.
            
            Guidelines:
            - Be professional, encouraging, and concise.
            - If users ask about Pathwise features, explain:
              - Mock Interviews: 4 tracks (Data Analyst, Full Stack, Java, DSA) with 3 difficulties.
              - Resume Intelligence: LlamaParse-driven ATS scores and roadmaps.
              - Performance Tracking: Dashboard with trend graphs.
            - Help users with interview tips, resume advice, and general career guidance.`
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
      response = `I'm here to help with career advice. Based on your records, you've completed ${userStats.completed} assessments with an average score of ${userStats.avgScore}%. Keep pushing forward!`;
    }

    res.json({
      success: true,
      response,
      aiGenerated: isAIReady()
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
    const openai = getAIClient();
    const model = getAIModel();

    if (!isAIReady() || !openai) {
      return res.status(503).json({
        message: "AI service not available",
        useFallback: true
      });
    }

    const { type, topic, difficulty } = req.body;

    let prompt = "";
    let systemPrompt = "You are an expert technical interviewer.";

    if (type === "mcq") {
      systemPrompt += ` Generate 5 ${difficulty || "medium"} difficulty multiple choice questions for a technical interview.`;
      
      let levelDescription = "";
      if (difficulty === "easy") levelDescription = "Focus on basic syntax, core definitions, and foundational concepts.";
      else if (difficulty === "hard") levelDescription = "Focus on deep internal mechanics, performance optimization, architectural trade-offs, and complex edge cases.";
      else levelDescription = "Focus on real-world application, standard problem-solving scenarios, and industry best practices.";

      prompt = `Generate 5 multiple-choice questions about ${topic || "general software engineering"}. 
      The difficulty level is ${(difficulty || "medium").toUpperCase()}. 
      Guideline: ${levelDescription}
      
      Return purely JSON array with objects having: 
      - id (unique string)
      - prompt (question text)
      - options (array of 4 strings)
      - answerIndex (0-3 index of correct option)
      - explanation (detailed reason why this is correct)
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
      model: model,
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
    const openai = getAIClient();
    const model = getAIModel();

    if (!isAIReady() || !openai) {
      return res.json({
        feedback: "AI feedback unavailable. Your answers have been recorded for review."
      });
    }

    const { type, questions, answers } = req.body;

    const prompt = `
      I have completed a ${type} interview.
      
      Questions and my answers:
      ${JSON.stringify({ questions, answers }, null, 2)}
      
      Provide a concise, constructive feedback report with MARKDOWN formatting.
      Highlight 2 strengths and 2 areas for improvement.
      Keep it under 200 words.
    `;

    const completion = await openai.chat.completions.create({
      model: model,
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