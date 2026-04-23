"use client";
import React, { useEffect, useState, useCallback } from "react";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Book,
  Bot,
  FileText,
  LayoutGrid,
  TrendingUp,
  AlertCircle,
  Upload,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { API_BASE } from "../config/api";
import api from "../utils/api";

// --- Data helpers ---
async function fetchAttempts() {
  try {
    const attempts = await api.getAttempts();
    return Array.isArray(attempts) ? attempts : [];
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return [];
  }
}

function aggregateByType(attempts) {
  const types = ["mcq", "coding", "quiz"];
  const typeLabels = {
    "data-analyst": "Data Analyst",
    "full-stack": "Full Stack Dev",
    "java-dev": "Java Developer",
    "dsa": "DSA Round",
    "mcq": "General MCQ"
  };
  const agg = Object.fromEntries(types.map((t) => [t, { count: 0, scores: [] }]));
  attempts.forEach((a) => {
    const type = a.type || a.mode;
    if (!agg[type]) {
      // If type doesn't exist, create it dynamically
      if (!agg[type]) {
        agg[type] = { count: 0, scores: [] };
      }
    }
    if (agg[type]) {
      agg[type].count += 1;
      if (typeof a.scorePercent === "number") agg[type].scores.push(a.scorePercent);
    }
  });
  const typeAverages = Object.entries(agg)
    .filter(([_, item]) => item.count > 0)
    .map(([t, item]) => {
      const avg = item.scores.length
        ? Math.round(item.scores.reduce((s, v) => s + v, 0) / item.scores.length)
        : 0;
      const label = typeLabels[t] || (t.charAt(0).toUpperCase() + t.slice(1));
      return { type: t, label, average: avg, attempts: item.count };
    });
  return typeAverages.length > 0 ? typeAverages : types.map(t => ({
    type: t,
    label: typeLabels[t] || t,
    average: 0,
    attempts: 0
  }));
}

function recentFromAttempts(attempts) {
  const last = [...attempts]
    .sort((a, b) => (b.timestamp || b.id || 0) - (a.timestamp || a.id || 0))
    .slice(0, 5)
    .map((a, i) => {
      const timestamp = a.timestamp || a.id || Date.now();
      const typeMap = {
        "data-analyst": "Data Analyst",
        "full-stack": "Full Stack Dev",
        "java-dev": "Java Developer",
        "dsa": "DSA Round",
      };
      const typeLabel = typeMap[a.type] || typeMap[a.mode] || (a.type ? a.type.charAt(0).toUpperCase() + a.type.slice(1) : "Interview");
      return {
        id: i + 1,
        type: typeLabel,
        date: new Date(timestamp).toLocaleString(),
        score: typeof a.scorePercent === "number" ? a.scorePercent : "—",
      };
    });
  return last;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const DashboardCard = ({ children, className }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-white/5 border border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ✅ Empty State Component
const EmptyStateCard = ({ icon: Icon, title, description, actionText, actionLink, navigate }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
    <Icon className="text-blue-400 mb-4" size={48} />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 mb-4 max-w-md">{description}</p>
    {actionText && actionLink && (
      <button
        onClick={() => navigate(actionLink)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg transition-all"
      >
        {actionText}
      </button>
    )}
  </div>
);

// ✅ Resume Upload Component (Inline)
const ResumeUploadSection = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/resume/analyze`, {   // ✅ USE API_BASE
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert('✅ Resume analyzed successfully! Reloading dashboard...');
        window.location.reload();
      } else {
        const err = await response.json();
        alert(`❌ Analysis failed: ${err.message}`);
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <Upload size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Analyze Your Resume</h3>
          <p className="text-sm text-gray-400">Get AI-powered insights instantly.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, refreshUserData } = useAuth();
  const userName = user?.name || "there";
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id || user?._id || 'default';
  const [attempts, setAttempts] = useState([]);
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Function to reload attempts
  const reloadAttempts = useCallback(async () => {
    const loadedAttempts = await fetchAttempts();
    setAttempts(loadedAttempts);
    console.log('Attempts reloaded:', loadedAttempts.length, 'attempts found');
  }, []);

  // Load data on mount and when userId changes - use only localStorage
  useEffect(() => {
    const loadData = async () => {
      // Fetch from backend
      const loadedAttempts = await fetchAttempts();
      setAttempts(loadedAttempts);
      console.log('Dashboard loaded attempts:', loadedAttempts.length);

      // Check resume status
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/resume/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setResumeAnalyzed(data.analyzed || false);
          setResumeScore(data.data?.score || null);
        }
      } catch (err) {
        console.error("Error checking resume status:", err);
      }

      setHydrated(true);
    };

    loadData();

    const onStorage = async (e) => {
      // Only listen for relevant changes
      if (e.key === 'token') {
        console.log('Storage event detected for token');
        const loadedAttempts = await fetchAttempts();
        setAttempts(loadedAttempts);
      }
    };
    
    const onUpdated = () => {
      console.log('Attempts updated event received');
      reloadAttempts();
    };

    const onLocalStorageChange = async (e) => {
      if (e.detail?.key === 'token') {
        console.log('Local storage change detected');
        const loadedAttempts = await fetchAttempts();
        setAttempts(loadedAttempts);
      }
    };

    // Also listen for focus event to refresh when user comes back to the tab
    const onFocus = () => {
      reloadAttempts();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('attempts-updated', onUpdated);
    window.addEventListener('local-storage-change', onLocalStorageChange);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('attempts-updated', onUpdated);
      window.removeEventListener('local-storage-change', onLocalStorageChange);
      window.removeEventListener('focus', onFocus);
    };
  }, [userId, user, reloadAttempts]);

  // Reload attempts when location changes (user navigates to dashboard)
  useEffect(() => {
    if (location.pathname === '/dashboard' && hydrated) {
      reloadAttempts();
    }
  }, [location.pathname, hydrated, reloadAttempts]);

  // Refresh user data periodically
  useEffect(() => {
    if (refreshUserData) {
      refreshUserData();
    }
  }, [refreshUserData]);

  const typeAgg = aggregateByType(attempts);
  const recentInterviews = recentFromAttempts(attempts);
  const overallScores = attempts.filter(a => typeof a.scorePercent === 'number').map(a => a.scorePercent);
  const overallAverage = overallScores.length ? Math.round(overallScores.reduce((s, v) => s + v, 0) / overallScores.length) : 0;
  const totalInterviews = attempts.length;

  // Enhanced Performance data with dates and better formatting
  const attemptsWithScores = attempts
    .filter(a => typeof a.scorePercent === 'number')
    .sort((a, b) => (b.timestamp || b.id || 0) - (a.timestamp || a.id || 0)) // Sort descending (newest first)
    .slice(0, 10) // Show last 10 attempts
    .reverse(); // Reverse to show oldest to newest on graph

  const performanceData = attemptsWithScores.map((attempt, idx) => {
    const timestamp = attempt.timestamp || attempt.id || Date.now();
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      name: `T-${idx + 1}`,
      attemptName: `Test ${idx + 1}`,
      fullDate: `${dateStr}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      score: attempt.scorePercent,
      attempt: idx + 1,
      type: attempt.type || attempt.mode || 'mcq'
    };
  });

  // Calculate trend (improving or declining)
  const recentScores = performanceData.slice(-5).map(d => d.score);
  const earlierScores = performanceData.slice(0, 5).map(d => d.score);
  const recentAvg = recentScores.length ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
  const earlierAvg = earlierScores.length ? earlierScores.reduce((a, b) => a + b, 0) / earlierScores.length : 0;
  const isImproving = recentAvg > earlierAvg;
  const trendPercentage = earlierAvg > 0 ? Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100) : 0;

  // Best and worst scores
  const bestScore = performanceData.length > 0 ? Math.max(...performanceData.map(d => d.score)) : 0;
  const worstScore = performanceData.length > 0 ? Math.min(...performanceData.map(d => d.score)) : 0;

  // Check if user is truly new (no resume, no interviews)
  const isNewUser = !resumeAnalyzed && totalInterviews === 0;
  const hasResume = resumeAnalyzed;
  const hasInterviews = totalInterviews > 0;

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 mt-16 md:mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8 flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-4xl font-bold">
                Welcome back, {userName}!
              </h1>
              <p className="text-xs md:text-base text-gray-400 mt-1">
                {isNewUser
                  ? "Let's get started with your interview preparation journey."
                  : "Here's your progress overview."
                }
              </p>
            </div>
          </motion.div>

          {/* ✅ New User Onboarding */}
          {isNewUser && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-blue-400" size={24} />
                  Getting Started with Pathwise
                </h2>
                <p className="text-gray-300 mb-6">
                  Welcome to your journey! Follow these steps to get the most out of Pathwise:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <h3 className="font-semibold mb-1">Upload Your Resume</h3>
                        <p className="text-sm text-gray-400 mb-3">Get AI-powered feedback and unlock your personalized roadmap</p>
                        <button
                          onClick={() => document.getElementById('resume-upload')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Upload Resume →
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <h3 className="font-semibold mb-1">Practice Interviews</h3>
                        <p className="text-sm text-gray-400 mb-3">Start with a mock interview to build confidence</p>
                        <button
                          onClick={() => navigate('/interview')}
                          className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                          Start Interview →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ✅ Resume Analysis Section (Inline) */}
          {!hasResume && (
            <motion.div variants={itemVariants} className="mb-8" id="resume-upload">
              <DashboardCard>
                <ResumeUploadSection />
              </DashboardCard>
            </motion.div>
          )}

          {/* Resume Score Card (if analyzed) */}
          {hasResume && resumeScore && (
            <motion.div variants={itemVariants} className="mb-8">
              <DashboardCard className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 flex items-center gap-2">
                      <FileText className="text-blue-400 h-5 w-5 md:h-6 md:w-6" />
                      Resume Analysis Complete
                    </h3>
                    <p className="text-xs md:text-base text-gray-400">Your resume has been analyzed successfully.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="relative h-16 md:h-24 w-16 md:w-24 shrink-0">
                      <svg className="h-full w-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-800" strokeWidth="3" />
                        <motion.circle
                          cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="3"
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 100 - resumeScore }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base md:text-2xl font-bold">{resumeScore}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/personalized-roadmap')}
                      className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs md:text-sm transition-colors"
                    >
                      View Roadmap
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Enhanced Performance Chart */}
              {hasInterviews ? (
                <DashboardCard className="bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold mb-1 flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 md:h-5 md:w-5 ${isImproving ? 'text-green-400' : 'text-red-400'}`} />
                        Performance Overview
                      </h2>
                      <p className="text-xs text-gray-400">
                        Track your interview performance over time
                      </p>
                    </div>
                    {/* Trend Indicator */}
                    {performanceData.length >= 5 && (
                      <div className="mt-4 sm:mt-0 flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg text-xs ${isImproving ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                          <div className="text-gray-400 mb-0.5">Trend</div>
                          <div className={`font-bold ${isImproving ? 'text-green-400' : 'text-red-400'}`}>
                            {isImproving ? '↑' : '↓'} {Math.abs(trendPercentage)}%
                          </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs">
                          <div className="text-gray-400 mb-0.5">Average</div>
                          <div className="font-bold text-blue-400">{overallAverage}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats Cards */}
                  {performanceData.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                      <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10 text-center">
                        <div className="text-[9px] md:text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider">Best</div>
                        <div className="text-sm md:text-lg font-bold text-green-400">{bestScore}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10 text-center">
                        <div className="text-[9px] md:text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider">Avg</div>
                        <div className="text-sm md:text-lg font-bold text-blue-400">{overallAverage}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10 text-center">
                        <div className="text-[9px] md:text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider">Total</div>
                        <div className="text-sm md:text-lg font-bold text-purple-400">{totalInterviews}</div>
                      </div>
                    </div>
                  )}

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="#374151" 
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="attemptName" 
                          stroke="#4b5563"
                          tick={{ fill: '#9ca3af', fontSize: 9 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          domain={[0, 100]}
                          tick={{ fill: '#9ca3af', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.95)",
                            border: "1px solid rgba(75, 85, 99, 0.5)",
                            borderRadius: "8px",
                            padding: "8px",
                            fontSize: "12px"
                          }}
                          labelStyle={{ color: '#e5e7eb', marginBottom: '4px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#a78bfa' }}
                          formatter={(value) => [`${value}%`, 'Accuracy']}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#colorScore)"
                          dot={{ r: 4, fill: "#3b82f6" }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Performance Insights */}
                  {performanceData.length >= 3 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-400 mb-3">Performance Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Improvement Rate</span>
                            <span className={`text-xs font-bold ${isImproving ? 'text-green-400' : 'text-red-400'}`}>
                              {isImproving ? '+' : ''}{trendPercentage}%
                            </span>
                          </div>
                            <div
                              className={`h-full ${isImproving ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                              style={{ width: `${Math.min(100, Math.abs(trendPercentage))}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Score Range</span>
                            <span className="text-sm font-bold text-blue-400">
                              {worstScore}% - {bestScore}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${((bestScore - worstScore) / 100) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </DashboardCard>
              ) : (
                <DashboardCard>
                  <EmptyStateCard
                    icon={Bot}
                    title="No Interview Data Yet"
                    description="Complete your first mock interview to see your performance analytics and track your progress over time."
                    actionText="Start Your First Interview"
                    actionLink="/interview"
                    navigate={navigate}
                  />
                </DashboardCard>
              )}

              {/* Recent Activity */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Book className="mr-3 h-5 w-5 text-purple-400" />
                  Recent Activity
                </h2>
                {hasInterviews ? (
                  <ul className="space-y-4">
                    {recentInterviews.map((interview) => (
                      <li
                        key={interview.id}
                        className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-default"
                      >
                        <div>
                          <p className="font-medium">{interview.type} Interview</p>
                          <p className="text-sm text-gray-400">{interview.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-purple-400">
                            {interview.score}
                          </p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-2">No recent activity</p>
                    <p className="text-sm">Your completed interviews will appear here</p>
                  </div>
                )}
              </DashboardCard>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Interview Strengths */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <LayoutGrid className="mr-3 h-5 w-5 text-purple-400" />
                  Interview Strengths
                </h2>
                {hasInterviews ? (
                  <div className="space-y-4">
                    {typeAgg.map((t) => (
                      <div key={t.type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="font-medium">{t.label}</div>
                        <div className="text-right">
                          <div className="text-purple-400 font-bold">{t.average}%</div>
                          <div className="text-xs text-gray-500">{t.attempts} {t.attempts === 1 ? 'attempt' : 'attempts'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Complete interviews to see your strengths by category</p>
                  </div>
                )}
              </DashboardCard>

              {/* Your Stats */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart className="mr-3 h-5 w-5 text-purple-400" />
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Interviews Completed</span>
                    <span className="font-bold">{totalInterviews}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Average Score</span>
                    <span className="font-bold">{overallAverage}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Resume Analyzed</span>
                    <span className={`font-bold flex items-center gap-1 ${hasResume ? 'text-green-400' : ''}`}>
                      {hasResume ? <><CheckCircle size={14} /> Yes</> : 'No'}
                    </span>
                  </p>
                </div>
              </DashboardCard>

              {/* Progress Tracker */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-3 h-5 w-5 text-purple-400" />
                  Progress Tracker
                </h2>
                <div className="space-y-4">
                  {hasInterviews ? (
                    <>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Technical Skills</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 1.1)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 1.1)))}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Communication</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 0.9)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 0.9)))}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Problem Solving</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 1.05)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 1.05)))}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Progress bars will appear after your first interview</p>
                    </div>
                  )}
                </div>
              </DashboardCard>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/interview')}
                className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all text-left group"
              >
                <Bot className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Practice Interview</h3>
                <p className="text-sm text-gray-400">Start a new mock interview session</p>
              </button>

              <button
                onClick={() => navigate('/resume-analyzer')}
                className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all text-left group"
              >
                <FileText className="text-green-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Full Resume Analysis</h3>
                <p className="text-sm text-gray-400">Detailed report & feedback</p>
              </button>

              <button
                onClick={() => navigate('/personalized-roadmap')}
                className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all text-left group"
              >
                <TrendingUp className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Career Roadmap</h3>
                <p className="text-sm text-gray-400">
                  {hasResume ? 'View your personalized plan' : 'Upload resume to unlock'}
                </p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}