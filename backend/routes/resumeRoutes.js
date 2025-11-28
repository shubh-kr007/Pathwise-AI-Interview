const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// OpenAI setup (safe initialization)
let openai = null;
let USE_OPENAI = false;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20) {
    const OpenAI = require("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    USE_OPENAI = true;
    console.log("✅ OpenAI initialized for resume analysis");
  } else {
    console.log("⚠️ OpenAI not configured - using basic resume analysis");
  }
} catch (error) {
  console.log("⚠️ OpenAI initialization failed");
}

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files allowed'));
    }
  }
});

// Parse resume from buffer
async function parseResume(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (mimetype.includes('word') || mimetype.includes('document')) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error('Unsupported file type');
  } catch (error) {
    throw new Error(`Parse error: ${error.message}`);
  }
}

// ✅ AI-Powered Resume Analysis
async function analyzeResumeWithAI(resumeText, userProfile) {
  if (!USE_OPENAI || !openai) {
    return generateBasicAnalysis(resumeText);
  }

  try {
    const prompt = `Analyze this resume and provide detailed, actionable feedback.

User Profile:
- Name: ${userProfile.name || 'Not provided'}
- Course/Field: ${userProfile.course || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}

Resume Text:
"""
${resumeText.substring(0, 4000)}
"""

Provide analysis in this EXACT JSON structure:
{
  "score": 75,
  "summary": "2-3 sentence professional summary of the resume quality and fit",
  "strengths": ["Specific strength 1 with example from resume", "Specific strength 2", "Specific strength 3"],
  "weaknesses": ["Specific weakness 1 with suggestion", "Specific weakness 2", "Specific weakness 3"],
  "improvements": [
    "Actionable improvement 1 (be specific)",
    "Actionable improvement 2",
    "Actionable improvement 3",
    "Actionable improvement 4"
  ],
  "keywords": {
    "present": ["skill1", "skill2", "skill3"],
    "missing": ["recommended skill1", "recommended skill2"]
  },
  "sections": {
    "contact": "Good/Fair/Poor - specific feedback",
    "experience": "Good/Fair/Poor - specific feedback",
    "education": "Good/Fair/Poor - specific feedback",
    "skills": "Good/Fair/Poor - specific feedback"
  },
  "atsCompatibility": 85,
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ]
}

Be specific, reference actual content from the resume, and provide actionable advice.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer and career coach with 15+ years of experience. Provide detailed, honest, and actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        ...analysis,
        aiGenerated: true,
        analyzedAt: new Date()
      };
    }
    
    throw new Error("Could not parse AI response");
  } catch (error) {
    console.error("AI analysis error:", error.message);
    return generateBasicAnalysis(resumeText);
  }
}

// Fallback basic analysis
function generateBasicAnalysis(resumeText) {
  const words = resumeText.split(/\s+/).length;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  
  // Extract skills
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'mongodb', 'sql',
    'html', 'css', 'docker', 'kubernetes', 'aws', 'git', 'typescript',
    'angular', 'vue', 'express', 'django', 'flask', 'postgresql', 'redis',
    'leadership', 'communication', 'teamwork', 'problem solving'
  ];
  
  const presentSkills = [];
  const lowerText = resumeText.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      presentSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  // Calculate score
  let score = 50;
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (words > 200) score += 10;
  if (words > 400) score += 10;
  if (presentSkills.length > 3) score += 10;
  if (presentSkills.length > 6) score += 10;
  
  const strengths = [];
  const weaknesses = [];
  
  if (hasEmail && hasPhone) strengths.push("Complete contact information provided");
  if (presentSkills.length > 3) strengths.push(`Good skill diversity: ${presentSkills.length} skills identified`);
  if (words > 400) strengths.push("Comprehensive content with good detail");
  
  if (!hasEmail || !hasPhone) weaknesses.push("Missing contact information");
  if (words < 200) weaknesses.push("Resume is too brief - add more detail about your experience");
  if (presentSkills.length < 3) weaknesses.push("Limited technical skills mentioned");
  
  return {
    score: Math.min(100, score),
    summary: `Your resume has ${words} words and mentions ${presentSkills.length} relevant skills. ${score >= 70 ? 'Good foundation with room for improvement.' : 'Needs significant enhancement to stand out.'}`,
    strengths: strengths.length > 0 ? strengths : ["Resume structure is readable"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Add more quantifiable achievements"],
    improvements: [
      "Add specific metrics and numbers to achievements (e.g., 'Increased performance by 30%')",
      "Include action verbs at the start of bullet points",
      "Tailor resume to specific job descriptions",
      "Add a professional summary at the top"
    ],
    keywords: {
      present: presentSkills.slice(0, 8),
      missing: ["Project Management", "Agile/Scrum", "Data Analysis"].filter(k => !presentSkills.includes(k))
    },
    sections: {
      contact: hasEmail && hasPhone ? "Good - Contact info present" : "Poor - Missing contact details",
      experience: words > 300 ? "Good - Detailed experience" : "Fair - Add more details",
      education: "Fair - Present but could be enhanced",
      skills: presentSkills.length > 3 ? "Good - Diverse skill set" : "Poor - Add more skills"
    },
    atsCompatibility: score,
    recommendations: [
      "Use standard section headings (Experience, Education, Skills)",
      "Save in PDF format for better ATS compatibility",
      "Include relevant keywords from target job descriptions",
      "Keep formatting simple and clean"
    ],
    aiGenerated: false,
    analyzedAt: new Date()
  };
}

// POST /api/resume/analyze
router.post("/analyze", verifyToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Parse resume text
    const text = await parseResume(req.file.buffer, req.file.mimetype);
    
    // Get user profile for context
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get AI analysis
    const analysis = await analyzeResumeWithAI(text, user);
    
    // Save analysis to user profile
    user.resumeAnalyzed = true;
    user.resumeData = analysis;
    await user.save();
    
    res.json({
      success: true,
      analysis,
      message: "Resume analyzed successfully"
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to analyze resume" 
    });
  }
});

// GET /api/resume/status - Check if user has analyzed resume
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