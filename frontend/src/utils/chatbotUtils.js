// --- Expanded FAQ Database for Pathwise ---
export const FAQ = [
  // Greetings and General
  { keywords: ["hi", "hello", "hey", "greetings"], responses: ["Hey there 👋 How can I help you with your career journey today?"] },
  { keywords: ["bye", "goodbye", "see you", "thanks", "thank you", "thx"], responses: ["You're welcome! 😊 Keep practicing and good luck!", "Goodbye 👋 Stay confident!"] },

  // About Pathwise
  { keywords: ["what is pathwise", "about pathwise", "pathwise"], responses: ["Pathwise is your AI-powered career companion! 🚀 We help with interview prep, resume analysis, application tracking, and personalized roadmaps. Explore features like mock interviews, video analysis, and progress tracking."] },
  { keywords: ["features", "what can you do", "capabilities"], responses: ["Pathwise offers: Mock interviews, resume & video analysis, application tracking, personalized roadmaps, interview tips, and more! 🤖 Check out Dashboard for your progress."] },

  // Dashboard
  { keywords: ["dashboard", "my progress", "stats", "overview"], responses: ["Your Dashboard shows interview attempts, scores, applications, and roadmaps. 📊 Go to /dashboard to view your personalized stats and track progress!"] },

  // Interviews
  { keywords: ["interview", "mock interview", "practice interview"], responses: ["Ready for a mock interview? 🎭 Head to /interview to start HR or Technical rounds. Practice STAR answers and get feedback!"] },
  { keywords: ["interview tips", "how to prepare", "tips"], responses: ["💼 Prep tips: Research company, use STAR method, practice coding, review resume. Check /interview-tips for detailed guides!"] },
  { keywords: ["interview room", "start interview"], responses: ["Enter the Interview Room at /interview-room for live practice. 🎥 Get real-time feedback on your responses!"] },

  // Profile & Settings
  { keywords: ["profile", "settings", "update profile"], responses: ["Manage your profile at /profile: Update details, view scores, and customize your experience. 📝"] },
  { keywords: ["personalized roadmap", "roadmap"], responses: ["Get a tailored career roadmap at /personalized-roadmap based on your goals and progress. 🗺️"] },

  // Applications & Tracking
  { keywords: ["application tracker", "track applications", "job applications"], responses: ["Track your job applications in the Application Tracker. 📋 Monitor statuses, deadlines, and follow-ups from Dashboard."] },
  { keywords: ["resume", "cv", "resume analysis"], responses: ["Upload your resume for AI analysis. 📄 Get suggestions to improve keywords, structure, and impact. Available in Dashboard."] },

  // Help & Support
  { keywords: ["help", "support", "faq", "questions"], responses: ["Need help? Visit /help for FAQs, tutorials, and contact info. 🤔 Or ask me anything here!"] },
  { keywords: ["contact", "support team"], responses: ["Reach out via /help or email support@pathwise.com. We're here to assist! 📧"] },

  // Weather (existing)
  { keywords: ["weather", "temperature"], responses: ["🌤️ I can fetch weather info! Just say 'weather in [city]' or 'current weather'."] },

  // Behavioral/Technical (expanded)
  { keywords: ["behavioral", "tell me about yourself", "strength", "weakness"], responses: ["💬 For 'Tell me about yourself': Keep it 1-2 min, cover background, skills, goals. Use STAR for strengths/weaknesses.", "Strength example: 'I'm adaptable — I quickly learned React for a project.' Weakness: 'I used to procrastinate, but now I prioritize tasks.'"] },
  { keywords: ["technical", "coding", "data structure", "algorithm"], responses: ["💻 Focus on DSA: Arrays, linked lists, trees, sorting, recursion. Practice on LeetCode. Explain logic aloud in interviews!"] },
  { keywords: ["ai", "artificial intelligence", "ml", "machine learning"], responses: ["🤖 AI prep: Know regression, classification, metrics like accuracy/F1. Explain projects: data prep, model choice, results."] },

  // Projects & Portfolio
  { keywords: ["projects", "portfolio"], responses: ["🚀 Showcase 2-3 projects: Role, tech stack, challenges solved. Use GitHub/portfolio site. Employers love clean code!"] },

  // Communication & Soft Skills
  { keywords: ["communication", "soft skills"], responses: ["🗣️ Soft skills: Clarity, confidence, empathy. Practice explaining tech simply. Body language matters too!"] },

  // Fallback
  { keywords: [], responses: ["🤔 Hmm, I didn't catch that. Try asking about interviews, resumes, or Pathwise features!"] }
];

// --- Helper: Find Matching Response ---
export function findResponse(text, user = null) {
  if (!text) return null;
  const norm = text.toLowerCase();

  // Personalized greeting if user logged in
  if (user && (norm.includes("hi") || norm.includes("hello"))) {
    return `Hi ${user.name || 'there'}! 👋 You've completed ${user.interviewsCompleted || 0} interviews with an average score of ${user.averageScore || 0}%. How can I assist today?`;
  }

  for (let item of FAQ) {
    for (let kw of item.keywords) {
      if (norm.includes(kw)) {
        return item.responses[Math.floor(Math.random() * item.responses.length)];
      }
    }
  }
  return FAQ[FAQ.length - 1].responses[0]; // Fallback
}

// --- Quick Links Helper ---
export function getQuickLinks(response) {
  const links = [];
  if (response.includes("/dashboard")) links.push({ text: "Go to Dashboard", url: "/dashboard" });
  if (response.includes("/interview")) links.push({ text: "Start Interview", url: "/interview" });
  if (response.includes("/profile")) links.push({ text: "Update Profile", url: "/profile" });
  if (response.includes("/help")) links.push({ text: "Get Help", url: "/help" });
  if (response.includes("/personalized-roadmap")) links.push({ text: "View Roadmap", url: "/personalized-roadmap" });
  if (response.includes("/interview-tips")) links.push({ text: "Interview Tips", url: "/interview-tips" });
  return links;
}

// --- Voice Input Helper (Web Speech API) ---
export function startVoiceInput(onResult) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Voice recognition error:", event.error);
  };

  recognition.start();
}
