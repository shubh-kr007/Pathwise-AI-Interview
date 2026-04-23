import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Bot,
  Trophy,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const TOPIC_MAP = {
  "data-analyst": "Python for Data Analysis, Pandas, NumPy, and SQL",
  "full-stack": "MERN Stack (MongoDB, Express, React, Node.js)",
  "java-dev": "Core Java, OOPs, Collections, and Multi-threading",
  "dsa": "Easy to Medium Data Structures and Algorithms (Arrays, Strings, Linked Lists)",
};

const TITLE_MAP = {
  "data-analyst": "Data Analyst Assessment",
  "full-stack": "Full Stack Mastery",
  "java-dev": "Core Java Proficiency",
  "dsa": "DSA Algorithmic Round",
};

export default function InterviewRoom() {
  const query = useQuery();
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();
  
  const assessmentType = query.get("type") || "dsa";
  const assessmentDifficulty = query.get("difficulty") || "medium";
  const assessmentTopic = TOPIC_MAP[assessmentType] || assessmentType;
  const assessmentTitle = `${TITLE_MAP[assessmentType] || 'Skills Assessment'} (${assessmentDifficulty.toUpperCase()})`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [userFinished, setUserFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Timer Reference
  const timerRef = useRef(null);

  // Load Assessment Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/ai/generate-questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            type: "mcq", 
            topic: assessmentTopic, 
            difficulty: assessmentDifficulty 
          }),
        });

        const data = await response.json();
        if (response.ok && data.questions) {
          setQuestions(data.questions);
        } else {
          throw new Error("Failed to load questions");
        }
      } catch (error) {
        push("Session expired or generation failed. Taking you back.", { type: "error" });
        setTimeout(() => navigate("/interview"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [assessmentType]);

  // Main Timer Logic
  useEffect(() => {
    if (loading || userFinished || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading, userFinished]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setTimeLeft(60);
    } else {
      finishAssessment();
    }
  };

  const handleSelect = (optionIdx) => {
    if (userFinished) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const finishAssessment = async () => {
    setUserFinished(true);
    clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore({ correct: correctCount, total: questions.length, percent: finalScore });

    // Save attempt and fetch AI Feedback
    setLoadingFeedback(true);
    try {
      const token = localStorage.getItem("token");
      
      // Save Attempt
      await fetch(`${API_BASE}/api/progress/save-attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: assessmentType,
          mode: "mcq",
          scorePercent: finalScore,
          answers: answers
        }),
      });

      // Get AI Feedback
      const feedbackRes = await fetch(`${API_BASE}/api/ai/interview-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: assessmentType,
          questions,
          answers: Object.values(answers).map(a => questions[currentIndex]?.options[a] || "No answer"),
        }),
      });
      
      if (feedbackRes.ok) {
        const fb = await feedbackRes.json();
        setAiFeedback(fb.feedback);
      }
    } catch (err) {
      console.error("Post-assessment failure:", err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-6">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <h2 className="text-2xl font-bold tracking-tight">Initializing Groq Assessment Engine...</h2>
          <p className="text-gray-500">Curating fresh questions for {assessmentTitle}</p>
        </div>
      </div>
    );
  }

  if (userFinished && score) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-12">
          <header className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-gray-400">Total accuracy measured for {assessmentTitle}</p>
          </header>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Score</p>
              <p className="text-3xl font-bold text-blue-400">{score.percent}%</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Correct</p>
              <p className="text-3xl font-bold text-green-400">{score.correct}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-300">{score.total}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-purple-400" size={20} /> AI Technical Feedback
            </h3>
            {loadingFeedback ? (
              <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                <RefreshCw size={16} className="animate-spin" /> Analyzing your responses...
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiFeedback}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/interview")}
              className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              Take Another Test <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase tracking-widest text-blue-400">{assessmentTitle}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BrainCircuit size={16} /> Question {currentIndex + 1} of {questions.length}</span>
              <span className="flex items-center gap-1"><Bot size={16} /> AI Proctor: Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Time Remaining</span>
                <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
             </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            className="h-full bg-blue-500"
          />
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-6xl font-bold text-white/5 select-none font-mono">
            Q{currentIndex + 1}
          </div>

          <h2 className="text-2xl font-bold mb-10 leading-relaxed pr-12">
            {currentQ?.prompt}
          </h2>

          <div className="grid gap-4">
            {currentQ?.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                  answers[currentIndex] === idx
                  ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10"
                  : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    answers[currentIndex] === idx ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg transition-colors ${answers[currentIndex] === idx ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                    {option}
                  </span>
                </div>
                {answers[currentIndex] === idx && <CheckCircle2 className="text-blue-500" size={24} />}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-between py-6">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-white disabled:opacity-0 transition-all font-mono"
          >
            <ChevronLeft size={20} /> PREVIOUS_STEP
          </button>
          
          <button
            onClick={handleNext}
            disabled={answers[currentIndex] === undefined}
            className="flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:grayscale font-mono"
          >
            {currentIndex === questions.length - 1 ? "FINISH_ASSESSMENT" : "NEXT_QUESTION"} <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-12 flex items-start gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <AlertCircle className="text-blue-400 shrink-0 mt-1" size={18} />
          <p className="text-xs text-blue-400/80 leading-relaxed font-mono">
            [SYS_LOG]: Monitoring candidate response patterns. Time limit is strictly enforced. Ensure you select the most optimal answer choice for maximum accuracy score.
          </p>
        </div>
      </div>
    </div>
  );
}