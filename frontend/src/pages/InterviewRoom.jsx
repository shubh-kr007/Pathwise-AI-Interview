// src/pages/InterviewRoom.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bot, 
  ListChecks, 
  Code2, 
  BookOpenCheck, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  Brain,
  MessageSquare
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import InterviewRoomSkeleton from "../components/InterviewRoomSkeleton";
import AIFeedbackReport from "../components/AIFeedbackReport";
import { useAuth } from "../context/AuthContext";
import sessionManager from "../utils/sessionManager";
import { API_BASE } from "../config/api";

// Modes available
const MODES = [
  { id: "mcq", label: "MCQ Based", icon: ListChecks },
  { id: "coding", label: "Coding Based", icon: Code2 },
  { id: "quiz", label: "Quiz Based", icon: BookOpenCheck },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Question bank for fallback/offline use
const QUESTION_BANK = {
  technical: {
    mcq: [
      {
        id: "t-m-1",
        prompt: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answerIndex: 1,
        explanation: "Binary search splits the search space in half each iteration: O(log n).",
      },
      {
        id: "t-m-2",
        prompt: "Which data structure is best for implementing LRU cache in O(1)?",
        options: ["Array", "Stack", "HashMap + Doubly Linked List", "Queue"],
        answerIndex: 2,
        explanation: "HashMap for lookup + Doubly Linked List for O(1) eviction/move-to-front.",
      },
      {
        id: "t-m-3",
        prompt: "What is a closure in JavaScript?",
        options: ["A function inside another function", "A variable scope", "A function that retains access to outer variables", "A loop structure"],
        answerIndex: 2,
        explanation: "Closure is when a function retains access to variables from its outer scope even after the outer function has executed.",
      },
      {
        id: "t-m-4",
        prompt: "What does 'virtual DOM' mean in React?",
        options: ["A physical copy of DOM", "An in-memory representation of DOM", "A server-side DOM", "A CSS framework"],
        answerIndex: 1,
        explanation: "Virtual DOM is a lightweight copy of the actual DOM kept in memory for efficient updates.",
      },
      {
        id: "t-m-5",
        prompt: "Which of these is NOT a valid HTTP method?",
        options: ["GET", "POST", "FETCH", "DELETE"],
        answerIndex: 2,
        explanation: "FETCH is not an HTTP method. Common methods are GET, POST, PUT, DELETE, PATCH.",
      },
    ],
    coding: [
      {
        id: "t-c-1",
        prompt: "Write a function to return the first non-repeating character in a string.",
        starter: `function firstUniqueChar(s) {\n  // write your solution\n}`,
        rubric: ["Correctness", "Time complexity", "Edge cases (empty, all repeat)"]
      },
      {
        id: "t-c-2",
        prompt: "Implement a function that checks if two strings are anagrams.",
        starter: `function areAnagrams(a, b) {\n  // write your solution\n}`,
        rubric: ["Normalize case/spacing", "Counting vs sorting", "Performance"]
      },
      {
        id: "t-c-3",
        prompt: "Write a function to reverse a linked list.",
        starter: `function reverseList(head) {\n  // write your solution\n}`,
        rubric: ["Pointer manipulation", "Edge cases (empty list)", "Time/Space complexity"]
      },
      {
        id: "t-c-4",
        prompt: "Implement a function to find the maximum subarray sum (Kadane's algorithm).",
        starter: `function maxSubArray(nums) {\n  // write your solution\n}`,
        rubric: ["Dynamic programming approach", "Edge cases", "Optimal solution"]
      },
      {
        id: "t-c-5",
        prompt: "Write a function to detect if a linked list has a cycle.",
        starter: `function hasCycle(head) {\n  // write your solution\n}`,
        rubric: ["Two-pointer technique", "Edge cases", "Space optimization"]
      },
    ],
    quiz: [
      {
        id: "t-q-1",
        prompt: "Briefly describe the difference between processes and threads.",
        placeholder: "Type your answer here...",
        checklist: ["Isolation", "Shared memory", "Context switching"],
      },
      {
        id: "t-q-2",
        prompt: "Explain event loop and microtask queue in JavaScript.",
        placeholder: "Type your answer here...",
        checklist: ["Call stack", "Task vs microtask", "Ordering"]
      },
      {
        id: "t-q-3",
        prompt: "What is the difference between SQL and NoSQL databases?",
        placeholder: "Type your answer here...",
        checklist: ["Schema", "Scalability", "Use cases"]
      },
      {
        id: "t-q-4",
        prompt: "Explain REST API and its constraints.",
        placeholder: "Type your answer here...",
        checklist: ["Stateless", "Uniform interface", "Client-server"]
      },
      {
        id: "t-q-5",
        prompt: "What are promises in JavaScript and how do they work?",
        placeholder: "Type your answer here...",
        checklist: ["Async operations", "States (pending/fulfilled/rejected)", "Then/catch"]
      },
    ],
  },
  behavioral: {
    mcq: [
      {
        id: "b-m-1",
        prompt: "Which structure best fits the STAR method?",
        options: ["Setup, Try, Answer, Result", "Situation, Task, Action, Result", "Scenario, Target, Action, Review", "State, Task, Action, Review"],
        answerIndex: 1,
        explanation: "STAR stands for Situation, Task, Action, Result.",
      },
      {
        id: "b-m-2",
        prompt: "Best response to a conflict question emphasizes...",
        options: ["Blame others", "Avoid details", "Concrete actions/outcomes", "Speak generally"],
        answerIndex: 2,
        explanation: "Use specifics: actions taken and measurable outcomes.",
      },
      {
        id: "b-m-3",
        prompt: "When describing a failure, you should focus on:",
        options: ["What went wrong", "Who was responsible", "What you learned", "Why it wasn't your fault"],
        answerIndex: 2,
        explanation: "Focus on lessons learned and growth from the experience.",
      },
      {
        id: "b-m-4",
        prompt: "In behavioral interviews, 'Tell me about yourself' should:",
        options: ["Cover your entire life story", "Focus on recent relevant experience", "Be under 30 seconds", "Include personal hobbies"],
        answerIndex: 1,
        explanation: "Focus on recent, relevant professional experience in 1-2 minutes.",
      },
      {
        id: "b-m-5",
        prompt: "When asked about teamwork, best to emphasize:",
        options: ["Your leadership only", "Individual contributions", "Collaboration and shared success", "Team problems"],
        answerIndex: 2,
        explanation: "Highlight collaboration, communication, and collective achievements.",
      },
    ],
    coding: [
      {
        id: "b-c-1",
        prompt: "Write a concise STAR-format paragraph about handling a tight deadline.",
        starter: `// Use STAR structure\n// S: \n// T: \n// A: \n// R: `,
        rubric: ["Clarity", "Specificity", "Outcome"]
      },
      {
        id: "b-c-2",
        prompt: "Describe a time you resolved a team conflict using STAR method.",
        starter: `// Situation:\n// Task:\n// Action:\n// Result:`,
        rubric: ["Conflict resolution", "Communication", "Positive outcome"]
      },
      {
        id: "b-c-3",
        prompt: "Write about a time you took initiative on a project.",
        starter: `// STAR format response here`,
        rubric: ["Proactivity", "Impact", "Leadership"]
      },
    ],
    quiz: [
      {
        id: "b-q-1",
        prompt: "Describe a time you received critical feedback and what you changed.",
        placeholder: "Type your answer here...",
        checklist: ["Ownership", "Action taken", "Result"]
      },
      {
        id: "b-q-2",
        prompt: "Tell me about a time you failed and what you learned.",
        placeholder: "Type your answer here...",
        checklist: ["Honest reflection", "Growth mindset", "Applied learning"]
      },
      {
        id: "b-q-3",
        prompt: "Describe a situation where you had to work with a difficult team member.",
        placeholder: "Type your answer here...",
        checklist: ["Patience", "Communication", "Resolution"]
      },
      {
        id: "b-q-4",
        prompt: "Give an example of a time you showed leadership.",
        placeholder: "Type your answer here...",
        checklist: ["Initiative", "Influence", "Impact"]
      },
      {
        id: "b-q-5",
        prompt: "Describe a time you went above and beyond your job responsibilities.",
        placeholder: "Type your answer here...",
        checklist: ["Extra effort", "Value added", "Recognition"]
      },
    ],
  },
  "system-design": {
    mcq: [
      {
        id: "s-m-1",
        prompt: "Which component primarily improves read scalability?",
        options: ["Write-through cache", "Load balancer", "Message queue", "Sharded DB"],
        answerIndex: 1,
        explanation: "Load balancer distributes reads across replicas/services.",
      },
      {
        id: "s-m-2",
        prompt: "Eventual consistency is typically associated with...",
        options: ["CP systems", "AP systems", "CA systems", "ACID RDBMS"],
        answerIndex: 1,
        explanation: "AP-favoring systems often accept eventual consistency.",
      },
      {
        id: "s-m-3",
        prompt: "Which is best for handling 1M+ concurrent websocket connections?",
        options: ["Shared memory", "Message queue", "Load balancer with sticky sessions", "Single server"],
        answerIndex: 2,
        explanation: "Load balancer with sticky sessions maintains connection state efficiently.",
      },
      {
        id: "s-m-4",
        prompt: "What is the CAP theorem?",
        options: ["Caching, API, Performance", "Consistency, Availability, Partition tolerance", "Client, Application, Protocol", "Cache, Analytics, Processing"],
        answerIndex: 1,
        explanation: "CAP theorem states you can only guarantee 2 of 3: Consistency, Availability, Partition tolerance.",
      },
      {
        id: "s-m-5",
        prompt: "Which database is best for time-series data?",
        options: ["MySQL", "MongoDB", "InfluxDB", "Redis"],
        answerIndex: 2,
        explanation: "InfluxDB is specifically optimized for time-series data.",
      },
    ],
    coding: [
      {
        id: "s-c-1",
        prompt: "Sketch a simple API contract for a URL shortener service.",
        starter: `POST /shorten { url } -> { code }\nGET /:code -> 301 redirect\n// Add notes on rate limiting and analytics`,
        rubric: ["REST clarity", "Edge cases", "Non-functional needs"]
      },
      {
        id: "s-c-2",
        prompt: "Design the data schema for a Twitter-like feed system.",
        starter: `// Tables/Collections:\n// Users:\n// Posts:\n// Relationships:`,
        rubric: ["Normalization", "Indexing", "Scalability"]
      },
      {
        id: "s-c-3",
        prompt: "Outline the architecture for a real-time chat application.",
        starter: `// Components:\n// 1. Client\n// 2. WebSocket server\n// 3. Message queue\n// 4. Database`,
        rubric: ["Real-time handling", "Scalability", "Data consistency"]
      },
    ],
    quiz: [
      {
        id: "s-q-1",
        prompt: "Explain trade-offs between sharding and replication.",
        placeholder: "Type your answer here...",
        checklist: ["Scale-out", "Availability", "Complexity"]
      },
      {
        id: "s-q-2",
        prompt: "How would you design a notification system for 100M users?",
        placeholder: "Type your answer here...",
        checklist: ["Push/Pull strategy", "Scalability", "Delivery guarantees"]
      },
      {
        id: "s-q-3",
        prompt: "Explain how you would handle rate limiting in a distributed system.",
        placeholder: "Type your answer here...",
        checklist: ["Token bucket", "Distributed state", "Fairness"]
      },
      {
        id: "s-q-4",
        prompt: "Design a caching strategy for an e-commerce product catalog.",
        placeholder: "Type your answer here...",
        checklist: ["Cache invalidation", "Hit rate", "Consistency"]
      },
      {
        id: "s-q-5",
        prompt: "How would you design a video streaming service like YouTube?",
        placeholder: "Type your answer here...",
        checklist: ["CDN", "Encoding", "Storage", "Scalability"]
      },
    ],
  },
};

function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function InterviewRoom() {
  const query = useQuery();
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();
  const interviewType = (query.get("type") || "technical").toLowerCase();

  const [mode, setMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState({});
  const attemptSavedRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);
  const QUESTION_TIME = 60;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const questions = useMemo(() => {
    const bank = QUESTION_BANK[interviewType] || QUESTION_BANK.technical;
    if (!mode) return [];

    const padToLength = (arr, target = 15) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      if (arr.length >= target) return arr.slice(0, target);
      const out = [...arr];
      let idx = 0;
      while (out.length < target) {
        const base = arr[idx % arr.length];
        const copyIndex = out.length + 1;
        const cloned = { ...base };
        cloned.id = `${base.id}-x${copyIndex}`;
        if (typeof base.answerIndex === "number") {
          cloned.prompt = `${base.prompt} (variant ${copyIndex})`;
        } else if (base.starter) {
          cloned.prompt = `${base.prompt} (v${copyIndex})`;
        } else if (base.placeholder) {
          cloned.prompt = `${base.prompt} (v${copyIndex})`;
        }
        out.push(cloned);
        idx++;
      }
      return out;
    };

    const list = bank[mode] || [];
    return padToLength(list, 15);
  }, [interviewType, mode]);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setQuestionSubmitted({});
    setSubmitted(false);
    setShowWarning(!!mode);
    setTimeLeft(QUESTION_TIME);
    attemptSavedRef.current = false;
    setAiFeedback(null);
    setLoadingFeedback(false);
  }, [mode]);

  const current = questions[currentIndex];

  const [optionMap, setOptionMap] = useState({});
  useEffect(() => {
    if (!mode || questions.length === 0) return;
    if (mode !== "mcq") {
      setOptionMap({});
      return;
    }
    const map = {};
    questions.forEach((q) => {
      const order = [...q.options.keys()].sort(() => Math.random() - 0.5);
      const newAnswerIndex = order.indexOf(q.answerIndex);
      map[q.id] = { order, answerIndex: newAnswerIndex };
    });
    setOptionMap(map);
  }, [mode, questions]);

  const handleAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const canNext = currentIndex < questions.length - 1;
  const canPrev = currentIndex > 0;

  const computeFinished = (submittedMap) => {
    const allIds = questions.map((q) => q.id);
    return allIds.length > 0 && allIds.every((id) => submittedMap[id]);
  };

  const persistAttemptIfFinished = async (submittedMap) => {
    const finished = computeFinished(submittedMap);
    if (!finished) return;
    if (attemptSavedRef.current) return;
    attemptSavedRef.current = true;
    setSubmitted(true);

    try {
      const ts = Date.now();
      let percent = null;
      if (mode === "mcq") {
        let correct = 0;
        questions.forEach((q) => {
          const mapped = optionMap[q.id];
          const ans = answers[q.id];
          const correctIndex = mapped ? mapped.answerIndex : q.answerIndex;
          if (typeof ans === "number" && ans === correctIndex) correct += 1;
        });
        percent = Math.round((correct / questions.length) * 100);
      }

      const report = buildReport({
        interviewType,
        mode,
        questions,
        answers,
        optionMap,
        mcqPercent: percent,
      });
      const plan = buildPracticePlan(report);

      // AI feedback: call backend
      setLoadingFeedback(true);
      try {
        const token = localStorage.getItem("token");
        
        const feedbackResponse = await fetch(`${API_BASE}/api/ai/interview-feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: interviewType,
            mode,
            questions,
            answers,
          }),
        });

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setAiFeedback(feedbackData.feedback);
          localStorage.setItem(
            "last_ai_feedback_v1",
            JSON.stringify(feedbackData.feedback)
          );
        }
      } catch (feedbackError) {
        console.error("AI feedback error:", feedbackError);
      } finally {
        setLoadingFeedback(false);
      }

      // Save attempt to backend
      const payload = {
        type: interviewType,
        mode,
        scorePercent: percent,
        answers,
        report,
        plan,
      };

      const response = await fetch(`${API_BASE}/api/progress/save-attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        localStorage.setItem(
          "last_report_v1",
          JSON.stringify({ ...report, timestamp: ts })
        );
        localStorage.setItem("practice_plan_v1", JSON.stringify(plan));
        try {
          window.dispatchEvent(new CustomEvent("attempts-updated"));
        } catch {}
        try {
          push("Interview completed! AI feedback generated.", { type: "success" });
        } catch {}
      } else {
        throw new Error("Failed to save attempt to backend");
      }
    } catch (error) {
      console.error("Error saving attempt:", error);
      
      // Fallback using session manager
      try {
        const ts = Date.now();
        let percent = null;
        if (mode === "mcq") {
          let correct = 0;
          questions.forEach((q) => {
            const mapped = optionMap[q.id];
            const ans = answers[q.id];
            const correctIndex = mapped ? mapped.answerIndex : q.answerIndex;
            if (typeof ans === "number" && ans === correctIndex) correct += 1;
          });
          percent = Math.round((correct / questions.length) * 100);
        }
        
        sessionManager.saveInterviewAttempt({
          type: interviewType,
          mode,
          timestamp: ts,
          scorePercent: percent,
        });
        
        const report = buildReport({
          interviewType,
          mode,
          questions,
          answers,
          optionMap,
          mcqPercent: percent,
        });
        localStorage.setItem("last_report_v1", JSON.stringify({ ...report, timestamp: ts }));
        
        const plan = buildPracticePlan(report);
        localStorage.setItem("practice_plan_v1", JSON.stringify(plan));
        
        try {
          window.dispatchEvent(new CustomEvent("attempts-updated"));
        } catch {}
        
        try {
          push("Interview attempt saved locally!", { type: "success" });
        } catch {}
      } catch (fallbackError) {
        console.error("Fallback save failed:", fallbackError);
      }
    }
  };

  function scoreClarityFromText(text) {
    if (!text) return 0;
    const len = text.trim().length;
    if (len < 40) return 40;
    if (len < 120) return 65;
    if (len < 300) return 80;
    return 90;
  }

  function scoreStructureFromKeywords(text, keywords) {
    if (!text || !keywords || !keywords.length) return 60;
    const lower = text.toLowerCase();
    let hits = 0;
    keywords.forEach((k) => {
      if (lower.includes(String(k).toLowerCase().split(" ")[0])) hits += 1;
    });
    const pct = Math.min(100, Math.round((hits / keywords.length) * 100));
    return Math.max(60, pct);
  }

  function buildReport({ interviewType, mode, questions, answers, optionMap, mcqPercent }) {
    const correctness = typeof mcqPercent === "number" ? mcqPercent : 0;
    let claritySum = 0,
      clarityCount = 0;
    let structureSum = 0,
      structureCount = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (mode === "coding" || mode === "quiz") {
        if (typeof ans === "string") {
          claritySum += scoreClarityFromText(ans);
          clarityCount += 1;
          const keys = q.checklist || q.rubric || [];
          structureSum += scoreStructureFromKeywords(ans, keys);
          structureCount += 1;
        }
      }
    });
    const clarity = clarityCount
      ? Math.round(claritySum / clarityCount)
      : mode === "mcq"
      ? 70
      : 0;
    const structure = structureCount
      ? Math.round(structureSum / structureCount)
      : mode === "mcq"
      ? 65
      : 0;
    const strengths = [];
    const weaknesses = [];
    if (correctness >= 75) strengths.push("Correctness");
    else weaknesses.push("Correctness");
    if (clarity >= 75) strengths.push("Clarity");
    else weaknesses.push("Clarity");
    if (structure >= 75) strengths.push("Structure");
    else weaknesses.push("Structure");
    const resources = buildResources({ interviewType, weaknesses });
    return {
      type: interviewType,
      mode,
      scores: { correctness, clarity, structure },
      strengths,
      weaknesses,
      resources,
    };
  }

  function buildResources({ interviewType, weaknesses }) {
    const links = {
      Correctness: [
        { title: "LeetCode Patterns", url: "https://seanprashad.com/leetcode-patterns/" },
        { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
      ],
      Clarity: [
        { title: "STAR Method Guide", url: "https://www.themuse.com/advice/star-interview-method" },
        {
          title: "Technical Communication Tips",
          url: "https://www.khanacademy.org/college-careers-more/career-content",
        },
      ],
      Structure: [
        {
          title: "System Design Primer",
          url: "https://github.com/donnemartin/system-design-primer",
        },
        {
          title: "Grokking the System Design",
          url: "https://www.designgurus.io/course/grokking-the-system-design-interview",
        },
      ],
    };
    let out = [];
    weaknesses.forEach((w) => {
      out = out.concat(links[w] || []);
    });
    return out.slice(0, 4);
  }

  function buildPracticePlan(report) {
    const now = Date.now();
    const weak = report.weaknesses;
    const entries = weak.map((w) => ({
      topic: w,
      due: [now + 1 * 86400000, now + 3 * 86400000, now + 7 * 86400000],
    }));
    return { generatedAt: now, entries };
  }

  const submitCurrentQuestion = () => {
    if (!current) return;
    setQuestionSubmitted((prev) => {
      const next = { ...prev, [current.id]: true };
      persistAttemptIfFinished(next);
      return next;
    });
  };

  const score = useMemo(() => {
    if (!submitted || mode !== "mcq") return null;
    let correct = 0;
    questions.forEach((q) => {
      if (typeof answers[q.id] === "number" && answers[q.id] === q.answerIndex)
        correct += 1;
    });
    return {
      correct,
      total: questions.length,
      percent: Math.round((correct / questions.length) * 100),
    };
  }, [submitted, mode, questions, answers]);

  const restart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setQuestionSubmitted({});
    setTimeLeft(QUESTION_TIME);
    attemptSavedRef.current = false;
    setAiFeedback(null);
  };

  // Timer resets on question/mode change
  useEffect(() => {
    if (!mode || submitted || showWarning || questions.length === 0) return;
    setTimeLeft(QUESTION_TIME);
  }, [currentIndex, mode, submitted, showWarning, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (!mode || showWarning || questions.length === 0 || submitted) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          setQuestionSubmitted((prev) => {
            const already = prev[current?.id];
            const nextMap = already ? prev : { ...prev, [current?.id]: true };
            persistAttemptIfFinished(nextMap);
            return nextMap;
          });
          if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [mode, showWarning, questions.length, currentIndex, current, submitted]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <Header
          title="Interview Room"
          subtitle={`Type: ${interviewType.replace("-", " ").toUpperCase()}`}
        />

        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer bg-white/5 border border-gray-800 rounded-2xl p-6 text-left hover:border-gray-600 transition relative overflow-hidden"
              >
                <span className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-fuchsia-600/30 to-cyan-500/30 rounded-full blur-2xl"></span>
                <div className="flex items-center gap-3 mb-3">
                  <m.icon className="text-purple-400" />
                  <span className="font-semibold">{m.label}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {m.id === "mcq" &&
                    "Multiple-choice questions with instant scoring."}
                  {m.id === "coding" &&
                    "Write code or structured answers. Focus on clarity and correctness."}
                  {m.id === "quiz" &&
                    "Short-form responses with a self-review checklist."}
                </p>
              </motion.button>
            ))}
          </div>
        )}

        {mode && (
          <div className="mt-6">
            {/* Top controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Bot size={18} className="text-purple-400" />
                <span className="uppercase text-xs tracking-wider">{mode} mode</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode(null)}
                  className="cursor-pointer px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5"
                >
                  Change Mode
                </button>
                <button
                  onClick={() => navigate("/interview")}
                  className="cursor-pointer px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Warning Overlay */}
            {showWarning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative w-[90%] max-w-lg bg-gradient-to-b from-gray-900/90 to-black/80 border border-white/10 rounded-2xl p-6 text-center overflow-hidden"
                >
                  <span className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-fuchsia-600/25 to-cyan-500/25 rounded-full blur-3xl"></span>
                  <div className="relative z-10">
                    <div className="text-5xl mb-2">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Serious Mode Engaged</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Each question has a 60-second timer. Submit your answer before time runs out. You got this! 💪
                    </p>
                    <div className="mt-5 flex gap-3 justify-center">
                      <button
                        onClick={() => setShowWarning(false)}
                        className="cursor-pointer px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                      >
                        I'm Ready 🚀
                      </button>
                      <button
                        onClick={() => {
                          setMode(null);
                          setShowWarning(false);
                        }}
                        className="cursor-pointer px-5 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                      >
                        Change Mode
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Question card */}
            {questions.length > 0 ? (
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                {/* Timer Bar */}
                {!submitted && !showWarning && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Time Left</span>
                      <span
                        className={`${
                          timeLeft <= 10 ? "text-red-400" : "text-gray-300"
                        } font-semibold`}
                      >
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-1000 ${
                          timeLeft <= 10 ? "animate-pulse" : ""
                        }`}
                        style={{
                          width: `${Math.max(0, (timeLeft / QUESTION_TIME) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div>
                    Question {currentIndex + 1} of {questions.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={!canPrev}
                      onClick={() => canPrev && setCurrentIndex((i) => i - 1)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        canPrev
                          ? "border-gray-700 hover:bg-white/5 cursor-pointer"
                          : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button
                      disabled={!canNext}
                      onClick={() => canNext && setCurrentIndex((i) => i + 1)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        canNext
                          ? "border-gray-700 hover:bg-white/5 cursor-pointer"
                          : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <h2 className="text-lg font-semibold mb-4">{current?.prompt}</h2>

                {/* MCQ Mode */}
                {mode === "mcq" && (
                  <div className="space-y-3">
                    {(() => {
                      const map = optionMap[current.id] || {
                        order: [...current.options.keys()],
                        answerIndex: current.answerIndex,
                      };
                      return map.order.map((origIdx, idx) => {
                        const opt = current.options[origIdx];
                        const selected = answers[current.id] === idx;
                        const reveal = questionSubmitted[current.id];
                        const correctIndex = map.answerIndex;
                        const isCorrect = reveal && idx === correctIndex;
                        const isWrong = reveal && selected && idx !== correctIndex;
                        return (
                          <button
                            key={idx}
                            disabled={reveal}
                            onClick={() => handleAnswer(current.id, idx)}
                            className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg border transition ${
                              selected
                                ? "border-purple-500/60 bg-purple-500/10"
                                : "border-gray-700 hover:bg-white/5"
                            } ${isCorrect ? "!border-green-500/60 bg-green-500/10" : ""} ${
                              isWrong ? "!border-red-500/60 bg-red-500/10" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt}</span>
                              {reveal && isCorrect && (
                                <CheckCircle2 className="text-green-400" size={18} />
                              )}
                              {reveal && isWrong && (
                                <XCircle className="text-red-400" size={18} />
                              )}
                            </div>
                          </button>
                        );
                      });
                    })()}

                    {/* Submit Button for MCQ */}
                    {!questionSubmitted[current.id] && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={submitCurrentQuestion}
                        disabled={answers[current.id] === undefined}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                      >
                        <CheckCircle2 size={20} />
                        Submit Answer
                      </motion.button>
                    )}

                    {questionSubmitted[current.id] && current.explanation && (
                      <div className="mt-3 text-sm text-gray-300 bg-white/5 border border-gray-700 rounded-lg p-3">
                        <span className="text-gray-400">Explanation: </span>
                        {current.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Coding Mode */}
                {mode === "coding" && (
                  <div className="space-y-3">
                    <textarea
                      rows={10}
                      className="w-full rounded-lg bg-black/40 border border-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                      placeholder={current.starter || "Write your solution here..."}
                      value={answers[current.id] || ""}
                      onChange={(e) => handleAnswer(current.id, e.target.value)}
                      disabled={questionSubmitted[current.id]}
                    />
                    {Array.isArray(current.rubric) && (
                      <div className="text-sm text-gray-400">
                        <span className="block mb-1 text-gray-300">Consider:</span>
                        <ul className="list-disc ml-5">
                          {current.rubric.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!questionSubmitted[current.id] && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={submitCurrentQuestion}
                        disabled={
                          !answers[current.id] ||
                          answers[current.id].trim().length < 10
                        }
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Submit Code
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Quiz Mode */}
                {mode === "quiz" && (
                  <div className="space-y-3">
                    <textarea
                      rows={6}
                      className="w-full rounded-lg bg-black/40 border border-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder={current.placeholder || "Type your answer..."}
                      value={answers[current.id] || ""}
                      onChange={(e) => handleAnswer(current.id, e.target.value)}
                      disabled={questionSubmitted[current.id]}
                    />
                    {Array.isArray(current.checklist) && (
                      <div className="text-sm text-gray-400">
                        <span className="block mb-1 text-gray-300">Checklist:</span>
                        <ul className="list-disc ml-5">
                          {current.checklist.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!questionSubmitted[current.id] && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={submitCurrentQuestion}
                        disabled={
                          !answers[current.id] ||
                          answers[current.id].trim().length < 20
                        }
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Submit Answer
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Footer controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      disabled={!canPrev}
                      onClick={() => canPrev && setCurrentIndex((i) => i - 1)}
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        canPrev
                          ? "border-gray-700 hover:bg-white/5 cursor-pointer"
                          : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                      disabled={!canNext}
                      onClick={() => {
                        if (!questionSubmitted[current.id]) submitCurrentQuestion();
                        if (canNext) setCurrentIndex((i) => i + 1);
                      }}
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        canNext
                          ? "border-gray-700 hover:bg.white/5 cursor-pointer"
                          : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {submitted && (
                      <>
                        <button
                          onClick={() => {
                            const el = document.getElementById("results-block");
                            if (el)
                              el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                        >
                          View Results
                        </button>
                        <button
                          onClick={restart}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                        >
                          <RotateCcw size={16} /> Try Again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : mode ? (
              <InterviewRoomSkeleton />
            ) : (
              <div className="text-gray-400">
                No questions found for this selection.
              </div>
            )}

            {/* Results */}
            {submitted && (
              <div
                id="results-block"
                className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                {mode === "mcq" &&
                  (() => {
                    let correct = 0;
                    questions.forEach((q) => {
                      const map = optionMap[q.id] || {
                        answerIndex: q.answerIndex,
                      };
                      if (
                        typeof answers[q.id] === "number" &&
                        answers[q.id] === map.answerIndex
                      )
                        correct += 1;
                    });
                    const percent = Math.round((correct / questions.length) * 100);
                    return (
                      <div className="text-gray-300">
                        Score:{" "}
                        <span className="text-purple-300 font-semibold">
                          {correct}/{questions.length}
                        </span>{" "}
                        ({percent}%)
                      </div>
                    );
                  })()}
                {mode !== "mcq" && (
                  <div className="text-gray-400 text-sm">
                    Submitted. Review your answers against the checklist/rubric above.
                  </div>
                )}
              </div>
            )}

            {/* Post-Interview Report */}
            {submitted &&
              (() => {
                const rptRaw = (() => {
                  try {
                    return JSON.parse(
                      localStorage.getItem("last_report_v1") || "null"
                    );
                  } catch {
                    return null;
                  }
                })();
                const scores = rptRaw?.scores || {
                  correctness: 0,
                  clarity: 0,
                  structure: 0,
                };
                const strengths = rptRaw?.strengths || [];
                const weaknesses = rptRaw?.weaknesses || [];
                const resources = rptRaw?.resources || [];
                const Bar = ({ value }) => (
                  <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                );
                return (
                  <div className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Post-Interview Report
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Correctness</span>
                          <span>{scores.correctness}%</span>
                        </div>
                        <Bar value={scores.correctness} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Clarity</span>
                          <span>{scores.clarity}%</span>
                        </div>
                        <Bar value={scores.clarity} />
                      </div>
                      <div>
                        <div className="flex items.center justify-between text-sm mb-1">
                          <span>Structure</span>
                          <span>{scores.structure}%</span>
                        </div>
                        <Bar value={scores.structure} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/5 border border-gray-800 rounded-xl p-4">
                        <div className="font-semibold.mb-2">Strengths</div>
                        {strengths.length === 0 ? (
                          <div className="text-gray-400 text-sm">
                            No strong areas yet. Keep practicing!
                          </div>
                        ) : (
                          <ul className="list-disc ml-5 text-sm">
                            {strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="bg-white/5 border border-gray-800 rounded-xl p-4">
                        <div className="font-semibold mb-2">Weaknesses</div>
                        {weaknesses.length === 0 ? (
                          <div className="text-gray-400 text-sm">
                            Great balance across dimensions.
                          </div>
                        ) : (
                          <ul className="list-disc ml-5 text-sm">
                            {weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    {resources.length > 0 && (
                      <div className="mt-6">
                        <div className="font-semibold mb-2">Suggested Resources</div>
                        <ul className="list-disc ml-5.text-sm space-y-1">
                          {resources.map((r, i) => (
                            <li key={i}>
                              <a
                                className="text-blue-400 hover:text-blue-300 underline"
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {r.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

            {/* Practice Plan Preview */}
            {submitted &&
              (() => {
                const plan = (() => {
                  try {
                    return JSON.parse(
                      localStorage.getItem("practice_plan_v1") || "null"
                    );
                  } catch {
                    return null;
                  }
                })();
                if (!plan?.entries?.length) return null;
                return (
                  <div className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Practice Plan (Spaced Repetition)
                    </h3>
                    <div className="text-sm text-gray-300 mb-3">
                      We scheduled quick drills for your weak topics.
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {plan.entries.map((e, idx) => (
                        <div
                          key={idx}
                          className="bg-black/30 border border-gray-800 rounded-xl p-3"
                        >
                          <div className="font-semibold mb-2">{e.topic}</div>
                          <ul className="space-y-1">
                            {e.due.map((d, i) => (
                              <li key={i} className="text-gray-400">
                                Session {i + 1}: {new Date(d).toLocaleDateString()}{" "}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            {/* AI-Powered Feedback Section */}
            {submitted && (
              <div className="mt-6">
                <AIFeedbackReport feedback={aiFeedback} loading={loadingFeedback} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}