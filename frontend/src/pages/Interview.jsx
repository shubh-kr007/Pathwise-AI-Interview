import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Layers,
  Coffee,
  Binary,
  BrainCircuit,
  Award,
  ChevronRight,
  Gamepad2,
  BarChart3
} from "lucide-react";

const assessments = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    subtitle: "Python & Analytics",
    description: "Master data manipulation, visualization, and Python-based analysis logic.",
    icon: <Database className="h-8 w-8 text-cyan-400" />,
    gradient: "from-cyan-500/20 to-blue-500/20",
    textGradient: "from-cyan-400 to-blue-400",
    features: ["Pandas & NumPy", "Data Cleaning", "Logical Reasoning"]
  },
  {
    id: "full-stack",
    title: "Full Stack Dev",
    subtitle: "MERN Stack",
    description: "Comprehensive assessment covering React, Node.js, Express, and MongoDB.",
    icon: <Layers className="h-8 w-8 text-fuchsia-400" />,
    gradient: "from-fuchsia-500/20 to-purple-500/20",
    textGradient: "from-fuchsia-400 to-purple-400",
    features: ["Frontend Hooks", "API Mastery", "Database Schema"]
  },
  {
    id: "java-dev",
    title: "Java Developer",
    subtitle: "Core Java & OOPs",
    description: "OOPs concepts, Collections, Multithreading, and Exception handling.",
    icon: <Coffee className="h-8 w-8 text-orange-400" />,
    gradient: "from-orange-500/20 to-amber-500/20",
    textGradient: "from-orange-400 to-amber-400",
    features: ["OOPs Principles", "Memory Mgmt", "Core Syntax"]
  },
  {
    id: "dsa",
    title: "DSA Round",
    subtitle: "Data Structures",
    description: "Crack the algorithmic round with Arrays, Strings, and Linked Lists.",
    icon: <Binary className="h-8 w-8 text-emerald-400" />,
    gradient: "from-emerald-500/20 to-teal-500/20",
    textGradient: "from-emerald-400 to-teal-400",
    features: ["Complexity Analysis", "Data Structures", "Problem Solving"]
  },
];

const difficulties = [
  { id: "easy", label: "Early Career", duration: "10m", level: "Easy", color: "text-green-400", bg: "bg-green-500/10" },
  { id: "medium", label: "Professional", duration: "15m", level: "Medium", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "hard", label: "Elite Expert", duration: "25m", level: "Hard", color: "text-red-400", bg: "bg-red-500/10" },
];

export default function Interview() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [userStats, setUserStats] = useState({ interviewsCompleted: 0, averageScore: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { default: api } = await import("../utils/api");
        const attempts = await api.getAttempts();
        const scores = attempts.filter((a) => typeof a.scorePercent === "number").map((a) => a.scorePercent);
        setUserStats({
          interviewsCompleted: attempts.length,
          averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        });
      } catch {}
    };
    loadStats();
  }, []);

  const handleStart = (difficulty) => {
    navigate(`/interview-room?type=${selectedRole.id}&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-blue-400 uppercase tracking-widest">
               <BrainCircuit size={14} /> AI-Powered Proctoring
             </div>
             <h1 className="text-2xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
               Select Your <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Battleground</span>
             </h1>
             <p className="text-gray-500 text-sm md:text-lg">Choose a specialization and challenge level to begin your technical assessment.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
              <div className="p-3 md:p-6 rounded-2xl md:rounded-[24px] bg-white/5 border border-white/10 text-center min-w-0 md:min-w-[160px]">
                <p className="text-xl md:text-3xl font-bold text-blue-400">{userStats.interviewsCompleted}</p>
                <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Tests Taken</p>
              </div>
              <div className="p-3 md:p-6 rounded-2xl md:rounded-[24px] bg-white/5 border border-white/10 text-center min-w-0 md:min-w-[160px]">
                <p className="text-xl md:text-3xl font-bold text-purple-400">{userStats.averageScore}%</p>
                <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Avg. Score</p>
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {assessments.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => setSelectedRole(tech)}
                  className="group relative cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} rounded-[32px] opacity-0 group-hover:opacity-100 transition-duration-500`} />
                  <div className="relative h-full bg-[#111] border border-white/5 rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col hover:bg-black/50 transition-all hover:scale-[1.02]">
                    <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                      {React.cloneElement(tech.icon, { className: "h-6 w-6 md:h-8 md:w-8" })}
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold mb-1 uppercase tracking-tight">{tech.title}</h3>
                    <p className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">{tech.subtitle}</p>
                    <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 flex-grow">{tech.description}</p>
                    <button className="flex items-center gap-2 text-xs md:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      Enter Assessment <ChevronRight size={16} className="md:size-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setSelectedRole(null)}
                className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <ChevronRight className="rotate-180" size={16} /> Back to specializations
              </button>

              <div className="grid md:grid-cols-3 gap-6">
                {difficulties.map((level) => (
                  <div
                    key={level.id}
                    onClick={() => handleStart(level.id)}
                    className="group cursor-pointer relative bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-6 md:p-10 hover:border-blue-500 transition-all hover:bg-blue-500/5 hover:-translate-y-2"
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${level.bg} flex items-center justify-center mb-4 md:mb-6`}>
                       <Gamepad2 className={level.color} size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{level.label}</h3>
                    <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${level.color} mb-4 md:mb-6`}>
                      {level.level} · {level.duration}
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8">
                       {level.id === 'easy' && "Foundational questions for entry-level roles."}
                       {level.id === 'medium' && "Industry standard challenges for experienced pros."}
                       {level.id === 'hard' && "Elite-tier problems for top competitive edge."}
                    </p>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-white group-hover:text-blue-400">
                      Begin Mission <ArrowRight size={16} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center text-gray-600 text-sm uppercase tracking-widest font-bold">
                 Selected Specialization: <span className="text-white">{selectedRole.title}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="pt-20 border-t border-white/5 flex flex-wrap justify-center gap-12 grayscale opacity-30 text-sm font-bold uppercase tracking-[0.2em]">
           <span>High Accuracy</span>
           <span>Groq Powered</span>
           <span>MCQ Only</span>
        </footer>
      </div>
    </div>
  );
}