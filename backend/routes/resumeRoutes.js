const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { LlamaParse } = require("llama-parse");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");
const { getAIClient, getAIModel, isAIReady } = require("../config/ai");

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({
  dest: "uploads/resumes/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files allowed'));
    }
  }
});

// Initialize LlamaParser
const getLlamaParser = () => {
  const apiKey = process.env.LLAMA_CLOUD_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ LLAMA_CLOUD_API_KEY not found in environment.");
    return null;
  }
  return new LlamaParse({ apiKey });
};

// Main Analysis Function
async function analyzeResumeContent(markdownText, userProfile) {
  const openai = getAIClient();
  const model = getAIModel();

  if (!isAIReady() || !openai) {
    throw new Error("AI service is not configured. Please check GROQ_API_KEY.");
  }

  const prompt = `
    You are an expert Resume Strategist and Career Coach. 
    Analyze the following resume (parsed as Markdown) and provide a comprehensive, 
    highly professional analysis in JSON format.

    USER PROFILE:
    - Name: ${userProfile.name}
    - Course/Field: ${userProfile.course}

    RESUME CONTENT (Markdown):
    """
    ${markdownText}
    """

    JSON RESPONSE FORMAT:
    {
      "isResume": true/false (Set to false if the document is clearly NOT a resume, like an admit card, invoice, bill, or random text),
      "validationError": "A friendly message explaining why it failed if isResume is false",
      "score": 0-100,
      "detectedRole": "Specific job title",
      "experienceLevel": "Entry/Junior/Mid/Senior/Lead",
      "summary": "Overall evaluation of resume quality",
      "atsAnalysis": {
        "score": 0-100,
        "feedback": "Specific feedback on ATS compatibility"
      },
      "strengths": ["List of specific strengths"],
      "weaknesses": ["List of specific weaknesses"],
      "improvements": ["List of actionable improvements and what more can be added to make it stand out"],
      "keywords": {
        "present": ["keywords found"],
        "missing": ["critical keywords recommended to add"]
      },
      "industryInsights": {
        "salaryRange": "Estimated range based on detected role",
        "marketCompetitiveness": "Low/Moderate/Strong/Exceptional"
      },
      "roadmap": [
        {
          "title": "Phase title",
          "desc": "Phase description",
          "milestones": ["milestone 1", "milestone 2"],
          "resources": ["resource 1", "resource 2"]
        }
      ]
    }

    Special Instructions:
    1. Scan the whole document carefully.
    2. If the document is an Admit Card, Hall Ticket, Invoice, or clearly NOT a career document, set "isResume" to false.
    3. Provide an accurate ATS Score (0-100).
    4. Be specific about strengths and weaknesses referencing the content.
    5. In "improvements", tell the user exactly what more can be added to achieve a perfect 100 score.
  `;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: "You are an expert AI Resume Analyzer specializing in ATS optimization and career strategic planning. Your first priority is to verify if the uploaded document is actually a resume." },
      { role: "user", content: prompt }
    ],
    temperature: 0.1, // Lower temperature for more consistent validation
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

// POST /api/resume/analyze
router.post("/analyze", verifyToken, upload.single('resume'), async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;
    const parser = getLlamaParser();

    if (!parser) {
      return res.status(500).json({ 
        message: "LlamaParse is not configured. Please add LLAMA_CLOUD_API_KEY to .env" 
      });
    }

    // Use LlamaParse to parse the document
    console.log(`📄 Parsing resume using Llama Intelligence: ${req.file.originalname}`);
    
    // Convert file to Blob for LlamaParse (Node.js compatible)
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: req.file.mimetype });
    
    // parseFile returns the result directly for the job
    const result = await parser.parseFile(blob);
    const resumeMarkdown = result.markdown || result.text || "";

    if (!resumeMarkdown) {
      throw new Error("LlamaParse returned empty content. The document might be unreadable.");
    }

    // Fetch user context
    const user = await User.findById(req.userId);
    if (!user) throw new Error("User not found");

    // Analyze with AI (Groq)
    console.log("🤖 Generating strategic resume analysis...");
    const analysis = await analyzeResumeContent(resumeMarkdown, user);

    // 🛡️ Content Validation Check
    if (analysis.isResume === false) {
      return res.status(400).json({
        message: analysis.validationError || "The uploaded document does not appear to be a resume. Please upload a professional career document."
      });
    }

    // Update user record
    user.resumeAnalyzed = true;
    user.resumeData = analysis;
    await user.save();

    res.json({
      success: true,
      analysis,
      message: "Resume Intelligence analysis complete"
    });

  } catch (error) {
    console.error("❌ Resume intelligence error:", error);
    res.status(500).json({
      message: error.message || "Failed to process resume with Llama Intelligence"
    });
  } finally {
    // Cleanup temporary file
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error("Failed to delete temp file:", e);
      }
    }
  }
});

// GET /api/resume/status
router.get("/status", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('resumeAnalyzed resumeData');
    res.json({
      analyzed: user.resumeAnalyzed || false,
      data: user.resumeData || null
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume status" });
  }
});

module.exports = router;