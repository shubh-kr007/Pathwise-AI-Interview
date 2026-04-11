import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bot,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Zap,
  CheckCircle2,
  Play,
  Award,
  Code2,
  Sparkles,
  ArrowRight,
  History,
  BrainCircuit,
  Terminal,
  Cpu
} from "lucide-react";

const interviewTypes = [
  {
    id: "mcq",
    title: "MCQ Challenge",
    subtitle: "Speed & Accuracy",
    description: "Rapid-fire multiple choice questions to test your theoretical knowledge across various domains.",
    icon: <Bot className="h-8 w-8 text-cyan-400" />,
    duration: "20 min",
    difficulty: "Medium",
    gradient: "from-cyan-500/20 to-blue-500/20",
    border: "group-hover:border-cyan-500/50",
    textGradient: "from-cyan-400 to-blue-400",
    features: ["Instant Feedback", "Topic Variety", "Score Tracking"]
  },
  {
    id: "coding",
    title: "Coding Lab",
    subtitle: "Algorithms & Logic",
    description: "Solve algorithmic problems in a real-time code editor. Focus on efficiency, edge cases, and clean syntax.",
    icon: <Terminal className="h-8 w-8 text-fuchsia-400" />,
    duration: "45 min",
    difficulty: "Hard",
    gradient: "from-fuchsia-500/20 to-purple-500/20",
    border: "group-hover:border-fuchsia-500/50",
    textGradient: "from-fuchsia-400 to-purple-400",
    features: ["Syntax Highlighting", "Test Cases", "Time Complexity"]
  },
  {
    id: "technical",
    title: "Technical Dive",
    subtitle: "Concepts & Design",
    description: "Deep dive into system design and conceptual questions. Articulate your thoughts clearly.",
    icon: <Cpu className="h-8 w-8 text-emerald-400" />,
    duration: "15 min",
    difficulty: "Easy",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/50",
    textGradient: "from-emerald-400 to-teal-400",
    features: ["System Design", "Oral Practice", "Key Concepts"]
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function Interview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredType, setHoveredType] = useState(null);

  // Load real user stats from localStorage
  const [userStats, setUserStats] = useState({
    interviewsCompleted: 0,
    averageScore: 0,
    timeSaved: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadUserStats();
    const handleUpdate = () => loadUserStats();
    window.addEventListener("attempts-updated", handleUpdate);
    return () => window.removeEventListener("attempts-updated", handleUpdate);
  }, []);

  const loadUserStats = () => {
    try {
      const attemptsRaw = localStorage.getItem("interview_attempts_v1");
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
      const completed = attempts.length;
      const scores = attempts
        .filter((a) => typeof a.scorePercent === "number")
        .map((a) => a.scorePercent);
      const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      // Estimate 45min per interview
      const timeSaved = (completed * 0.75).toFixed(1);
      const successRate = avgScore > 0 ? Math.min(100, avgScore + 10) : 0;

      setUserStats({
        interviewsCompleted: completed,
        averageScore: avgScore,
        timeSaved: timeSaved,
        successRate: successRate,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const dashboardStats = [
    {
      label: "Interviews",
      value: userStats.interviewsCompleted,
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Avg. Score",
      value: `${userStats.averageScore}%`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      label: "Time Invested",
      value: `${userStats.timeSaved}h`,
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Readiness",
      value: `${userStats.successRate}%`,
      icon: Award,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">

      {/* Abstract Background Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto pt-48">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 backdrop-blur-md mt-12">
                <Sparkles size={14} className="text-yellow-400" />
                <span>AI-Powered Prep v2.0</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Next Interview
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-8">
                Experience realistic interview scenarios tailored to your role.
                Get instant AI feedback and track your growth.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById("interview-types").scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Start Practice <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2"
                >
                  <History size={18} /> History
                </button>
              </div>
            </motion.div>

            {/* Stats Dashboard Grid in Hero */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {dashboardStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-xl flex flex-col items-center justify-center text-center gap-2`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Interview Types Section */}
          <div id="interview-types" className="pt-10">
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BrainCircuit className="text-purple-500" />
                Select Mode
              </h2>
              <div className="hidden md:flex gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-gray-400">System Online</span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {interviewTypes.map((type) => (
                <motion.div
                  key={type.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredType(type.id)}
                  onHoverEnd={() => setHoveredType(null)}
                  className={`group relative bg-gray-900/40 border border-gray-800 hover:border-gray-600 rounded-3xl p-1 overflow-hidden transition-all duration-300`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative h-full bg-black/80 rounded-[22px] p-6 flex flex-col backdrop-blur-sm z-10 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors ${type.textGradient}`}>
                        {type.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/5 ${type.textGradient.replace("text", "text")}`}>
                        {type.duration}
                      </span>
                    </div>

                    <h3 className={`text-2xl font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${type.textGradient} transition-all`}>
                      {type.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">{type.subtitle}</p>
                    <p className="text-gray-400 leading-relaxed text-sm mb-6 flex-grow">
                      {type.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {type.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                          {feat}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(`/interview-room?type=${type.id}`)}
                      className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white text-white hover:text-black font-semibold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-white/10"
                    >
                      Initialize <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Tips or Footer */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 pt-10 border-t border-gray-800">
            {[
              { icon: Target, title: "Be Specific", desc: "Use metrics and real examples." },
              { icon: Zap, title: "Stay Calm", desc: "Take a breath before answering." },
              { icon: BookOpen, title: "Review", desc: "Check AI feedback after every session." }
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-gray-800 text-gray-300">
                  <tip.icon size={20} />
                </div>
                <div>
                  <h6 className="font-semibold">{tip.title}</h6>
                  <p className="text-xs text-gray-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}