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

// ✅ Comprehensive ATS-Based Resume Analysis Engine
function calculateATSScore(resumeText, detectedRole) {
  const lowerText = resumeText.toLowerCase();
  let atsScore = 0;
  const maxScore = 100;
  const factors = {
    formatting: 0,
    keywords: 0,
    structure: 0,
    content: 0,
    contact: 0
  };

  // 1. FORMATTING CHECK (20 points)
  const hasStandardFont = !lowerText.match(/[^\x00-\x7F]/g) || lowerText.length < 1000; // Simple check
  const hasBulletPoints = (lowerText.match(/[•\-\*]/g) || []).length >= 5;
  const hasProperSpacing = lowerText.split('\n').length > 10;
  const noComplexFormatting = !lowerText.includes('table') && !lowerText.includes('column');
  
  factors.formatting = (hasStandardFont ? 5 : 0) + (hasBulletPoints ? 5 : 0) + 
                       (hasProperSpacing ? 5 : 0) + (noComplexFormatting ? 5 : 0);

  // 2. KEYWORD OPTIMIZATION (25 points)
  const commonATSKeywords = {
    technical: ['javascript', 'python', 'java', 'sql', 'react', 'node', 'aws', 'docker', 'git', 'api'],
    soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'collaboration'],
    action: ['developed', 'implemented', 'managed', 'created', 'designed', 'optimized', 'improved', 'led']
  };
  
  let keywordScore = 0;
  Object.values(commonATSKeywords).forEach(category => {
    const found = category.filter(kw => lowerText.includes(kw)).length;
    keywordScore += Math.min(8, found * 2);
  });
  factors.keywords = Math.min(25, keywordScore);

  // 3. STRUCTURE & SECTIONS (20 points)
  const hasContact = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText) && 
                     /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasSummary = (lowerText.includes('summary') || lowerText.includes('objective') || 
                     lowerText.includes('profile')) && lowerText.split('summary')[1]?.length > 50;
  const hasExperience = (lowerText.includes('experience') || lowerText.includes('work history') || 
                        lowerText.includes('employment')) && lowerText.split('experience')[1]?.length > 100;
  const hasEducation = (lowerText.includes('education') || lowerText.includes('degree') || 
                       lowerText.includes('university')) && lowerText.split('education')[1]?.length > 50;
  const hasSkills = (lowerText.includes('skills') || lowerText.includes('technical skills') || 
                    lowerText.includes('competencies')) && lowerText.split('skills')[1]?.length > 30;

  factors.structure = (hasContact ? 4 : 0) + (hasSummary ? 4 : 0) + (hasExperience ? 5 : 0) + 
                      (hasEducation ? 4 : 0) + (hasSkills ? 3 : 0);

  // 4. CONTENT QUALITY (25 points)
  const wordCount = resumeText.split(/\s+/).length;
  const hasQuantifiableMetrics = /\b(\d+%|\d+\$|\d+\s*(years?|months?)|increased|decreased|improved|reduced|saved|generated)\b/i.test(resumeText);
  const hasActionVerbs = /\b(developed|created|implemented|managed|led|designed|built|optimized|improved|achieved|delivered|executed)\b/i.test(resumeText);
  const hasRelevantExperience = wordCount > 300 && (lowerText.includes('project') || lowerText.includes('role') || lowerText.includes('responsibility'));
  const hasAchievements = lowerText.includes('achievement') || lowerText.includes('accomplishment') || hasQuantifiableMetrics;

  factors.content = (wordCount > 200 ? 5 : 0) + (wordCount > 400 ? 5 : 0) + 
                    (hasQuantifiableMetrics ? 5 : 0) + (hasActionVerbs ? 5 : 0) + 
                    (hasRelevantExperience ? 3 : 0) + (hasAchievements ? 2 : 0);

  // 5. CONTACT & PROFESSIONAL LINKS (10 points)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const hasPortfolio = /github\.com|portfolio|website|http/i.test(resumeText);

  factors.contact = (hasEmail ? 3 : 0) + (hasPhone ? 3 : 0) + (hasLinkedIn ? 2 : 0) + (hasPortfolio ? 2 : 0);

  // Calculate total ATS score
  atsScore = Object.values(factors).reduce((sum, val) => sum + val, 0);
  
  // Normalize to odd number between 45-87 (realistic ATS scores)
  const normalizedScore = Math.max(45, Math.min(87, atsScore));
  const finalATSScore = normalizedScore % 2 === 0 ? normalizedScore + 1 : normalizedScore;

  return {
    score: finalATSScore,
    breakdown: factors,
    issues: generateATSIssues(factors, resumeText),
    recommendations: generateATSRecommendations(factors, resumeText, detectedRole)
  };
}

function generateATSIssues(factors, resumeText) {
  const issues = [];
  const lowerText = resumeText.toLowerCase();

  if (factors.formatting < 15) {
    issues.push("Resume formatting may not parse correctly in ATS systems - use standard fonts and simple layouts");
  }
  if (factors.keywords < 15) {
    issues.push("Insufficient industry keywords detected - ATS systems may not match your resume to job postings");
  }
  if (factors.structure < 15) {
    issues.push("Missing standard resume sections - ATS systems rely on predictable section headers");
  }
  if (factors.content < 15) {
    issues.push("Content lacks quantifiable achievements - ATS systems prioritize resumes with metrics");
  }
  if (factors.contact < 7) {
    issues.push("Incomplete contact information - critical for ATS parsing and recruiter outreach");
  }

  // Specific formatting issues
  if (lowerText.includes('table') || lowerText.includes('column')) {
    issues.push("Complex formatting (tables/columns) may not render correctly in ATS systems");
  }
  if (!/[\w.-]+@[\w.-]+\.\w+/.test(resumeText)) {
    issues.push("Missing email address - required for ATS contact parsing");
  }
  if (!/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText)) {
    issues.push("Missing phone number - standard requirement for ATS systems");
  }

  return issues.length > 0 ? issues : ["Resume appears ATS-compatible with minor optimization opportunities"];
}

function generateATSRecommendations(factors, resumeText, detectedRole) {
  const recommendations = [];
  const lowerText = resumeText.toLowerCase();

  if (factors.keywords < 20) {
    const roleKeywords = {
      'developer': ['JavaScript', 'React', 'Node.js', 'Git', 'REST API', 'Agile'],
      'engineer': ['Python', 'Docker', 'AWS', 'CI/CD', 'Microservices', 'Testing'],
      'designer': ['UI/UX', 'Figma', 'Prototyping', 'User Research', 'Design Systems'],
      'analyst': ['SQL', 'Data Analysis', 'Excel', 'Reporting', 'Business Intelligence']
    };
    const relevantKeywords = roleKeywords[detectedRole?.toLowerCase().split(' ')[0] || 'developer'] || roleKeywords['developer'];
    recommendations.push(`Add these ATS keywords: ${relevantKeywords.slice(0, 5).join(', ')}`);
  }

  if (factors.content < 20) {
    recommendations.push("Add 3-5 bullet points with quantifiable metrics (e.g., 'Increased performance by 40%', 'Managed team of 5')");
  }

  if (factors.structure < 15) {
    recommendations.push("Ensure all standard sections are present: Contact, Summary, Experience, Education, Skills");
  }

  if (factors.formatting < 15) {
    recommendations.push("Use simple, clean formatting - avoid tables, columns, and complex layouts");
  }

  if (!/linkedin\.com/i.test(resumeText)) {
    recommendations.push("Add LinkedIn profile URL - many ATS systems extract and verify social profiles");
  }

  if (!/\b(\d+%|\d+\$|\d+\s*(years?|months?))\b/i.test(resumeText)) {
    recommendations.push("Quantify achievements with specific numbers, percentages, or timeframes");
  }

  return recommendations.length > 0 ? recommendations : ["Resume is well-optimized for ATS systems"];
}

// ✅ Enhanced AI-Powered Resume Analysis with Real ATS Scoring
async function analyzeResumeWithAI(resumeText, userProfile) {
  // First, perform comprehensive ATS analysis
  const atsAnalysis = calculateATSScore(resumeText, null);
  
  if (!USE_OPENAI || !openai) {
    const basicAnalysis = generateBasicAnalysis(resumeText);
    return {
      ...basicAnalysis,
      atsAnalysis: {
        score: atsAnalysis.score,
        breakdown: atsAnalysis.breakdown,
        issues: atsAnalysis.issues,
        recommendations: atsAnalysis.recommendations
      }
    };
  }

  try {
    const prompt = `You are a senior technical recruiter and ATS specialist with 20+ years of experience at Fortune 500 companies. You understand exactly how Applicant Tracking Systems parse and rank resumes. Analyze this resume with brutal honesty and specificity.

USER CONTEXT:
- Name: ${userProfile.name || 'Not provided'}
- Field of Study: ${userProfile.course || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}

RESUME TEXT:
"""
${resumeText.substring(0, 6000)}
"""

ATS SCORE BREAKDOWN (already calculated):
- Formatting: ${atsAnalysis.breakdown.formatting}/20
- Keywords: ${atsAnalysis.breakdown.keywords}/25
- Structure: ${atsAnalysis.breakdown.structure}/20
- Content: ${atsAnalysis.breakdown.content}/25
- Contact: ${atsAnalysis.breakdown.contact}/10
- TOTAL ATS SCORE: ${atsAnalysis.score}/100

ANALYSIS REQUIREMENTS:
1. **ATS Optimization**: Provide specific feedback on how to improve ATS compatibility
2. **Role Detection**: Identify the most likely target role with high specificity
3. **Real Strengths**: Identify actual strengths from the resume content (be specific, reference exact technologies/achievements)
4. **Real Weaknesses**: Identify actual weaknesses and gaps (be honest and specific)
5. **Market Positioning**: Compare against industry standards for the detected role

Provide analysis in this EXACT JSON structure:
{
  "score": 78,
  "summary": "3-4 sentence comprehensive assessment covering overall quality, ATS compatibility, role fit, and market competitiveness",
  "detectedRole": "Most specific role title (e.g., 'Senior Full-Stack JavaScript Developer', 'Mid-Level Python Data Engineer', 'Frontend React Developer')",
  "experienceLevel": "Entry/Junior/Mid/Senior/Lead - based on actual experience in resume",
  "marketCompetitiveness": "Low/Moderate/Strong/Exceptional",
  "strengths": [
    "Specific strength with exact resume reference: 'Strong React expertise demonstrated through [specific project/experience mentioned]'",
    "Quantified achievement: 'Led team of 5 developers, resulting in 40% performance improvement'",
    "Technology-specific: 'Proficient in AWS cloud infrastructure with hands-on experience in [specific service]'",
    "Unique value: 'Specialized expertise in [specific technology/methodology] that sets candidate apart'"
  ],
  "criticalWeaknesses": [
    "Critical gap: 'Missing fundamental knowledge of [specific technology] required for target role'",
    "Experience gap: 'No demonstrated experience with [industry-standard tool/framework]'",
    "Quantification issue: 'Achievements lack specific metrics - cannot assess real impact'",
    "Structure problem: 'Experience section doesn't clearly show career progression or impact'"
  ],
  "minorWeaknesses": [
    "Enhancement: 'Could strengthen professional summary with more specific career objectives'",
    "Optimization: 'Consider adding more industry-relevant keywords for better ATS matching'",
    "Content depth: 'Some bullet points could be more detailed about technical challenges overcome'",
    "Networking: 'LinkedIn profile optimization could improve recruiter discoverability'"
  ],
  "improvements": [
    "Immediate: 'Add 3-5 bullet points with quantifiable metrics (percentages, dollar amounts, team sizes)'",
    "ATS: 'Incorporate these exact keywords: [list 5-7 role-specific ATS keywords]'",
    "Content: 'Rewrite professional summary to include [specific keywords] and [quantified achievement]'",
    "Structure: 'Reorganize experience section to highlight career progression and impact'",
    "Skills: 'Add proficiency levels for technical skills (e.g., Advanced: React, Intermediate: Node.js)'",
    "Projects: 'Include links to GitHub repositories and live project demos'"
  ],
  "keywords": {
    "present": ["exact keywords found in resume - be specific"],
    "missing": ["critical ATS keywords missing for target role"],
    "recommended": ["additional keywords to improve ATS matching"],
    "overused": ["keywords that appear too frequently (may trigger spam filters)"]
  },
  "sections": {
    "contact": "Detailed assessment with specific recommendations",
    "summary": "Analysis of professional summary with specific improvements",
    "experience": "Comprehensive review of experience section with actionable feedback",
    "education": "Assessment of education section with enhancement suggestions",
    "skills": "Detailed analysis of skills section with optimization tips",
    "projects": "Review of projects section with portfolio recommendations",
    "certifications": "Assessment of certifications with industry relevance"
  },
  "atsCompatibility": ${atsAnalysis.score},
  "atsIssues": ${JSON.stringify(atsAnalysis.issues)},
  "atsRecommendations": ${JSON.stringify(atsAnalysis.recommendations)},
  "industryInsights": {
    "salaryRange": "Expected salary range for detected role in user's location",
    "keySkills": ["Top 5 in-demand skills for this role in 2024"],
    "trending": ["Emerging technologies/methodologies to learn"],
    "competition": "Market competitiveness assessment"
  },
  "recommendations": [
    "Priority 1: [Specific, actionable recommendation with timeline]",
    "Priority 2: [Measurable goal with expected outcome]",
    "Priority 3: [Skill development or certification path]",
    "Priority 4: [Networking or portfolio building strategy]",
    "Priority 5: [Interview preparation or application strategy]"
  ]
}

CRITICAL INSTRUCTIONS:
- Reference EXACT technologies, tools, and achievements mentioned in the resume
- Be brutally honest about weaknesses - no resume is perfect
- Make all feedback specific and actionable
- ATS score is already calculated - focus on explaining WHY and HOW to improve
- Ensure strengths and weaknesses are unique to THIS resume, not generic templates
- Include quantifiable metrics in feedback wherever possible
- Consider the candidate's location for industry insights
- Make recommendations time-bound and measurable`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior technical recruiter and ATS specialist with 20+ years of experience. You've reviewed over 50,000 resumes and understand exactly how ATS systems work. Provide brutally honest, specific, and actionable feedback that references exact content from the resume."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        ...analysis,
        atsAnalysis: {
          score: atsAnalysis.score,
          breakdown: atsAnalysis.breakdown,
          issues: atsAnalysis.issues,
          recommendations: atsAnalysis.recommendations
        },
        aiGenerated: true,
        analyzedAt: new Date()
      };
    }

    throw new Error("Could not parse AI response");
  } catch (error) {
    console.error("AI analysis error:", error.message);
    const basicAnalysis = generateBasicAnalysis(resumeText);
    return {
      ...basicAnalysis,
      atsAnalysis: {
        score: atsAnalysis.score,
        breakdown: atsAnalysis.breakdown,
        issues: atsAnalysis.issues,
        recommendations: atsAnalysis.recommendations
      }
    };
  }
}

// Enhanced Fallback Basic Analysis
function generateBasicAnalysis(resumeText) {
  const words = resumeText.split(/\s+/).length;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const hasGitHub = /github\.com/i.test(resumeText);

  // Enhanced skill detection with categories
  const skillCategories = {
    frontend: ['javascript', 'typescript', 'react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap'],
    backend: ['node', 'express', 'python', 'django', 'flask', 'java', 'spring', 'php', 'ruby', 'rails'],
    database: ['mongodb', 'postgresql', 'mysql', 'sql', 'redis', 'oracle', 'sqlite'],
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
    tools: ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'slack', 'postman'],
    soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'agile', 'scrum']
  };

  const presentSkills = { frontend: [], backend: [], database: [], cloud: [], tools: [], soft: [] };
  const lowerText = resumeText.toLowerCase();

  Object.entries(skillCategories).forEach(([category, skills]) => {
    skills.forEach(skill => {
      if (lowerText.includes(skill)) {
        presentSkills[category].push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
  });

  const allSkills = Object.values(presentSkills).flat();
  const totalSkills = allSkills.length;

  // Enhanced scoring algorithm
  let score = 40; // Base score

  // Contact information (15 points max)
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn) score += 3;
  if (hasGitHub) score += 2;

  // Content length (15 points max)
  if (words > 150) score += 5;
  if (words > 300) score += 5;
  if (words > 500) score += 5;

  // Skills diversity (20 points max)
  if (totalSkills > 2) score += 5;
  if (totalSkills > 5) score += 5;
  if (totalSkills > 8) score += 5;
  if (totalSkills > 12) score += 5;

  // Technical depth (10 points max)
  const hasMultipleCategories = Object.values(presentSkills).filter(skills => skills.length > 0).length;
  if (hasMultipleCategories >= 2) score += 3;
  if (hasMultipleCategories >= 3) score += 4;
  if (hasMultipleCategories >= 4) score += 3;

  // Detect role with enhanced logic
  let detectedRole = "Software Developer";
  let experienceLevel = "Entry Level";

  if (presentSkills.frontend.length >= 3 && presentSkills.backend.length >= 2) {
    detectedRole = "Full-Stack Developer";
    experienceLevel = totalSkills > 10 ? "Mid Level" : "Entry Level";
  } else if (presentSkills.frontend.length >= 3) {
    detectedRole = "Frontend Developer";
    experienceLevel = presentSkills.frontend.length > 5 ? "Mid Level" : "Entry Level";
  } else if (presentSkills.backend.length >= 3) {
    detectedRole = "Backend Developer";
    experienceLevel = presentSkills.backend.length > 5 ? "Mid Level" : "Entry Level";
  } else if (presentSkills.database.length >= 2) {
    detectedRole = "Database Developer";
  } else if (presentSkills.cloud.length >= 3) {
    detectedRole = "DevOps Engineer";
    experienceLevel = "Mid Level";
  }

  // Dynamic strengths analysis based on actual resume content
  const strengths = [];

  // Contact and networking strengths
  if (hasEmail && hasPhone) strengths.push("Professional contact information complete and accessible");
  if (hasLinkedIn) strengths.push("Active LinkedIn presence for professional networking");
  if (hasGitHub) strengths.push("GitHub portfolio showcases practical coding experience");

  // Skills-based strengths
  if (totalSkills > 8) strengths.push(`Impressive technical arsenal with ${totalSkills} relevant skills`);
  else if (totalSkills > 5) strengths.push(`Solid technical foundation with ${totalSkills} applicable skills`);

  if (hasMultipleCategories >= 4) strengths.push("Exceptionally well-rounded expertise across technology stack");
  else if (hasMultipleCategories >= 3) strengths.push("Balanced skill set spanning multiple technical domains");

  // Content quality strengths
  if (words > 500) strengths.push("Comprehensive content demonstrating extensive experience");
  else if (words > 400) strengths.push("Detailed descriptions showing depth of involvement");

  // Extract specific strengths from content
  if (lowerText.includes('team') || lowerText.includes('collaborat')) strengths.push("Demonstrated teamwork and collaboration experience");
  if (lowerText.includes('project') && lowerText.includes('success')) strengths.push("Proven track record of successful project delivery");
  if (lowerText.includes('leadership') || lowerText.includes('led')) strengths.push("Leadership experience in technical initiatives");
  if (lowerText.includes('certification') || lowerText.includes('certified')) strengths.push("Professional certifications validating expertise");
  if (lowerText.includes('award') || lowerText.includes('recognition')) strengths.push("Recognition and awards for outstanding performance");

  // Technology-specific strengths
  if (presentSkills.frontend.length > 0 && presentSkills.backend.length > 0) {
    strengths.push("Full-stack development capability bridging frontend and backend");
  }
  if (presentSkills.cloud.length > 0) strengths.push("Modern cloud technology proficiency");
  if (presentSkills.database.length > 0) strengths.push("Strong database design and management skills");

  // Ensure at least 3 strengths for positive feedback
  if (strengths.length < 3) {
    if (totalSkills > 0) strengths.push(`Technical proficiency in ${presentSkills.frontend.concat(presentSkills.backend).slice(0, 3).join(', ')}`);
    strengths.push("Clear and professional presentation format");
    strengths.push("Well-structured content organization");
  }

  // Dynamic weaknesses analysis based on actual resume content
  const criticalWeaknesses = [];
  const minorWeaknesses = [];

  // Critical issues based on content analysis
  if (!hasEmail || !hasPhone) criticalWeaknesses.push("Missing contact information - essential for employer communication");
  if (totalSkills < 3) criticalWeaknesses.push("Limited technical skill set - expand expertise for better market fit");
  if (words < 200) criticalWeaknesses.push("Resume lacks sufficient detail about experience and achievements");

  // Dynamic critical weaknesses based on content gaps
  if (!lowerText.includes('education') && !lowerText.includes('degree')) {
    criticalWeaknesses.push("Missing education section - important for qualification verification");
  }
  if (!lowerText.includes('experience') && !lowerText.includes('work')) {
    criticalWeaknesses.push("No professional experience section - critical for most roles");
  }
  if (hasMultipleCategories === 1 && totalSkills > 3) {
    criticalWeaknesses.push("Skills too concentrated in one area - broaden technical expertise");
  }

  // Dynamic minor weaknesses based on content analysis
  const contentGaps = [];

  if (!hasLinkedIn) contentGaps.push("Add LinkedIn profile to enhance professional networking presence");
  if (!hasGitHub && (presentSkills.frontend.length > 0 || presentSkills.backend.length > 0)) {
    contentGaps.push("Include GitHub/portfolio links to showcase coding projects");
  }
  if (!lowerText.includes('certification') && !lowerText.includes('course') && !lowerText.includes('training')) {
    contentGaps.push("Add relevant certifications or courses to demonstrate continuous learning");
  }
  if (!lowerText.includes('project') && !hasGitHub) {
    contentGaps.push("Include specific projects to demonstrate practical application of skills");
  }

  // Technology-specific gaps
  if (detectedRole === "Full-Stack Developer" && presentSkills.database.length === 0) {
    contentGaps.push("Full-stack role needs database skills - consider adding SQL/NoSQL experience");
  }
  if (detectedRole === "Frontend Developer" && !presentSkills.frontend.some(s => ['react', 'angular', 'vue'].includes(s.toLowerCase()))) {
    contentGaps.push("Frontend role would benefit from modern framework experience");
  }
  if (detectedRole === "Backend Developer" && presentSkills.cloud.length === 0) {
    contentGaps.push("Backend development increasingly requires cloud platform knowledge");
  }

  // Content quality issues
  if (!/\b\d+%|\b\d+\$|\b\d+ percent|\bincreased|\breduced|\bimproved|\boptimized/i.test(lowerText)) {
    contentGaps.push("Quantify achievements with specific metrics (percentages, dollar amounts, numbers)");
  }
  if (!/\bled\b|\bmanaged\b|\bdeveloped\b|\bcreated\b|\bimplemented\b|\bdesigned\b/i.test(lowerText)) {
    contentGaps.push("Use stronger action verbs to describe accomplishments and responsibilities");
  }

  // Add dynamic content gaps to minor weaknesses
  minorWeaknesses.push(...contentGaps.slice(0, 3)); // Limit to 3 most relevant

  // Always include market optimization suggestions
  minorWeaknesses.push("Review and update keywords to match current job market requirements");
  minorWeaknesses.push("Consider tailoring resume content for specific job applications");

  // Ensure minimum weaknesses for constructive feedback
  if (criticalWeaknesses.length === 0) {
    if (words < 300) {
      criticalWeaknesses.push("Expand on experience details to better showcase capabilities");
    } else {
      criticalWeaknesses.push("Consider strengthening professional summary with specific career objectives");
    }
  }

  // Ensure we have at least 4 total weaknesses
  while (criticalWeaknesses.length + minorWeaknesses.length < 4) {
    if (criticalWeaknesses.length < 2) {
      criticalWeaknesses.push("Professional summary could be more specific about career goals and strengths");
    } else {
      minorWeaknesses.push("Consider adding professional development activities or volunteer work");
    }
  }

  // Enhanced improvements with specificity
  const improvements = [
    "Add specific metrics to achievements (e.g., 'Improved application performance by 40%' instead of 'Improved performance')",
    "Include action verbs at the start of each bullet point (Led, Developed, Implemented, Optimized)",
    "Add a professional summary highlighting your key strengths and career goals",
    "Include links to portfolio, GitHub, or LinkedIn profile",
    "Quantify your impact with numbers, percentages, or dollar amounts wherever possible",
    "Tailor resume keywords to match job descriptions you're interested in",
    "Add relevant certifications or courses to show continuous learning"
  ];

  // Enhanced keyword analysis
  const recommendedKeywords = {
    "Full-Stack Developer": ["React", "Node.js", "REST APIs", "Database Design", "Agile", "Git"],
    "Frontend Developer": ["JavaScript", "React", "CSS", "Responsive Design", "UI/UX", "Version Control"],
    "Backend Developer": ["Python", "APIs", "Database", "Security", "Scalability", "Testing"],
    "DevOps Engineer": ["AWS", "Docker", "CI/CD", "Monitoring", "Infrastructure", "Automation"]
  };

  const missing = recommendedKeywords[detectedRole] ?
    recommendedKeywords[detectedRole].filter(k => !allSkills.some(s => s.toLowerCase().includes(k.toLowerCase()))) :
    ["Project Management", "Agile/Scrum", "Testing", "Version Control"];

  // Enhanced section analysis
  const sections = {
    contact: hasEmail && hasPhone ?
      "Good - Complete contact information present" :
      "Poor - Missing essential contact details (email/phone)",
    summary: words > 100 ?
      "Fair - Content present but could be more impactful" :
      "Poor - Missing professional summary",
    experience: words > 300 ?
      "Good - Detailed experience descriptions" :
      "Fair - Add more specific achievements and responsibilities",
    education: "Fair - Education background present",
    skills: totalSkills > 3 ?
      `Good - ${totalSkills} relevant skills identified across ${hasMultipleCategories} categories` :
      "Poor - Limited skills listed, expand technical expertise",
    projects: hasGitHub ?
      "Good - Portfolio links demonstrate practical experience" :
      "Fair - Consider adding project links or GitHub repository"
  };

  // Use comprehensive ATS analysis
  const atsAnalysis = calculateATSScore(resumeText, detectedRole);

  // Industry insights based on role
  const industryInsights = {
    salaryRange: detectedRole === "Full-Stack Developer" ? "$70,000 - $120,000" :
                 detectedRole === "Frontend Developer" ? "$60,000 - $100,000" :
                 detectedRole === "Backend Developer" ? "$65,000 - $110,000" :
                 "$50,000 - $90,000",
    keySkills: recommendedKeywords[detectedRole] || ["JavaScript", "Python", "SQL", "Git", "Agile"],
    trending: ["Cloud Computing", "AI/ML Integration", "Microservices", "DevOps"],
    competition: "High - Strong technical skills and portfolio required"
  };

  // Enhanced roadmap
  const roadmap = [
    {
      title: "Phase 1: Foundation (Weeks 1-4)",
      desc: `Build core skills for ${detectedRole}. Focus on fundamentals and basic projects.`,
      milestones: ["Complete 3 beginner projects", "Learn version control", "Build personal portfolio"],
      resources: ["freeCodeCamp", "MDN Web Docs", "Codecademy"]
    },
    {
      title: "Phase 2: Intermediate Skills (Weeks 5-12)",
      desc: "Develop intermediate proficiency with frameworks and tools.",
      milestones: ["Complete 2 intermediate projects", "Contribute to open-source", "Learn testing basics"],
      resources: ["Udemy courses", "YouTube tutorials", "Official documentation"]
    },
    {
      title: "Phase 3: Advanced Mastery (Weeks 13-24)",
      desc: "Master advanced concepts and build complex applications.",
      milestones: ["Lead a team project", "Get first developer job", "Build production app"],
      resources: ["Advanced courses", "Tech conferences", "Mentorship"]
    },
    {
      title: "Phase 4: Expert Level (Weeks 25-52)",
      desc: "Become recognized expert and pursue leadership roles.",
      milestones: ["Mentor junior developers", "Speak at meetups", "Lead major projects"],
      resources: ["Industry networking", "Leadership courses", "Advanced certifications"]
    }
  ];

  return {
    score: Math.min(100, score),
    summary: `${experienceLevel} ${detectedRole} resume with ${words} words and ${totalSkills} technical skills. ${score >= 75 ? 'Strong foundation with good market potential.' : score >= 60 ? 'Solid base with room for enhancement.' : 'Needs significant improvement to compete effectively.'}`,
    detectedRole,
    experienceLevel,
    marketCompetitiveness: score >= 80 ? "Strong" : score >= 65 ? "Moderate" : "Developing",
    strengths: strengths.length > 0 ? strengths : ["Clean, readable format"],
    weaknesses: [...criticalWeaknesses, ...minorWeaknesses],
    criticalWeaknesses: criticalWeaknesses.length > 0 ? criticalWeaknesses : ["Consider adding more quantifiable achievements"],
    minorWeaknesses,
    improvements,
    keywords: {
      present: allSkills.slice(0, 10),
      missing,
      recommended: recommendedKeywords[detectedRole] || [],
      overused: []
    },
    sections,
    atsCompatibility: atsAnalysis.score,
    atsAnalysis: {
      score: atsAnalysis.score,
      breakdown: atsAnalysis.breakdown,
      issues: atsAnalysis.issues,
      recommendations: atsAnalysis.recommendations
    },
    industryInsights,
    recommendations: [
      `Focus on ${detectedRole} specific skills and certifications`,
      "Build a strong portfolio with diverse projects",
      "Network on LinkedIn and GitHub to increase visibility",
      "Practice coding interviews and technical assessments",
      "Contribute to open-source projects to build credibility"
    ],
    roadmap,
    nextSteps: [
      "This Week: Update resume with specific metrics and achievements",
      "This Month: Complete one significant project and add to portfolio",
      "3 Months: Obtain relevant certification and update LinkedIn",
      "6 Months: Apply to 50+ positions and track interview feedback"
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